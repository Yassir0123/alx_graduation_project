import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const VosVendeurs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  const Navigate = () => {
    navigation.navigate('Ajouter_un_Vendeur');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const email = await AsyncStorage.getItem('email');

        if (userId !== null && email !== null) {
          console.log('User ID:', userId);
          console.log('Email:', email);

          const response = await axios.post(
            'http://192.168.11.106/logo/Components/Roles/interfaces/phpfolderv2/getvendeur.php',
            {
              userId: userId,
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
  }, [data]);

  const filterVendeurs = () => {
    return data.filter((item) =>
      `${item.nom} ${item.prenom} ${item.id_vendeur}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  };

  const renderVendeurItem = ({ item }) => (
    <TouchableOpacity style={styles.vendeurItem} onPress={() => handleVendeurPress(item)}>
      <Text style={styles.vendeurName}>{item.nom} {item.prenom}</Text>
      <Text style={styles.vendeurInfo}>ID: {item.id_vendeur}</Text>
      <Text style={styles.vendeurInfo}>CIN: {item.cin}</Text>
      <Text style={styles.vendeurInfo}>Zone: {item.zone}</Text>
      <Text style={styles.vendeurInfo}>Email: {item.email}</Text>
      <Text style={styles.vendeurInfo}>Mot de passe: {item.password}</Text>
    </TouchableOpacity>
  );

  const handleVendeurPress = (vendeur) => {
    // Handle vendeur press (e.g., navigate to a vendeur details screen)
    console.log('Vendeur pressed:', vendeur);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Vos Vendeurs</Text>
        <TouchableOpacity style={styles.button} onPress={Navigate}>
          <View style={styles.buttonContent}>
          
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or ID"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={filterVendeurs()}
          renderItem={renderVendeurItem}
          keyExtractor={(item) => item.id_vendeur.toString()}
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

export default VosVendeurs;
