import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
const VosFournisseurs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');

  const Navigate = () => {
    navigation.navigate('Ajout_Fournisseur2');
  };
  useFocusEffect(
    React.useCallback(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const email = await AsyncStorage.getItem('email');
        const fullName = await AsyncStorage.getItem('fullname');

        if (userId !== null && email !== null) {
          const response = await axios.get(
            'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getfournisseurs.php',
          );
          setData(response.data);
          setLoading(false);
        } else {
          console.log('User data not found.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [])
);

  const filterFournisseur = () => {
    return data.filter((item) =>
      `${item.categorie_produit} ${item.nom_entreprise} ${item.id_fournisseur}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  };

  const renderFournisseurItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleVendeurPress(item)}>
      <View style={styles.card}>
        <View style={styles.header}>
          <FontAwesome name="user-circle" size={40} color="#6D28D9" />
          <View style={styles.headerText}>
            <Text style={styles.customerName}>{item.nom_entreprise}</Text>
            <Text style={styles.shopName}>ID: {item.id_fournisseur}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>Email: {item.email_contact}</Text>
          <Text style={styles.detailText}>Phone Number: {item.telephone_contact}</Text>
          <Text style={styles.detailText}>Product Category: {item.categorie_produit}</Text>
          <Text style={styles.detailText}>Adress: {item.adresse}</Text>
          <Text style={styles.detailText}>City: {item.ville}</Text>
          <Text style={styles.detailText}>Country: {item.pays}</Text>
          <Text style={styles.detailText}>Zip Code: {item.code_postal}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const handleVendeurPress = (vendeur) => {
    console.log('Vendeur pressed:', vendeur);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Your Suppliers</Text>

      </View>
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={20} color="#6D28D9" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Supplier name or ID"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#6D28D9" />
      ) : (
        <FlatList
          data={filterFournisseur()}
          renderItem={renderFournisseurItem}
          keyExtractor={(item) => item.id_fournisseur.toString()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#6D28D9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 3,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 10,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  shopName: {
    color: '#6D28D9',
  },
  details: {
    marginTop: 16,
  },
  detailText: {
    fontSize: 14,
    marginVertical: 2,
  },
});

export default VosFournisseurs;