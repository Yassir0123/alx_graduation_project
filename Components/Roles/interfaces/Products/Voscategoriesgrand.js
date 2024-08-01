import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import axios from 'axios';

const Voscategoriesgrand = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleShowAll = () => {
    navigation.navigate('gotocategories', { itemaction: 1 });
  };

  const handleCardPress = (item) => {
    console.log("Card pressed:", item);  // Add log
    navigation.navigate('gotocategories', { itemId: item.id_grandcategorie, itemaction: 0 }); // pass the id here with action 0
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/getcategoriesgrand.php');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const filteredCategories = data.filter(category =>
    category.nom_categorie.toLowerCase().includes(search.toLowerCase())
  );

  const renderCategoryCard = ({ item }) => (
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
          <Text style={styles.sectionTitle}>Categories</Text>
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
          keyExtractor={(item) => item.id_grandcategorie.toString()}
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
    elevation: 15,
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
});

export default Voscategoriesgrand;
