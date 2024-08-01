import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
const AddCategory = ({ route }) => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [addData, setAddData] = useState('');
  const categoryId = route.params.itemId; // HERE THE ID OF THE CATEGORY
  const actions=route.params.itemaction;
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  const handleShowAll = () => {
    navigation.navigate('gotoproducts', {  itemaction: 1 });
  };
  const handleCardPress = (item) => {
    navigation.navigate('gotoproducts', { itemId: item.id_categorie, itemaction: item.action }); // pass the id here
  };

  const fetchData = async () => {
    console.log(actions)
    try {
      if(actions===1){
      const response = await axios.get('http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/getcategories.php');
      setData(response.data);
       }else{
        console.log(categoryId);
        const response = await axios.post('http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/getcategoriesid.php', {
          id_categorie: categoryId,
        });
        console.log(response.data);
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filteredCategories = data.filter(category =>
    category.nom_categorie.toLowerCase().includes(search.toLowerCase())
  );
  const renderCategoryCard = ({ item, onPress }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.categoryCard}>
      <View>
        <Image source={{ uri: `http://10.20.74.42/logo/Components/Roles/interfaces/Products/${item.image}` }} style={styles.categoryImage} />
        <Text style={styles.categoryName}>{item.nom_categorie}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.head}>
          <Text style={styles.sectionTitle}>Sous Categories</Text>
          <TouchableOpacity onPress={handleShowAll}>
            <View style={styles.firstButton}>
              <Text style={styles.texts}>See all</Text>
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
 