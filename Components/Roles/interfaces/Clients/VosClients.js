import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

const VosClients = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const email = await AsyncStorage.getItem('email');
        const fullName = await AsyncStorage.getItem('fullname');
        setFullName(fullName);
        if (userId !== null && email !== null) {
          console.log('User ID:', userId);
          console.log('Email:', email);

          const response = await axios.post(
           'http://192.168.11.106/alx/alx/Components/Roles/interfaces/phpfolderv2/getclient.php',
            {
              userId: userId,
              email: email,
            },
            {
              responseType: 'json',
            }
          );

          if (response.data.message === 'got data') {
            setData(response.data.userData);
          } else {
            console.log('No data retrieved');
          }

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

  const filterClients = () => {
    return data.filter((item) =>
      `${item.nom} ${item.prenom} ${item.id_client} ${item.cin} ${item.addresse} ${item.localisation}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <FontAwesome name="user-circle" size={40} color="#6D28D9" />
        <View style={styles.headerText}>
          <Text style={styles.customerName}>{item.nom} {item.prenom}</Text>
          <Text style={styles.shopName}>CIN: {item.cin}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <Text style={styles.detailText}>ID: {item.id_client}</Text>
        <Text style={styles.detailText}>Adresse: {item.addresse}</Text>
        <Text style={styles.detailText}>Localisation: {item.localisation}</Text>
       <Text style={styles.detailText}>Date_naissance: {item.date_naissance}</Text>
       <Text style={styles.detailText}>Téléphone: {item.telephone_client}</Text>
      </View>
    </View>
  );

  const handleUserPress = (user) => {
    // Handle user press (e.g., navigate to a user details screen)
    console.log('User pressed:', user);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={20} color="#6D28D9" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, ID, CIN, address, or location"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={filterClients()}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id_client.toString()}
          style={styles.userListContainer}
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
  headerContainer: {
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 3,
    marginTop: 10,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VosClients;
