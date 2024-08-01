import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const VosFournisseurs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');

  const Navigate = () => {
    navigation.navigate('Ajout_Fournisseur2');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const email = await AsyncStorage.getItem('email');
        const fullName = await AsyncStorage.getItem('fullname');

        if (userId !== null && email !== null) {
          /* console.log('User ID:', userId);
          console.log('Email:', email);
          console.log('hey');*/
               
          const response = await axios.get(
            'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getfournisseurs.php',
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
  }, []);

  const filterFournisseur = () => {
    return data.filter((item) =>
      `${item.categorie_produit} ${item.nom_entreprise} ${item.id_fournisseur}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  };

  const renderFournisseurItem = ({ item }) => (
    <TouchableOpacity style={styles.vendeurItem} onPress={() => handleVendeurPress(item)}>
      <Text style={styles.vendeurName}>ID Fournisseur: {item.id_fournisseur}</Text>
      <Text style={styles.vendeurInfo}>Nom Entreprise: {item.nom_entreprise}</Text>
      <Text style={styles.vendeurInfo}>Email Contact: {item.email_contact}</Text>
      <Text style={styles.vendeurInfo}>Téléphone Contact: {item.telephone_contact}</Text>
      <Text style={styles.vendeurInfo}>Catégorie Produit: {item.categorie_produit}</Text>
      <Text style={styles.vendeurInfo}>Adresse: {item.adresse}</Text>
      <Text style={styles.vendeurInfo}>Ville: {item.ville}</Text>
      <Text style={styles.vendeurInfo}>Pays: {item.pays}</Text>
      <Text style={styles.vendeurInfo}>Code Postal: {item.code_postal}</Text>
    </TouchableOpacity>
  );
  
  const handleVendeurPress = (vendeur) => {
    // Handle vendeur press (e.g., navigate to a vendeur details screen)
    console.log('Vendeur pressed:', vendeur);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bienvenue {fullName}</Text>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Vos Fournisseurs</Text>
        <TouchableOpacity style={styles.button} onPress={Navigate}>
          <View style={styles.buttonContent}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="chercher par entreprise ou ID"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={filterFournisseur()}
          renderItem={renderFournisseurItem}
          keyExtractor={(item) => item.id_fournisseur.toString()}
          style={styles.vendeurListContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  }, 
  title:{
    fontSize:20,
    fontWeight:'bold',
    marginBottom:20
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#040200',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendeurListContainer: {
    flex: 1,
  },
  vendeurItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 10,
    padding: 16,
  },
  vendeurName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  vendeurInfo: {
    fontSize: 16,
    color: '#555',
  },
});

export default VosFournisseurs;
