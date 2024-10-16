import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Atraiter = () => {
  const [data, setData] = useState([]);
  const [fullName, setFullName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedFullName = await AsyncStorage.getItem('fullname');
        // Set the fullName state with the retrieved value
        setFullName(storedFullName);

        const response = await axios.get(
          'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/getnewcmds.php',
        );
        setData(response.data.userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [data]);

  const handlePress = async (user) => {
    //console.log('infos:', user);
    let responses = [];

    try {
      responses = await axios.post(
        'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/getlignecommande.php',
        {
          idcmdcount: user.id_commande, // Use id_commandeachat for the selected card
        },
        {
          responseType: 'json',
        }
      );
    } catch (error) {
      console.error('Error fetching ligne commande:', error);
    }

    const pdfContent = `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>Commande Details</h1>
          <table>
            <tr>
              <td><strong>ID:</strong> ${user.id_commande}</td>
              <td><strong>Client ID:</strong> ${user.id_client}</td>
            </tr>
            <tr>
              <td><strong>First Name:</strong> ${user.nom_client}</td>
              <td><strong>Second Name:</strong> ${user.prenom_client}</td>
            </tr>
            <tr>
              <td><strong>Localization:</strong> ${user.localisation}</td>
              <td><strong>Total Amount:</strong> ${user.montant_totale}</td>
            </tr>
            <tr>
              <td><strong>Deliery Date:</strong> ${user.date_livraison}</td>
            </tr>
          </table>
          <h2>Products</h2>
          <table>
            <thead>
              <tr>
                <th>id_product</th>
                <th>label</th>
                <th>Cateogry_name</th>
                <th>quantity</th>
                <th>price</th>
                <th>tva</th>
              </tr>
            </thead>
            <tbody>
              ${responses.data.userData.map((item) => `
                <tr>
                  <td>${item.id_produit}</td>
                  <td>${item.libeller}</td>
                  <td>${item.nom_categorie}</td>
                   <td>${item.quantiter}${['charcuterie', 'gourmet'].includes(item.nom_categorie.toLowerCase()) ? ' g' : ''}</td>
                  <td>${item.prix}</td>
                  <td>${item.tva}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      // Print the PDF
      const { uri } = await Print.printToFileAsync({ html: pdfContent });

      // Share the PDF
      await Sharing.shareAsync(uri);
    } catch (error) {
     // console.error('Error printing and sharing:', error);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Orders To Process</Text>
      {data && data.length > 0 ? (
        data.map((item) => (
          <TouchableOpacity key={item.id_commande} onPress={() => handlePress(item)}>
            <View style={styles.card}>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Order ID:</Text>
                <Text style={styles.value}>{item.id_commande}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Commerciale Id:</Text>
                <Text style={styles.value}>{item.id_commerciale}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Client Id:</Text>
                <Text style={styles.value}>{item.id_client}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>First Name:</Text>
                <Text style={styles.value}>{item.nom_client}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Second Name:</Text>
                <Text style={styles.value}>{item.prenom_client}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Localization:</Text>
                <Text style={styles.value}>{item.localisation}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Total Amount:</Text>
                <Text style={styles.value}>{item.montant_totale}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.label}>Delivery Date:</Text>
                <Text style={styles.value}>{item.date_livraison}</Text>
              </View>
            
            </View>
          </TouchableOpacity>
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
    marginLeft: -125,
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
    elevation: 3,
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
    marginRight: 10,
  },
  title:{
    fontSize:20,
    fontWeight:'bold',
    marginBottom:20
  },
  deleteButton: {
    backgroundColor: 'red',
    width: 80,
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
