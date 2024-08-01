import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const AddCategory = ({ route }) => {
  const getdata=route.params.category;
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [addData, setAddData] = useState('');
  const [editData, setEditData] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log(getdata);
      const response = await axios.post('http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/getcategoriesid.php', {
        id_categorie: getdata.id_grandcategorie,
      });
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
        setSelectedImage(result.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleAddCategory = async () => {
    if (addData && selectedImage) {
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'category_image.jpg',
        });

        const responseImage = await fetch('http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/uploadimage.php', {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });

        const imageResponseData = await responseImage.json();
        if (imageResponseData.success) {
          const response = await axios.post('http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/addcategorie.php', {
            nomcat: addData,
            image: imageResponseData.filePath,
            id_grandcategorie:getdata.id_grandcategorie,
          });
          setAddModalVisible(false);
          setAddData('');
          setSelectedImage(null);
          fetchData();
        } else {
          console.log('Image upload failed:', imageResponseData.message);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.log('Missing required properties in addData or selectedImage');
    }
  };

  const handleEditCategory = (category) => {
    setEditData(category.nom_categorie);
    setSelectedItem(category.id_categorie);
    setEditModalVisible(true);
  };

  const handleUpdateCategory = async () => {
    if (editData && selectedItem) {
      try {
        const response = await axios.post('http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/updatecategorie.php', {
          id: selectedItem,
          nomcat: editData,
          image: selectedImage, // Add the selected image path to the request
        });
        setEditModalVisible(false);
        setEditData('');
        setSelectedImage(null);
        fetchData();
      } catch (error) {
        console.error('Error updating category:', error);
      }
    } else {
      console.log('Missing required properties in editData or selectedItem');
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      const response = await axios.post('http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/deletecategorie.php', {
        id: category.id_categorie,
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const renderCategoryCard = ({ item }) => (
    <View style={styles.categoryCard}>
      <Image source={{ uri: `http://10.20.74.42/logo/Components/Roles/interfaces/Products/${item.image}` }} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.nom_categorie}</Text>
      <TouchableOpacity style={styles.editButton} onPress={() => handleEditCategory(item)}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCategory(item)}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
        <FlatList
          data={filteredCategories}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item.id_categorie.toString()}
          numColumns={2}
        />
      </ScrollView>

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
          <TouchableOpacity style={styles.updateButton} onPress={handleAddCategory}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
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
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateCategory}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
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
    backgroundColor: '#fff', // changed from 'red' to '#fff'
    borderRadius: 8,
    padding: 12,
    margin: 9,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000', // added
    shadowOffset: { width: 0, height: 2 }, // added
    shadowOpacity: 0.25, // added
    shadowRadius: 4, // added
    elevation: 15, // added (for Android)
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

export default AddCategory;
