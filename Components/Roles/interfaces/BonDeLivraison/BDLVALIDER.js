import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { URL } from '@env';


const BDLVALIDER = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await axios.get(
          'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getbonvalider.php'
        );
        if (response.data.message === 'got data') {
          setData(response.data.userData);
        } else {
          console.log('No data retrieved');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error retrieving user data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [data]);

  const filterClients = () => {
    return data.filter((item) =>
      `${item.id_bonvalider} ${item.nom_client} ${item.prenom_client} ${item.cin} ${item.addresse_client} ${item.localisation}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(item)}>
      <Text style={styles.label}>
        Bon #{item.id_bonvalider}         Commande #{item.id_commande}
      </Text>
      <Text style={styles.cardText}>
        Operateur #{item.id_operateur}  Livreur #{item.id_livreur}
      </Text>
      <Text style={styles.cardText}>
        Vendeur #{item.id_vendeur}     Commerciale #{item.id_commerciale}
      </Text>
      <Text style={styles.label}>
        Client #{item.id_client}        Nom: {item.nom_client} {item.prenom_client}
      </Text>
      <Text style={styles.cardText}>
        Telephone: {item.telephone_client}    Adresse: {item.localisation}  MT: ${item.montant_totale}
      </Text>
      <Text style={styles.cardText}>
        Date: {item.date_livraison}
      </Text>
    </TouchableOpacity>
  );

  const handleUserPress = (user) => {
    // Handle user press (e.g., navigate to a user details screen)
    console.log('User pressed:', user);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Bons valider</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID Bonlivraison"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={filterClients()}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id_bonvalider.toString()}
          style={styles.userListContainer}
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
  header: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    color: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userListContainer: {
    flex: 1,
  },
  userItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 10,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold', // Make labels bold
    color: '#333',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
});

export default BDLVALIDER;
