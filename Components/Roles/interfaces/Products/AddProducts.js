import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Importing FontAwesome5 for example
import axios from 'axios';

const AddProducts = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/getproductpage.php');
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCardPress = (item) => {
    console.log('Card pressed:', item);
    navigation.navigate('gotodetails', { productinfos: item });
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
    placeholder="Search..."
  />
  <TouchableOpacity style={styles.filterButton}>
  <FontAwesome5 name="filter" size={22} color="#fff" />

  </TouchableOpacity>
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
            items.map((item, index) => (
              <TouchableOpacity key={index} style={styles.itemCard} onPress={() => handleCardPress(item)}>
                <Image source={{ uri: `http://10.20.74.42/logo/Components/Roles/interfaces/Products/${item.image}` }} style={styles.itemImage} />
                <Text style={styles.itemName}>{item.libeller}</Text>
                <Text style={styles.itemPrice}>{`$${item.prix_ht}`}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
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
    fontSize:12,
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
    marginLeft:135,
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
  filterButton: {
    backgroundColor: '#0D98BA',
    borderRadius: 8,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginLeft:1,
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
    marginLeft:15,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 13,
    marginLeft:15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    marginLeft:15,
    color: '#0D98BA',
    marginBottom: 4,
  },
});

export default AddProducts;
