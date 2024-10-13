import React, { useState, useContext, createContext, useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { 
  Provider as PaperProvider, 
  Appbar, 
  Card, 
  Title, 
  Paragraph, 
  Chip, 
  List, 
  Button,
  useTheme,
  configureFonts,
  DefaultTheme,
  ProgressBar,
  Portal,
  Modal,
  TextInput,
  Menu,
  ActivityIndicator,
} from 'react-native-paper';
import { Ionicons, FontAwesome, AntDesign, Feather } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3f51b5',
    accent: '#ff4081',
  },
  fonts: configureFonts({
    default: {
      regular: {
        fontFamily: 'Roboto',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'Roboto-Medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'Roboto-Light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'Roboto-Thin',
        fontWeight: 'normal',
      },
    },
  }),
};

const OrderContext = createContext();

const useSlideInAnimation = (delay = 0) => {
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, [slideAnim, delay]);

  return slideAnim;
};

const OrderItemsScreen = ({route}) => {
  const navigation = useNavigation();
  const [address, setAddress] = useState('');
  const theme = useTheme();
  const slideAnim = useSlideInAnimation();
  const { products } = route.params;
  const [loading, setLoading] = useState(true);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fournisseursResponse = await axios.post(
          'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getfournisseurs.php',
          { responseType: 'json' }
        );
        const categoriesResponse = await axios.post(
          'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getcategories.php',
          { responseType: 'json' }
        );
        setFournisseurs(fournisseursResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const orderDetails = {
    product: products.libeller,
    orderNumber: products.nom_categorie,
    orderDate: products.prix_ht,
    sku: products.quantiter_stock,
  };

  const OrderInfoItem = ({ icon, title, content }) => {
    const itemSlideAnim = useSlideInAnimation(title.length * 50);
    return (
      <Animated.View style={{ transform: [{ translateX: itemSlideAnim }] }}>
        <List.Item
          title={title}
          description={content}
          left={props => <View {...props}>{icon}</View>}
        />
      </Animated.View>
    );
  };

  const handleChooseImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setEditingProduct(prev => ({...prev, newImage: result.assets[0].uri}));
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleEdit = () => {
    setEditingProduct({
      ...products,
      fournisseur: fournisseurs.find(f => f.id_fournisseur === products.id_fournisseur)?.nom_entreprise || '',
      id_fournisseur: products.id_fournisseur,
      id_categorie: categories.find(c => c.nom_categorie === products.nom_categorie)?.id_categorie,
      newImage: null,
    });
    setEditModalVisible(true);
  };

  const handleSave = async (editedProduct) => {
    try {
      setLoading(true);
      let imageUrl = editedProduct.image;
      
      if (editedProduct.newImage) {
        const uniqueFilename = `product_image_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.jpg`;
        const formData = new FormData();
        formData.append('file', {
          uri: editedProduct.newImage,
          type: 'image/jpeg',
          name: uniqueFilename,
        });
  
        const imageResponse = await fetch('http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/uploadimage.php', {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (!imageResponse.ok) {
          throw new Error(`Image upload failed: ${imageResponse.statusText}`);
        }
  
        const imageResponseData = await imageResponse.json();
        if (imageResponseData.success) {
          imageUrl = imageResponseData.filePath;
        } else {
          throw new Error(`Image upload failed: ${imageResponseData.message}`);
        }
      }
  
      const response = await axios.post('http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/updateproduit.php', {
        id_produit: editedProduct.id_produit,
        quantiter_stock: editedProduct.quantiter_stock,
        tva: editedProduct.tva / 100,
        categorie: editedProduct.id_categorie,
        libelle: editedProduct.libeller,
        prix_ht: editedProduct.prix_ht,
        image: imageUrl,
        id_fournisseur: editedProduct.id_fournisseur,
      });
  
      if (response.data.success) {
        navigation.navigate('gotoaddproduct');
      } else {
        throw new Error(`Failed to update product: ${response.data.message}`);
      }
    } catch (error) {
      // console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/deleteproduct.php', {
        id_produit: products.id_produit,
      });
      navigation.navigate('gotoaddproduct');
    } catch (error) {
      // console.error('Error deleting product:', error);
      Alert.alert('Error', 'Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const EditProductModal = ({ visible, product, onDismiss, onSave }) => {
    const [editedProduct, setEditedProduct] = useState(product || {});
    const [showFournisseurMenu, setShowFournisseurMenu] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  
    useEffect(() => {
      if (product) {
        setEditedProduct(product);
      }
    }, [product]);
  
    const handleSave = () => {
      onSave(editedProduct);
      onDismiss();
    };
  
    return (
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContent}>
        <ScrollView>
          <Title>Edit Product</Title>
          <TextInput
            label="Name"
            value={editedProduct.libeller}
            onChangeText={(text) => setEditedProduct({ ...editedProduct, libeller: text })}
            style={styles.input}
          />
          <TextInput
            label="Quantity"
            value={editedProduct.quantiter_stock?.toString()}
            onChangeText={(text) => setEditedProduct({ ...editedProduct, quantiter_stock: parseInt(text) || 0 })}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="TVA"
            value={editedProduct.tva !== undefined ? editedProduct.tva.toString() : ''}
            onChangeText={(text) => {
              const parsedValue = parseFloat(text);
              setEditedProduct({ ...editedProduct, tva: isNaN(parsedValue) ? 0 : parsedValue });
            }}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <TextInput
            label="Price"
            value={editedProduct.prix_ht?.toString()}
            onChangeText={(text) => setEditedProduct({ ...editedProduct, prix_ht: parseFloat(text) || 0 })}
            keyboardType="numeric"
            style={styles.input}
          />
          <Menu
            visible={showCategoryMenu}
            onDismiss={() => setShowCategoryMenu(false)}
            anchor={
              <TouchableOpacity onPress={() => setShowCategoryMenu(true)}>
                <TextInput
                  label="Category"
                  value={categories.find(c => c.id_categorie === editedProduct.id_categorie)?.nom_categorie || ''}
                  editable={false}
                  style={styles.input}
                />
              </TouchableOpacity>
            }
          >
            {categories.map((category) => (
              <Menu.Item
                key={category.id_categorie}
                onPress={() => {
                  setEditedProduct({ ...editedProduct, id_categorie: category.id_categorie });
                  setShowCategoryMenu(false);
                }}
                title={category.nom_categorie}
              />
            ))}
          </Menu>
          <Menu
            visible={showFournisseurMenu}
            onDismiss={() => setShowFournisseurMenu(false)}
            anchor={
              <TouchableOpacity onPress={() => setShowFournisseurMenu(true)}>
                <TextInput
                  label="Supplier"
                  value={fournisseurs.find(f => f.id_fournisseur === editedProduct.id_fournisseur)?.nom_entreprise || ''}
                  editable={false}
                  style={styles.input}
                />
              </TouchableOpacity>
            }
          >
            {fournisseurs.map((fournisseur) => (
              <Menu.Item
                key={fournisseur.id_fournisseur}
                onPress={() => {
                  setEditedProduct({ ...editedProduct, id_fournisseur: fournisseur.id_fournisseur });
                  setShowFournisseurMenu(false);
                }}
                title={fournisseur.nom_entreprise}
              />
            ))}
          </Menu>
          <Button onPress={handleChooseImage} mode="outlined" style={styles.imageButton}>
            Choose Image
          </Button>
          {(editedProduct.newImage || editedProduct.image) && (
            <Image 
              source={{ uri: editedProduct.newImage || `http://192.168.11.105/alx/alx/Components/Roles/interfaces/Products/${editedProduct.image}` }} 
              style={styles.selectedImage} 
            />
          )}
          <Button onPress={handleSave} mode="contained" style={styles.saveButton}>Save</Button>
          <Button onPress={onDismiss}>Cancel</Button>
        </ScrollView>
      </Modal>
    );
  };

  return (
    <OrderContext.Provider value={orderDetails}>
      <PaperProvider theme={theme}>
        <ScrollView style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
          ) : (
            <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: `http://192.168.11.105/alx/alx/Components/Roles/interfaces/Products/${products.image}` }}
                      style={styles.productImage}
                    />
                  </View>
                </Card.Content>
              </Card>

              <Card style={styles.card}>
                <Card.Content>
                  <Title>Product Details</Title>
                  <OrderInfoItem 
                    icon={<FontAwesome name="shopping-bag" size={24} color={theme.colors.primary} />} 
                    title="Product" 
                    content={orderDetails.product} 
                  />
                  <OrderInfoItem 
                    icon={<AntDesign name="tags" size={24} color={theme.colors.primary} />} 
                    title="Category" 
                    content={orderDetails.orderNumber} 
                  />
                  <OrderInfoItem 
                    icon={<AntDesign name="question" size={24} color={theme.colors.primary} />} 
                    title="Price" 
                    content={`$${orderDetails.orderDate}`} 
                  />
                  <OrderInfoItem 
                    icon={<FontAwesome name="hashtag" size={24} color={theme.colors.primary} />} 
                    title="Quantity" 
                    content={orderDetails.sku} 
                  />
                </Card.Content>
              </Card>

              <Button 
                mode="contained" 
                onPress={handleEdit} 
                style={styles.trackButton}
                icon={() => <Ionicons name="pencil" size={20} color="#fff" />}
              >
                Edit
              </Button>
              
              <Button 
                mode="contained" 
                onPress={handleDelete} 
                style={styles.deletebutton}
                icon={() => <Ionicons name="trash" size={20} color="#fff" />}
              >
                Delete
              </Button>
            </Animated.View>
          )}
        </ScrollView>

        <Portal>
          <EditProductModal
            visible={editModalVisible}
            product={editingProduct}
            onDismiss={() => setEditModalVisible(false)}
            onSave={handleSave}
          />
        </Portal>

      </PaperProvider>
    </OrderContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  appbar: {
    elevation: 0,
    backgroundColor: '#3f51b5',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 8,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  productImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  contactName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  trackButton: {
    marginTop: 16,
  },
  deletebutton: {
    marginTop: 16,
    backgroundColor:'red',
  },
  statusContainer: {
    marginTop: 16,
  },
  statusTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  estimatedDelivery: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 70,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  input: {
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 10,
  },
  imageButton: {
    marginVertical: 10,
  },
  selectedImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
});

export default OrderItemsScreen;