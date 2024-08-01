import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Atraiter = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      try {
        const response = await axios.post(
          'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getbonbyidliv.php',
          {
          
         id : userId,
          },
          {
            responseType: 'json',
          }
        );
        setData(response.data.userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [data]);
  const handleVisualize = (item) => {
    // Create a new variable and add the desired columns
    const clientData = {
      idcmdcount: item.id_commande,
      nom: item.nom_client,
      prenom: item.prenom_client,
      localisation: item.localisation,
      date_livraison: item.date_livraison,
      id_client: item.id_client,
     action:0,
    };
    // Now you have the modified item with the additional columns
    navigation.navigate('Ajouter_un_Produits', { clientData });
  
    // You can also store this modified item in a state variable if needed
    // For example, if you want to keep track of it for further use:
    // setModifiedItem(modifiedItem);
  };
  

  const handleDelete = async(id) => {
    // Remove the item with the given ID from the data
    const response = await axios.post(
      'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/deletebon.php',
      {
        id:id
      },
      {
        responseType: 'json',
      }
    );
  console.log(response.data);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Commande A Traiter</Text>
      {data && data.length > 0 ? ( // Check if data is not undefined and has items
        data.map((item) => (
          <View key={item.id_commande} style={styles.card}>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>id_bonlivraison:</Text>
              <Text style={styles.value}>{item.id_bonlivraison}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>id_operateur:</Text>
              <Text style={styles.value}>{item.id_operateur}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Id_commande:</Text>
              <Text style={styles.value}>{item.id_commande}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Id_commerciale:</Text>
              <Text style={styles.value}>{item.id_commerciale}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Id_vendeur:</Text>
              <Text style={styles.value}>{item.id_vendeur}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Id_client:</Text>
              <Text style={styles.value}>{item.id_client}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Nom:</Text>
              <Text style={styles.value}>{item.nom_client}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Prenom:</Text>
              <Text style={styles.value}>{item.prenom_client}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Localisation:</Text>
              <Text style={styles.value}>{item.localisation}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Montant_total:</Text>
              <Text style={styles.value}>{item.montant_totale}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Date_livraison:</Text>
              <Text style={styles.value}>{item.date_livraison}</Text>
            </View>
            <View style={styles.buttonContainer}>
     
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id_bonlivraison)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text>No data available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f4f3',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: -130,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
   marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
    color: '#000000',
  },
  value: {
    color: '#000000',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  visualizeButton: {
    backgroundColor: '#2feabd',
    width: 80,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 120,
  },
  deleteButton: {
    backgroundColor: 'red',
    width: 285,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
 
export default Atraiter;