import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LogBox } from 'react-native';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Key "cancelled" in the image picker result is deprecated',
  // Add any other warnings you want to ignore here
]);
const AddgrandCategory = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [addData, setAddData] = useState('');
  const [editData, setEditData] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/getcategoriesgrand.php');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filteredCategories = data.filter(category =>
    category.nom_categorie.toLowerCase().includes(search.toLowerCase())
  );

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
      const responseImage = await fetch('http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/uploadimage.php', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const imageResponseData = await responseImage.json();
      if (imageResponseData.success) {
        return imageResponseData.filePath;
      } else {
        throw new Error(imageResponseData.message || 'Image upload failed');
      }
    } catch (error) {
      //console.error('Error uploading image:', error);
      if (error.message === 'Network request failed' && retryCount < 3) {
        // Retry the operation up to 3 times
        return new Promise(resolve => {
          setTimeout(() => resolve(uploadImage(imageUri, retryCount + 1)), 1000);
        });
      }
      throw error;
    }
  };

  const handleAddCategory = async (retryCount = 0) => {
    if (addData && selectedImage) {
      setIsLoading(true);
      try {
        const imageUrl = await uploadImage(selectedImage);
        const response = await axios.post('http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/addcategoriegrand.php', {
          nomcat: addData,
          image: imageUrl,
        });
        setAddModalVisible(false);
        setAddData('');
        setSelectedImage(null);
        fetchData();
      } catch (error) {
       // console.error('Error adding category:', error);
        if (error.message === 'Network request failed' && retryCount < 3) {
          // Retry the operation up to 3 times
          setTimeout(() => handleAddCategory(retryCount + 1), 1000); // Wait 1 second before retrying
        } else {
          // If max retries reached or it's not a network error, show a user-friendly message
          alert('Unable to add category. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Missing required properties in addData or selectedImage');
    }
  };

  const handleCardPress=(item)=>{
    navigation.navigate('gotoaddcategorie', { category: item });
  }

  const handleEditCategory = (category) => {
    setEditData(category.nom_categorie);
    setSelectedItem(category.id_grandcategorie);
    setSelectedImage(null);
    setEditModalVisible(true);
  };

  const handleUpdateCategory = async (retryCount = 0) => {
    if (editData && selectedItem) {
      setIsLoading(true);
      try {
        let imageUrl = null;
        if (selectedImage) {
          imageUrl = await uploadImage(selectedImage);
        }
        const response = await axios.post('http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/updatecategoriegrand.php', {
          id: selectedItem,
          nomcat: editData,
          image: imageUrl,
        }, {
          timeout: 10000, // 10 seconds
        });
        setEditModalVisible(false);
        setEditData('');
        setSelectedImage(null);
        fetchData();
      } catch (error) {
       // console.error('Error updating category:', error);
        if ((error.message === 'Network request failed' || error.code === 'ECONNABORTED') && retryCount < 3) {
          // Retry the operation up to 3 times
          setTimeout(() => handleUpdateCategory(retryCount + 1), 1000); // Wait 1 second before retrying
        } else {
          // If max retries reached or it's not a network error, show a user-friendly message
          alert('Unable to update category. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Missing required properties in editData or selectedItem');
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      const response = await axios.post('http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/deletecategoriegrand.php', {
        id: category.id_grandcategorie,
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.categoryCard}>
      <Image source={{ uri: `http://192.168.125.68/alx/alx/Components/Roles/interfaces/Products/${item.image}` }} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.nom_categorie}</Text>
      <TouchableOpacity style={styles.editButton} onPress={() => handleEditCategory(item)}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCategory(item)}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <View style={styles.head}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity onPress={() => setAddModalVisible(true)}>
          <View style={styles.firstButton}>
            <Text style={styles.texts}>Add</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search categories..."
        value={search}
        onChangeText={setSearch}
      />
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={filteredCategories}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item.id_grandcategorie.toString()}
        numColumns={2}
      />

      <Modal visible={isAddModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setAddModalVisible(false)}>
            <Text style={{ fontSize: 40, marginLeft: '70%' }}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalHeader}>Add a Category</Text>
          <Text style={styles.labelText}>Choose a name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Category"
            onChangeText={(text) => setAddData(text)}
            value={addData}
          />
          <TouchableOpacity style={styles.button} onPress={handleChooseImage}>
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={{ width: 100, height: 100 }} />
          )}
          <TouchableOpacity style={styles.updateButton} onPress={handleAddCategory} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Adding...' : 'Add'}</Text>
          </TouchableOpacity>
          {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
      </Modal>

      <Modal visible={isEditModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setEditModalVisible(false)}>
            <Text style={{ fontSize: 40, marginLeft: '70%' }}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalHeader}>Edit a Category</Text>
          <Text style={styles.labelText}>Edit the name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Category"
            onChangeText={(text) => setEditData(text)}
            value={editData}
          />
          <TouchableOpacity style={styles.button} onPress={handleChooseImage}>
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={{ width: 100, height: 100 }} />
          )}
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateCategory} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Updating...' : 'Update'}</Text>
          </TouchableOpacity>
          {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  firstButton: {
    marginLeft: 110,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#36454F',
  },
  texts: {
    color: '#F9F6EE',
    fontSize:12,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: 9,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#36454F',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#36454F',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#36454F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#36454F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 16,
  },
});

export default AddgrandCategory;