import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

// Item component
const Item = ({ id, name, price, quantity, img, tva, onAddButtonPress }) => (
  <View style={styles.productCard}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: `http://192.168.11.105/alx/alx/Components/Roles/interfaces/Products/${img}` }} style={styles.productImage} />
    </View>
    <Text style={styles.productName}>{name}</Text>
    {price && <Text style={styles.productPrice}>{price} MAD</Text>}
    <TouchableOpacity style={styles.addButton} onPress={() => onAddButtonPress({ id, name, price, quantity, img, tva })}>
      <Text style={styles.addButtonText}>+</Text>
    </TouchableOpacity>
  </View>
);

// SubCategory component
const SubCategory = ({ name, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.subCategoryButton, isSelected && styles.subSelectedCategoryButton]}
    onPress={onPress}
  >
    <Text style={[styles.subCategoryText, isSelected && styles.subSelectedCategoryText]}>
      {name}
    </Text>
  </TouchableOpacity>
);

// Category component
const Category = ({ name, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.categoryButton, isSelected && styles.selectedCategoryButton]}
    onPress={onPress}
  >
    <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>{name}</Text>
  </TouchableOpacity>
);

// Main App component
export default function App() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { FournisseurData } = route.params || {};

  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const produitsResponse = await axios.post(
          'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getallproducts.php',
          { responseType: 'json' }
        );
        const subcategoriesResponse = await axios.post(
          'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getcategories.php',
          { responseType: 'json' }
        );
        const maincategoriesResponse = await axios.post(
          'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getcategoriesgrand.php',
          { responseType: 'json' }
        );
        console.log(FournisseurData);
        setProducts(produitsResponse.data);
        setSubCategories(subcategoriesResponse.data);
        setMainCategories(maincategoriesResponse.data);

        if (maincategoriesResponse.data.length > 0) {
          setSelectedMainCategory(maincategoriesResponse.data[0].nom_categorie);
        }
        if (subcategoriesResponse.data.length > 0) {
          setSelectedSubCategory(subcategoriesResponse.data.find(sub => sub.id_grandcategorie === maincategoriesResponse.data[0].id_grandcategorie)?.nom_categorie || '');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchClientData();
  }, [FournisseurData]);

  const handleAddButtonPress = (product) => {
    console.log('Client Data:', FournisseurData);
    console.log('Product Item:', product);

    navigation.navigate('PlaceCommand',{FournisseurData,product,selectedMainCategory,selectedSubCategory});
  };

  const filteredSubCategories = subCategories.filter(
    (subCategory) => mainCategories.find(
      (mainCategory) => mainCategory.nom_categorie === selectedMainCategory &&
                         mainCategory.id_grandcategorie === subCategory.id_grandcategorie
    )
  );

  const filteredData = products.filter(
    (item) => {
      const subCategory = subCategories.find(sub => sub.id_categorie === item.id_categorie);
      return subCategory && subCategory.nom_categorie === selectedSubCategory &&
             mainCategories.find(main => main.id_grandcategorie === subCategory.id_grandcategorie)?.nom_categorie === selectedMainCategory;
    }
  );

  return (
    <View style={styles.container}>
      <View style={styles.fixedCategoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {mainCategories.map((category) => (
            <Category
              key={category.id_grandcategorie}
              name={category.nom_categorie}
              isSelected={selectedMainCategory === category.nom_categorie}
              onPress={() => {
                setSelectedMainCategory(category.nom_categorie);
                setSelectedSubCategory(subCategories.find(sub => sub.id_grandcategorie === category.id_grandcategorie)?.nom_categorie || '');
              }}
            />
          ))}
        </ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {filteredSubCategories.map((subCategory) => (
            <SubCategory
              key={subCategory.id_categorie}
              name={subCategory.nom_categorie}
              isSelected={selectedSubCategory === subCategory.nom_categorie}
              onPress={() => setSelectedSubCategory(subCategory.nom_categorie)}
            />
          ))}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={styles.itemContainer}>
        <View style={styles.productsGrid}>
          {filteredData.map((item) => (
            <Item
              key={item.id_produit}
              id={item.id_produit}
              name={item.libeller}
              price={item.prix_ht}
              quantity={item.quantiter_stock}
              img={item.image}
              tva={item.tva}
              onAddButtonPress={handleAddButtonPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fixedCategoryContainer: {
    height: 100,
    paddingBottom: 10,
  },
  categoryContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  categoryButton: {
    padding: 10,
    height: 40,
  },
  selectedCategoryButton: {
    borderBottomWidth: 2,
    borderBottomColor: 'purple',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  subCategoryButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    justifyContent: 'center',
    height: 30,
  },
  subSelectedCategoryButton: {
    backgroundColor: '#6200ee',
  },
  subCategoryText: {
    fontSize: 16,
    color: '#333',
  },
  subSelectedCategoryText: {
    color: '#fff',
  },
  itemContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 14,
    marginTop: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5000ca',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});