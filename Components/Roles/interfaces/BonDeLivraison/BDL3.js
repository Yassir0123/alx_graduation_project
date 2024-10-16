import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { 
  Provider as PaperProvider, 
  Appbar, 
  Card, 
  Title, 
  Paragraph, 
  List, 
  Button,
  FAB,
  Portal,
  Modal,
  useTheme,
  configureFonts,
  DefaultTheme,
  IconButton,
  Divider,
  Surface,
  Badge,
  TextInput,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { updateProduct, AddProductToCommand, deleteProduct } from './FunctionsCRUD';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Custom theme setup
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#54a599',
    accent: '#ff4081',
    background: '#f5f5f5',
    surface: '#ffffff',
    error: '#B00020',
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

// Custom hook for slide-in animation
const useSlideInAnimation = (delay = 0) => {
  const slideAnim = useRef(new Animated.Value(-50)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, [slideAnim, delay]);

  return slideAnim;
};

// ProductCard component
const ProductCard = ({ product, onEdit, onDelete }) => {
  const theme = useTheme();
  const {
    id_lignecommande,
    libeller,
    prix,
    quantiter,
    nom_categorie,
    description,
    images,
    tva,
    id_produit
  } = product || {};

  return (
    <Surface style={styles.productCard}>
      <Image source={{ uri: `http://192.168.125.68/alx/alx/Components/Roles/interfaces/Products/${images}` }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Title style={styles.productName}>{libeller}</Title>
        <Paragraph style={styles.productPrice}>${prix}</Paragraph>
        <View style={styles.productMetadata}>
          <Badge size={24} style={[styles.badge, { backgroundColor: '#5D3FD3' }]}>{quantiter}</Badge>
          <Paragraph style={styles.productCategory}>{nom_categorie}</Paragraph>
        </View>
        <Paragraph style={styles.productDescription} numberOfLines={2}>{description}</Paragraph>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity onPress={() => onEdit(product)}>
          <Ionicons name="pencil" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(id_lignecommande,quantiter,id_produit)}>
          <Ionicons name="trash" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </Surface>
  );
};

// EditProductModal component
const EditProductModal = ({ visible, product, onDismiss, onSave }) => {
  const [editedProduct, setEditedProduct] = useState(product || {
    libeller: '',
    prix: '',
    quantiter: 0,
    nom_categorie: '',
    description: '',
    tva: 0
  });

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
      <Title>Edit Product</Title>
      <TextInput
        label="Name"
        value={editedProduct.libeller}
        onChangeText={(text) => setEditedProduct({ ...editedProduct, libeller: text })}
        style={styles.input}
        disabled={true} // Add this lin
      />
      <TextInput
        label="Price"
        value={editedProduct.prix.toString()}
        onChangeText={(text) => setEditedProduct({ ...editedProduct, prix: parseFloat(text) || 0 })}
        keyboardType="numeric"
        style={styles.input}
        disabled={true} // Add this lin
      />
      <TextInput
        label="Quantity"
        value={editedProduct.quantiter.toString()}
        onChangeText={(text) => setEditedProduct({ ...editedProduct, quantiter: parseInt(text) || 0 })}
        keyboardType="numeric"
        style={styles.input}

      />
      <TextInput
        label="Category"
        value={editedProduct.nom_categorie}
        onChangeText={(text) => setEditedProduct({ ...editedProduct, nom_categorie: text })}
        style={styles.input}
        disabled={true} // Add this lin
      />
      <TextInput
        label="Description"
        value={editedProduct.description}
        onChangeText={(text) => setEditedProduct({ ...editedProduct, description: text })}
        multiline
        style={styles.input}
        disabled={true} // Add this lin
      />
      <Button onPress={handleSave} mode="contained" style={styles.saveButton}>Save</Button>
      <Button onPress={onDismiss}>Cancel</Button>
    </Modal>
  );
};

