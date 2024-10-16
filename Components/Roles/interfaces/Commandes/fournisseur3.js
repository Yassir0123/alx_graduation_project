import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated,
  TextInput,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const Fournisseur3 = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY] = useState(new Animated.Value(0));

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          const email = await AsyncStorage.getItem('email');

          if (userId !== null && email !== null) {
            console.log('User ID:', userId);
            console.log('Email:', email);

            const response = await axios.post(
              'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/getidsfournisseur.php',
              {
                userId: userId,
                email: email,
              },
              {
                responseType: 'json',
              }
            );

            if (response.data.message === 'got data') {
              console.log(response.data.userData);
              setData(response.data.userData);
            } else {
              console.log('No data retrieved');
            }
          } else {
            console.log('User data not found.');
          }

          setLoading(false);
        } catch (error) {
          console.error('Error retrieving user data:', error);
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const handleUser = async () => {
    if (selectedOption) {
      const selectedFournisseur = data.find((Fournisseur) => Fournisseur.id_fournisseur === selectedOption);
      if (selectedFournisseur) {
        console.log(selectedFournisseur);
        selectedFournisseur.action = 0;
        selectedFournisseur.modify = 0;
        console.log('modify:',selectedFournisseur.modify);
        navigation.navigate('Commande_Fournisseur', { FournisseurData: selectedFournisseur });
      }
    }
  };

  const renderFournisseurItem = ({ item }) => (
    <TouchableOpacity style={styles.clientItem} onPress={() => setOption(item.id_fournisseur)}>
      <Text style={styles.clientName}>{`#${item.id_fournisseur} - ${item.nom_entreprise}`}</Text>
    </TouchableOpacity>
  );

  const renderListHeader = () => (
    <>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8e8e93" />
        <TextInput 
          style={styles.searchInput}
          placeholder="Research a supplier"
          placeholderTextColor="#8e8e93"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
      </View>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sélectionner un fournisseur</Text>
      </View>
    </>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2feabd" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Animated.FlatList
        data={data}
        renderItem={renderFournisseurItem}
        keyExtractor={(item) => item.id_fournisseur.toString()}
        contentContainerStyle={styles.clientList}
        ListHeaderComponent={renderListHeader}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
      
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={selectedOption}
          onValueChange={(itemValue) => setOption(itemValue)}>
          {data.map((option) => (
            <Picker.Item
              key={option.id_fournisseur}
              label={`#${option.id_fournisseur} - ${option.nom_entreprise}`}
              value={option.id_fournisseur}
            />
          ))}
        </Picker>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleUser}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 12,
    height: 40,
    width: '97%',
    marginLeft: 10
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clientList: {
    paddingHorizontal: 16,
  },
  clientItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Fournisseur3;