import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BDL1 = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [roleUser, setRoleUser] = useState();
  const [editedData, setEditedData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const Navigate = () => {
    navigation.navigate('BDL2');
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      console.log(userId);
      const clientData = {
        id: userId,
      };

      const response = await axios.post(
        'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getbons.php',
        JSON.stringify(clientData), // Send the data as a JSON string
        {
          headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
          },
        }
      );
      setData(response.data.userData);
      console.log(response.data.message);
    };
    fetchData();
  }, []); // Removed 'data' from the dependency array to prevent multiple requests

  const handlePress =async (user) => {
    try {
      responses = await axios.post(
        'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getlignecommande.php',
        {
          idcmdcount: user.id_commande, // Use id_commandeachat for the selected card
        },
        {
          responseType: 'json',
        }
      );
    } catch (error) {
      setLoading(false);
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
        <h1>Bons ${user.id_bonlivraison} Details</h1>
        <table>
          <tr>
            <td><strong>Commande </strong> ${user.id_commande}</td>
            <td><strong>ID Client:</strong> ${user.id_client}</td>
          </tr>
          <tr>
          <td><strong>Operateur: </strong> ${user.id_operateur}</td>
          <td><strong>ID Livreur:</strong> ${user.id_livreur}</td>
        </tr>
          <tr>
            <td><strong>Nom:</strong> ${user.nom_client}</td>
            <td><strong>Prénom:</strong> ${user.prenom_client}</td>
          </tr>
          <tr>
            <td><strong>Localisation:</strong> ${user.localisation}</td>
            <td><strong>Montant Total:</strong> ${user.montant_totale}</td>
          </tr>
          <tr>
            <td><strong>Date Livraison:</strong> ${user.date_livraison}</td>
          </tr>
        </table>
        <h2>Produits</h2>
        <table>
          <thead>
            <tr>
              <th>id_produit</th>
              <th>libeller</th>
              <th>nom_categorie</th>
              <th>quantiter</th>
              <th>prix</th>
              <th>tva</th>
            </tr>
          </thead>
          <tbody>
            ${responses.data.userData.map((item) => `
              <tr>
                <td>${item.id_produit}</td>
                <td>${item.libeller}</td>
                <td>${item.nom_categorie}</td>
                <td>${item.quantiter}</td>
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
    console.error('Error printing and sharing:', error);
  }

   // console.log(responses.data.userData); 
    // Handle the press action here with the 'item' data
  //  console.log('Card Pressed:', item);
    // You can navigate or perform any other action here
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.label}>ID: {item.id_bonlivraison}</Text>
            <Text style={styles.label}>Id_commande: {item.id_commande}</Text>
            <Text style={styles.label}>id_operateur: {item.id_operateur}</Text>
            <Text style={styles.label}>Id_commerciale: {item.id_commerciale}</Text>
            <Text style={styles.label}>Id_vendeur: {item.id_vendeur}</Text>
            <Text style={styles.label}>Id_livreur: {item.id_livreur}</Text>
            <Text style={styles.label}>Id_client: {item.id_client}</Text>
            <Text style={styles.label}>Nom: {item.nom_client}</Text>
            <Text style={styles.label}>Prenom: {item.prenom_client}</Text>
            <Text style={styles.label}>Localisation: {item.localisation}</Text>
            <Text style={styles.label}>Montant_total: {item.montant_totale}</Text>
            <Text style={styles.label}>date_livraison: {item.date_livraison}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name"
        placeholderTextColor="#040200"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />

      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardText}>Total Bons</Text>
          <Text style={styles.summaryCardValue}>{data.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardText}>Total Montants</Text>
          <Text style={styles.summaryCardValue}>
            {data.reduce((total, item) => total + parseFloat(item.montant_totale || 0), 0).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Add spacing here */}
      <View style={{ paddingTop: 20 }}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bons de Livraison</Text>
          <TouchableOpacity style={styles.addButton} onPress={Navigate}>
            <View style={styles.addButtonContent}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_bonlivraison.toString()}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 2,
  },
  searchBar: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: '#040200',
    color: '#040200',
    fontSize: 18,
    padding: 10,
    marginBottom: 20,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: -10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 20,
    marginRight: 10,
    alignItems: 'center',
  },
  summaryCardText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryCardValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  flatList: {
    flex: 1,
    paddingTop: 20,
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#F9E076',
    width: '100%',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#040200',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#040200',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addButtonContent: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BDL1;