// CommandScreen component
const CommandScreen = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [commandDate, setCommandDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const [status, setStatus] = useState('Processing');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [productsgotten,setProductsgotten] = useState([]);
  const theme = useTheme();
  const [oldqt,setOldqt] = useState(0);
  const slideAnim = useSlideInAnimation();
  const selectedCommande = route.params.selectedCommande;
  const selectedLivreur = route.params.selectedLivreur;
  const initialProductData = route.params.commandProducts;
  const bonclay = route.params.bonclay;
  const generateRandomDescription = () => {
    const descriptions = [
      "High-quality product with excellent features.",
      "A must-have item for everyday use.",
      "Innovative design meets functionality.",
      "Perfect for both personal and professional use.",
      "Enhance your lifestyle with this amazing product."
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchClientData = async () => {
        try {
          console.log('hey');
          const response = await axios.post(
            'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/getlignecommande.php',
            {
              idcmdcount: selectedCommande[0].id_commande,
            },
            {
              responseType: 'json',
            }
          );
          const responsed = await axios.post(
            'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/getproductpage.php',
            {
              responseType: 'json',
            }
          );
          setProductsgotten(responsed.data);

          console.log(response.data.userData);
          
          const productsWithDescriptions = response.data.userData.map(product => ({
            ...product,
            description: generateRandomDescription()
          }));

          setProducts(productsWithDescriptions);
          calculateTotalAmount(productsWithDescriptions);
          setLoading(false);
        } catch (error) {
         // console.error('Error fetching client data:', error);
          setLoading(false);
        }
      };

      fetchClientData();
    }, [selectedCommande[0]])
  );

  const calculateTotalAmount = (products) => {
    const total = products.reduce((acc, product) => {
      const productTotal = product.prix * product.quantiter;
      const productTotalWithTVA = productTotal + (productTotal * product.tva);
      return acc + productTotalWithTVA;
    }, 0);
    setTotalAmount(total);
  };
  const handleCancel = async () => {
    try {
      const response = await axios.post(
        'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/deletecmd.php' ,
        {
          idcmdcount: selectedCommande[0].id_commande,
        },
        {
          responseType: 'json',
        }
      );
  
      if (response.data.message === 'Data deleted successfully') {
        navigation.navigate('Commandes');
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.error('Error deleting command:', error);
    }
  };
  
  const handlepress = async () => {
    

   const userId = await AsyncStorage.getItem('userId');
   
   console.log(selectedCommande[0].id_commande);
   console.log(selectedCommande[0].nom_client);
   console.log(selectedCommande[0].prenom_client);
   console.log(selectedCommande[0].localisation);
   console.log(totalAmount.toFixed(2));
   console.log(userId);
   console.log(selectedCommande[0].id_client);
   console.log(selectedCommande[0].id_commerciale);
   console.log(selectedCommande[0].id_vendeur);
   console.log(selectedCommande[0].telephone);
   console.log(selectedCommande[0].date_livraison);
   console.log(selectedLivreur[0].id_livreur);
  const response = await axios.post(
     'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/validatebon.php',
     {
      id: selectedCommande[0].id_commande,
       nom:selectedCommande[0].nom_client,
       prenom:selectedCommande[0].prenom_client,
       localisation:selectedCommande[0].localisation,
       mt:totalAmount.toFixed(2),
       userid:userId,
       idvend:selectedCommande[0].id_vendeur||0,
       idcom:selectedCommande[0].id_commerciale,
       idclient:selectedCommande[0].id_client,
       tel:selectedCommande[0].telephone,
       date:selectedCommande[0].date_livraison,
       idliv:selectedLivreur[0].id_livreur,
     },
     {
       responseType: 'json',
     }
   );
    if(response.data.message==='Data inserted successfully'){
     navigation.navigate('BDL1');
    }else{
     console.log(response.data);
    }



  };



  const editProduct = (product) => {
    setEditingProduct(product);
    setOldqt(product.quantiter);
    console.log('qt',oldqt);
    setEditModalVisible(true);
  };

  const saveEditedProduct = (editedProduct) => {
    
    const matchedProduct = productsgotten.find(p => p.id_produit === editedProduct.id_produit);
    //we compare with the original quantity before we took off the edited one, aka it's the old quantity ! so basically the current stock+ what's taken, this will give the effect that we are talking about the modifications and limits as long as we don't surpass the old 
    if (editedProduct.quantiter > matchedProduct.quantiter_stock+oldqt) {
      console.log('surpassed');
     }
    else{
    const updatedProducts = products.map(p => p.id_lignecommande === editedProduct.id_lignecommande ? editedProduct : p);
    setProducts(updatedProducts);
    calculateTotalAmount(updatedProducts);
    console.log('hi: ', editedProduct);
    const editedProd = [
      id = editedProduct.id_lignecommande,
      quantiter = editedProduct.quantiter,
      idprod=editedProduct.id_produit,
    ];
    console.log(editedProd);
    updateProduct(editedProd);
  }
  };

  const deleteProducts = (id,quantiter,id_produit) => {
    const updatedProducts = products.filter(product => product.id_lignecommande !== id);
    setProducts(updatedProducts);
    calculateTotalAmount(updatedProducts);
    console.log(id,quantiter,id_produit);
    deleteProduct(id,quantiter,id_produit);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedCommande[0].date_livraison;
    setShowDatePicker(false);
    setCommandDate(selectedCommande[0].date_livraison);
  };

  const formatDateForSQL = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.container}>
        <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Note Information</Title>
              <Divider style={styles.divider} />
              <View style={styles.commandInfo}>
                <Paragraph style={styles.commandInfoLabel}>Note ID:</Paragraph>
                <Paragraph style={styles.commandInfoValue}>BON{bonclay}</Paragraph>
              </View>
              <View style={styles.commandInfo}>
                <Paragraph style={styles.commandInfoLabel}>Order:</Paragraph>
              
                  <Paragraph style={styles.commandInfoValue}>CMD{selectedCommande[0].id_commande}</Paragraph>
         
              </View>
              <View style={styles.commandInfo}>
                <Paragraph style={styles.commandInfoLabel}>Date:</Paragraph>
              
                  <Paragraph style={styles.commandInfoValue}>{selectedCommande[0].date_livraison}</Paragraph>
         
              </View>
              <View style={styles.commandInfo}>
                <Paragraph style={styles.commandInfoLabel}>Delivery Person:</Paragraph>
                <Paragraph style={styles.commandInfoValue}>{selectedLivreur[0].nom } {selectedLivreur[0].prenom } </Paragraph>
              </View>
              <View style={styles.commandInfo}>
                <Paragraph style={styles.commandInfoLabel}>Total Amount:</Paragraph>
                <Paragraph style={styles.commandInfoValue}>${totalAmount.toFixed(2)}</Paragraph>
              </View>
            </Card.Content>
          </Card>

          <Title style={styles.sectionTitle}>Products</Title>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            products.map(product => (
              <ProductCard 
                key={product.id_lignecommande} 
                product={product} 
                onEdit={editProduct} 
                onDelete={deleteProducts} 
              />
            ))
          )}

          <Portal>
            <EditProductModal
              visible={editModalVisible}
              product={editingProduct}
              onDismiss={() => setEditModalVisible(false)}
              onSave={saveEditedProduct}
            />
          </Portal>
          
          {showDatePicker && (
            <DateTimePicker
              value={commandDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </Animated.View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon={() => <Ionicons name="checkmark" size={24} color="#fff" />}
        color={theme.colors.accent}
        label="Validate"
        onPress={() => { handlepress() }}
      />
    </PaperProvider>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  commandInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  commandInfoLabel: {
    fontWeight: 'bold',
  },
  commandInfoValue: {
    color: 'blue',
  },
  productCard: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
  },
  productMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  badge: {
    marginRight: 8,
  },
  productCategory: {
    fontSize: 14,
    color: '#555',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 50,
  },
  input: {
    marginBottom: 12,
  },
  saveButton: {
    marginBottom: 12,
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor:'#54a599'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  statusBadge: {
    padding: 0,
  },

  
});

export default CommandScreen;