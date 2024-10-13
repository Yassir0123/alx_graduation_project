import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';
import {Picker} from '@react-native-picker/picker';

const AddProducts = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    libeller: '',
    prix_ht: '',
    quantiter_stock: '',
    tva: '',
    id_fournisseur: '',
    id_categorie: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async (retryCount = 0) => {
    try {
      const response = await axios.get('http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getproductpage.php');
      setItems(response.data);
      setFilteredItems(response.data);
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.message === 'Network Error' && retryCount < 3) {
        setTimeout(() => fetchData(retryCount + 1), 1000);
      } else {
        setLoading(false);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleCardPress = (item) => {
    navigation.navigate('OrderItemsScreen', { products: item });
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
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const uploadImage = async (imageUri, retryCount = 0) => {
    const uniqueFilename = `product_image_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.jpg`;
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: uniqueFilename,
    });

    try {
      const response = await fetch('http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/uploadimage.php', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseData = await response.json();
      if (responseData.success) {
        return responseData.filePath;
      } else {
        throw new Error(responseData.message || 'Image upload failed');
      }
    } catch (error) {
      if (error.message === 'Network Error' && retryCount < 3) {
        return new Promise(resolve => {
          setTimeout(() => resolve(uploadImage(imageUri, retryCount + 1)), 1000);
        });
      }
      throw error;
    }
  };

  const handleAdd = async (retryCount = 0) => {
    try {
      let imageUrl = '';
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      const response = await axios.post('http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/addproduit.php', {
        ...newProduct,
        tva: newProduct.tva,
        image: imageUrl,
      });

      if (response.data.success) {
        console.log('Product added successfully');
        setAddModalVisible(false);
        setNewProduct({
          libeller: '',
          prix_ht: '',
          quantiter_stock: '',
          tva: '',
          id_fournisseur: '',
          id_categorie: '',
        });
        setSelectedImage(null);
        fetchData();
      } else {
        throw new Error(response.data.error || response.data.message || 'Failed to add product');
      }
    } catch (error) {
      if (error.message === 'Network Error' && retryCount < 3) {
        setTimeout(() => handleAdd(retryCount + 1), 1000);
      }
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = items.filter(item => 
      item.libeller.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>
      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={24} color="#a1a1a1" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by product name..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView>
        <View style={styles.heads}>
          <Text style={styles.sectionTitle}>Produits</Text>
          <TouchableOpacity style={styles.firstbutton} onPress={() => setAddModalVisible(true)}>
            <Text style={styles.texts}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemsContainer}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            filteredItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.itemCard} onPress={() => handleCardPress(item)}>
                <Image source={{ uri: `http://192.168.11.105/alx/alx/Components/Roles/interfaces/Products/${item.image}` }} style={styles.itemImage} />
                <Text style={styles.itemName}>{item.libeller}</Text>
                <Text style={styles.itemPrice}>${item.prix_ht}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Add New Product</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Product Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter product name"
                  value={newProduct.libeller}
                  onChangeText={(text) => setNewProduct({ ...newProduct, libeller: text })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter price"
                  keyboardType="numeric"
                  value={newProduct.prix_ht}
                  onChangeText={(text) => setNewProduct({ ...newProduct, prix_ht: text })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                  value={newProduct.quantiter_stock}
                  onChangeText={(text) => setNewProduct({ ...newProduct, quantiter_stock: text })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>TVA (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter TVA"
                  keyboardType="numeric"
                  value={newProduct.tva}
                  onChangeText={(text) => setNewProduct({ ...newProduct, tva: text })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Supplier</Text>
                <Picker
                  selectedValue={newProduct.id_fournisseur}
                  style={styles.picker}
                  onValueChange={(itemValue) => setNewProduct({ ...newProduct, id_fournisseur: itemValue })}
                >
                  <Picker.Item label="Select Supplier" value="" />
                  {fournisseurs.map((fournisseur) => (
                    <Picker.Item key={fournisseur.id_fournisseur} label={fournisseur.nom_entreprise} value={fournisseur.id_fournisseur} />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Category</Text>
                <Picker
                  selectedValue={newProduct.id_categorie}
                  style={styles.picker}
                  onValueChange={(itemValue) => setNewProduct({ ...newProduct, id_categorie: itemValue })}
                >
                  <Picker.Item label="Select Category" value="" />
                  {categories.map((category) => (
                    <Picker.Item key={category.id_categorie} label={category.nom_categorie} value={category.id_categorie} />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity style={styles.imageButton} onPress={handleChooseImage}>
                <Text style={styles.imageButtonText}>Choose Image</Text>
              </TouchableOpacity>
              {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                  <Text style={styles.addButtonText}>Add Product</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setAddModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heads: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  firstbutton: {
    marginLeft: 110,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#36454F',
  },
  texts: {
    color: '#F9F6EE',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 135,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginLeft: 1,
    marginVertical: 8,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 16,
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 3,
  },
  itemImage: {
    width: '80%',
    marginLeft: 15,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 13,
    marginLeft: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    marginLeft: 15,
    color: '#0D98BA',
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  picker: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
  },
  imageButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
},
  imageButtonText: {
    color: '#333',
    fontSize: 16,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#0D98BA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default AddProducts;