import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddProducts = ({ route }) => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryId = route.params.itemId; // HERE THE ID OF THE CATEGORY
  const actions=route.params.itemaction;

  useEffect(() => {
  
    if(actions===0){
    axios
      .post('http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/getproducts.php', {
        id_categorie: categoryId,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
    }
    else if(actions===1){
      axios
      .post('http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/getproductpage.php', {
        id_categorie: categoryId,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
    }else{
      console.log('nah no data ');
    }
  }, [items]);

  const handleCardPress = (item) => {
    console.log('Card pressed:', item);
    navigation.navigate('gotodetails', { productinfos: item });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#a1a1a1" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
        />
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.heads}>
          <Text style={styles.sectionTitle}>Most Popular</Text>
        </View>
        <View style={styles.itemsContainer}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            items.map((item, index) => (
<TouchableOpacity key={index} style={styles.itemCard} onPress={() => handleCardPress(item)}>
  <Image source={{ uri: `http://10.20.74.42/logo/Components/Roles/interfaces/Products/${item.image}` }} style={styles.itemImage} />
  <View style={styles.grid}>
    <Text style={styles.itemName}>{item.libeller}</Text>
    
    <Text style={styles.itemValue}><Text style={styles.itemLabel}>Category: </Text>{item.nom_categorie}</Text>
    
    <Text style={[styles.itemValue, styles.blueText]}><Text style={styles.itemLabel}>Prix: </Text>${item.prix_ht}</Text>
 
    <Text style={[styles.itemValue, styles.blueText]}><Text style={styles.itemLabel}>Quantiter_stock: </Text>{item.quantiter_stock}</Text>

    <Text style={[styles.itemValue, styles.blueText]}><Text style={styles.itemLabel}>Tva: </Text>{item.tva}</Text>
  </View>
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
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 3,
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
