import React, { useState, useRef, useEffect, cloneElement } from 'react';
import { View, Animated, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator,Linking } from 'react-native';
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
import { updateProduct, AddProductToCommand,deleteProduct } from './FunctionsCRUD2';
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
    id_lignecommandeachat,
    libeller,
    prix,
    quantiter,
    nom_categorie,
    description,
    images,
    tva
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
        <TouchableOpacity onPress={() => onDelete(id_lignecommandeachat)}>
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
  const [email,setEmail] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const theme = useTheme();
  const slideAnim = useSlideInAnimation();
  const { FournisseurData } = route.params;
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
        console.log('info:', FournisseurData.action)
        if(FournisseurData.action===0){
          try {
            //no need for response bc you're directly acting not expecting a response
            const response = await axios.post(
              'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/deletecmdachat.php',
              {
                idcmdcount: FournisseurData.idcmdcount,
              },
              {
                responseType: 'json',
              }
            );
          } catch (error) {
            console.error('Error deleting command:', error);
          }
        }
        
        try {
          const response = await axios.post(
            'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/getligneachat.php',
            {
              idcmdcount: FournisseurData.idcmdcount,
            },
            {
              responseType: 'json',
            }
          );

          console.log('lol',response.data.userData);
          
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
    }, [FournisseurData])
  );

  const calculateTotalAmount = (products) => {
    const total = products.reduce((acc, product) => {
      const productTotal = product.prix * product.quantiter;
      const productTotalWithTVA = productTotal + (productTotal * product.tva);
      return acc + productTotalWithTVA;
    }, 0);
    console.log('total:',total);
    setTotalAmount(total);
  };
  const handleCancel = async () => {
    try {
      const response = await axios.post(
        'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/deletecmd.php',
        {
          idcmdcount: clientData.idcmdcount,
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
console.log('i am here')
console.log('lo', FournisseurData)
    const email = await AsyncStorage.getItem('email');
    const formattedDate = formatDateForSQL(commandDate);
    setEmail(email);
    console.log(FournisseurData.idcmdcount);
    console.log(FournisseurData.nom_entreprise);
    console.log(FournisseurData.categorie_produit);
    console.log(FournisseurData.email_contact);
    console.log(FournisseurData.telephone_contact);
    console.log(FournisseurData.id_fournisseur);
    console.log(totalAmount);
    console.log(userId);
    console.log(formattedDate);
   
    if(FournisseurData.modify===0){
      console.log('firstcheck')
    const response = await axios.post(
      'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/validatecmdachat.php',
      {
       id: FournisseurData.id_fournisseur,
        nom:FournisseurData.nom_entreprise,
        categorie:FournisseurData.categorie_produit,
        email:FournisseurData.email_contact,
        telephone:FournisseurData.telephone_contact,
        idcmd:FournisseurData.idcmdcount,
        mt:totalAmount,
        userid:userId,
        date:formattedDate,
      },
      {
        responseType: 'json',
      }
    );
     if(response.data.message==='Data inserted successfully'){
      const messageContent = products.map((item) => `${item.libeller}: ${item.quantiter}`);
      const subject = encodeURIComponent('Demande de ravitallement');
      const body = encodeURIComponent(messageContent);
      const recipient = encodeURIComponent(FournisseurData.email_contact);
      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
      Linking.openURL(mailtoUrl)
      .then(() => {
        console.log('Email client opened successfully');
      })
      .catch((error) => {
        console.error('Error opening email client:', error);
      });
      navigation.navigate('OrderDelivered');
    } else {
      console.log(response.data);
    }
    }else{
      const response = await axios.post(
        'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/updatevalidateachat.php',
        {
          idcmd:FournisseurData.idcmdcount,
          mt:totalAmount,
          date:formattedDate
        },
        {
          responseType: 'json',
        }
      );
       if(response.data.message==='Data inserted successfully'){
        const messageContent = products.map((item) => `${item.libeller}: ${item.quantiter}`);
        const subject = encodeURIComponent('Demande de ravitallement');
        const body = encodeURIComponent(messageContent);
        const recipient = encodeURIComponent(FournisseurData.email_contact);
        const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
        Linking.openURL(mailtoUrl)
        .then(() => {
          console.log('Email client opened successfully');
        })
        .catch((error) => {
          console.error('Error opening email client:', error);
        });
        navigation.navigate('Commandes');
      } else {
        console.log(response.data);
      }
    }
  };

  const addProduct = () => {
    navigation.navigate('ScheduleDelivery', { FournisseurData: FournisseurData });
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setEditModalVisible(true);
  };

  const saveEditedProduct = (editedProduct) => {
    const updatedProducts = products.map(p => p.id_lignecommandeachat === editedProduct.id_lignecommandeachat ? editedProduct : p);
    setProducts(updatedProducts);
    calculateTotalAmount(updatedProducts);
    console.log('hi pop: ', editedProduct);
    const editedProd = [
      id = editedProduct.id_lignecommandeachat,
      quantiter = editedProduct.quantiter,
    ];
    console.log(editedProd);
    updateProduct(editedProd);
  };

  const deleteProducts = (id) => {
    const updatedProducts = products.filter(product => product.id_lignecommandeachat !== id);
    setProducts(updatedProducts);
    calculateTotalAmount(updatedProducts);
    console.log(id);
    deleteProduct(id);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || commandDate;
    setShowDatePicker(false);
    setCommandDate(currentDate);
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
              <Title style={styles.cardTitle}>Order Information</Title>
              <Divider style={styles.divider} />
              <View style={styles.commandInfo}>
                <Paragraph style={styles.commandInfoLabel}>Order ID:</Paragraph>
                <Paragraph style={styles.commandInfoValue}>CMD{FournisseurData.idcmdcount}</Paragraph>
              </View>
              <View style={styles.commandInfo}>
                <Paragraph style={styles.commandInfoLabel}>Date:</Paragraph>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Paragraph style={styles.commandInfoValue}>{formatDateForSQL(commandDate)}</Paragraph>
                </TouchableOpacity>
              </View>
              <View style={styles.commandInfo}>
                <Paragraph style={styles.commandInfoLabel}>Status:</Paragraph>
                <Badge size={24} style={[styles.statusBadge, { backgroundColor: theme.colors.accent }]}>{status}</Badge>
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
                key={product.id_lignecommandeachat} 
                product={product} 
                onEdit={editProduct} 
                onDelete={deleteProducts} 
              />
            ))
          )}

          <Button 
            mode="contained" 
            onPress={addProduct} 
            style={styles.addButton}
            icon={() => <Ionicons name="add" size={24} color="#fff" />}
          >
            Add Product
          </Button>
      {/*   <Button 
  mode="outlined" 
  onPress={handleCancel} 
  style={styles.cancelButton}
  icon={() => <Ionicons name="close" size={24} color="#ff4081" />}
>
  Cancel
</Button>*/} 

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
        label="Valider"
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
  addButton: {
    marginVertical: 16,
    borderRadius: 5
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
  cancelButton: {
    marginVertical: 16,
    borderRadius: 5,
    borderColor: '#ff4081',
    borderWidth: 1,
  },
  
});

export default CommandScreen;