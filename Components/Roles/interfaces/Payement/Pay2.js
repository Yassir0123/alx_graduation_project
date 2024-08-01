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
import { URL } from '@env';

const Pay2 = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setOption] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');

        const response = await axios.post(
          'http://192.168.0.48/logo/Components/Roles/interfaces/phpfolderv2/getbonbyidliv.php',
          {
            id: userId,
          },
          {
            responseType: 'json',
          }
        );

        setData(response.data.userData);
       
        setLoading(false);
      } catch (error) {
        console.error('Error retrieving user data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [data]);

  useEffect(() => {
    if (!selectedOption && data.length > 0) {
      setOption(data[0].id_bonlivraison);
    }
  }, [data, selectedOption]);

  const handleUser = async () => {
    if (selectedOption) {
      const selectedBonliv = data.find(
        (bonliv) => bonliv.id_bonlivraison === selectedOption
      );
      if (selectedBonliv) {
        console.log('lol',selectedBonliv);
        navigation.navigate('Pay5', { Bonlivraison: selectedBonliv });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.text}>N°Bon de Livraison</Text>
        <Picker
          style={styles.picker}
          selectedValue={selectedOption}
          onValueChange={(itemValue) => setOption(itemValue)}>
          {data.map((option) => (
            <Picker.Item
              key={option.id_bonlivraison}
              label={option.id_bonlivraison.toString()}
              value={option.id_bonlivraison}
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  form: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center', // Center items horizontally
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3f51b5',
    marginBottom: 15,
  },
  picker: {
    backgroundColor: '#e8eaf6',
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3f51b5',
    width: '100%',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center', // Center text horizontally
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Pay2;
