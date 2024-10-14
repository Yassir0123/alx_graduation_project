
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
import axios from 'axios';
const BDL2 = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [livreur, setLivreur] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedCommande, setSelectCommande] = useState(''); // Set the default value here
  const [selectedLivreur, setSelectLivreur] = useState(''); // Set the default value here
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getlivreur.php');
        const responses = await axios.get('http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getidcmd2.php');
        console.log(response.data.message);
        console.log(responses.data.message);
        setData(responses.data.userData);
        setLivreur(response.data.userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  const handleUser = async () => {
    try {
   const selectedLivreurObj = livreur.find((item) => item.id_livreur === selectedLivreur);
   const selectedCommandeObj = data.find((item) => item.id_commande === selectedCommande);
   console.log( selectedCommandeObj.id_commande);
  console.log(selectedLivreurObj.id_livreur);
      // Make a GET request to the PHP endpoint with the selectedCommande ID
      const response = await axios.post(
        'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getcmdinfos.php',
        {
          id: selectedCommandeObj.id_commande, // Send only the ID value
        }
      );
      const responses = await axios.post(
        'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getlivreurbyid.php',
        {
          id: selectedLivreurObj.id_livreur, // Send only the ID value
        }
      );
      const responser = await axios.post(
        'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getlignecommande.php',
        {
          idcmdcount: selectedCommandeObj.id_commande, // Send only the ID value
        }
      );
      const responsed = await axios.get(
        'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/newbon.php',
      );
      // Check if the request was successful and the response contains data
       console.log('lol')
      if (response.data.message === 'gotdata'&&responses.data.message === 'gotdata'&&responser.data.message === 'got data') {
       
        console.log(response.data.userData);
        console.log(responses.data.userData);
        console.log(responser.data.userData);
        console.log(responsed.data);
        // Now you have commandData (nom, prenom, etc.) and ligneCommandeData (products)
  
          navigation.navigate('BDL3', {
          selectedCommande: response.data.userData,
          selectedLivreur: responses.data.userData,
          commandProducts: responser.data.userData,
          bonclay:responsed.data,
        });
      } else {
        console.log('Data not found or invalid response');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
        <Text style={styles.text}>Order ID</Text>
        <Picker
          style={styles.picker}
          selectedValue={selectedCommande}
          onValueChange={(itemValue) => setSelectCommande(itemValue)}
        >
          {data && data.length > 0 ? (
            data.map((option) => (
              <Picker.Item
                key={option.id_commande}
                label={option.id_commande.toString()}
                value={option.id_commande}
              />
            ))
          ) : (
            <Picker.Item label="No data for now" value="" />
          )}
        </Picker>
        <Text style={styles.text}>Delivery_Person ID</Text>
        <Picker
          style={styles.picker}
          selectedValue={selectedLivreur}
          onValueChange={(itemValue) => setSelectLivreur(itemValue)}
        >
          {livreur && livreur.length > 0 ? (
            livreur.map((option) => (
              <Picker.Item
                key={option.id_livreur}
                label={`#${option.id_livreur.toString()} -${option.nom} ${option.prenom}`}
                value={option.id_livreur}
              />
            ))
          ) : (
            <Picker.Item label="No data for now" value="" />
          )}
        </Picker>
        <TouchableOpacity style={styles.button} onPress={handleUser}>
          <Text style={styles.buttonText}>Validate</Text>
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
  picker: {
    backgroundColor: 'white',
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#007AFF',
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
  form: {
    width: '80%',
    marginLeft: 20,
  },
});
export default BDL2;