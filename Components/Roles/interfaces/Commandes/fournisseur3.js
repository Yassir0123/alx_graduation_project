import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {URL} from '@env'
const Fournisseur3 = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setOption] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const email = await AsyncStorage.getItem('email');

        if (userId !== null && email !== null) {
          console.log('User ID:', userId);
          console.log('Email:', email);

          const response = await axios.post(
            'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getidsfournisseur.php',
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
  }, []);

  const handleUser = async () => {
    if (selectedOption) {
      const selectedFournisseur = data.find((Fournisseur) => Fournisseur.id_fournisseur === selectedOption);
      if (selectedFournisseur) {

        console.log(selectedFournisseur);
        selectedFournisseur.action=0;
        console.log(  selectedFournisseur.action);
     
         navigation.navigate('Commande_Fournisseur', { FournisseurData: selectedFournisseur });
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2feabd" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.text}>N°Fournisseur</Text>
        <Picker
          style={styles.picker}
          selectedValue={selectedOption}
          onValueChange={(itemValue) => setOption(itemValue)}>
          {data.map((option) => (
            <Picker.Item
              key={option.id_fournisseur}
              label={option.id_fournisseur.toString()}
              value={option.id_fournisseur}
            />
          ))}
        </Picker>
        <TouchableOpacity style={styles.button} onPress={handleUser}>
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerStyle: {
    width: 230,
    borderColor: 'gray',
    alignItems: 'flex-start',
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  picker: {
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#2feabd',
    width: 120,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 22,
    textAlign: 'center',
  },
  container: {
    height: '100%',
    justifyContent: 'center',
    backgroundColor: '#f0f4f3',
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 5,
    fontSize: 16,
    padding: 15,
    marginBottom: 15,
  },
  inputMessage: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 5,
    fontSize: 16,
    padding: 100,
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
  },
  form: {
    width: '80%',
    marginLeft: 20,
  },
});

export default Fournisseur3;
