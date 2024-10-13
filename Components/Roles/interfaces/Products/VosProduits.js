import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';


const AddProducts = ({ route }) => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const categoryId = route.params.itemId;
  const actions = route.params.itemaction;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const endpoint = actions === 0 
      ? 'http://192.168.11.106/alx/alx/Components/Roles/interfaces/phpfolderv2/getproducts.php'
      : 'http://192.168.11.106/alx/alx/Components/Roles/interfaces/phpfolderv2/getproductpage.php';

    axios
      .post(endpoint, {
        id_categorie: categoryId,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        setItems(response.data);
        setFilteredItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = items.filter(item => 
      item.libeller.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleCardPress = (item) => {
    console.log('Card pressed:', item);
    // navigation.navigate('gotodetails', { productinfos: item });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity key={index} style={styles.itemCard} onPress={() => handleCardPress(item)}>
      <Image source={{ uri: `http://192.168.11.106/alx/alx/Components/Roles/interfaces/Products/${item.image}` }} style={styles.itemImage} />
      <View style={styles.grid}>
        <Text style={styles.itemName}>{item.libeller}</Text>
        <Text style={styles.itemValue}><Text style={styles.itemLabel}>Category: </Text>{item.nom_categorie}</Text>
        <Text style={[styles.itemValue, styles.blueText]}><Text style={styles.itemLabel}>Prix: </Text>${item.prix_ht}</Text>
        <Text style={[styles.itemValue, styles.blueText]}><Text style={styles.itemLabel}>Quantiter_stock: </Text>{item.quantiter_stock}</Text>
        <Text style={[styles.itemValue, styles.blueText]}><Text style={styles.itemLabel}>Tva: </Text>{item.tva}</Text>
      </View>
    </TouchableOpacity>
  );

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
      <View style={styles.heads}>
        <Text style={styles.sectionTitle}>Most Popular</Text>
      </View>
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.itemsContainer}
        ListEmptyComponent={loading ? <Text>Loading...</Text> : <Text>No products found</Text>}
      />
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
  itemLabel: {
    fontSize: 14,
    color: '#000', // Black color for labels
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 14,
    color: '#0D98BA', // Blue color for values
    marginBottom: 8,
  },
  blueText: {
    color: '#0D98BA', // Optional: Ensure values are consistently blue
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginLeft: '38%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    marginLeft: 1,
    marginVertical: 8,
  },
  itemsContainer: {
    margin: 16,
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 4, // Ensuring space between cards
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    color: '#0D98BA',
    marginBottom: 8,
  },
});

export default AddProducts;
