import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const FournisseurCommande = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [roleUser, setRoleUser] = useState();
  const [editedData, setEditedData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const email = await AsyncStorage.getItem('email');
      const emailParts = email.split('@');
      const domain = emailParts[1];
      setRoleUser(domain);

      try {
        const response = await axios.post(
          'http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/getcommandtoday.php',
          {
            userId: userId,
          },
          {
            responseType: 'json',
          }
        );
 console.log('lol',response.data);
        if (response.data.message === 'got data') {
          // Assuming your API response contains a 'montant_payer' field
          setData(response.data.userData);
        } else {
          console.log('nothing');
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [data]); // Removed 'data' from the dependency array to prevent multiple requests

  const handleUser = async (user) => {
    setEditingUser(user);
    const FournisseurData = {
      idcmdcount: user.id_commandeachat,
      nom_entreprise: user.nom_entreprise,
      id_fournisseur: user.id_fournisseur,
      achat: user.id_achat,
      date_livraison: user.date_livraison,
      categorie_produit: user.categorie,
      telephone_contact: user.telephone,
      montanttotale: user.montant_totale,
      email_contact: user.email,
      action: 1,
    };

    // Generate the PDF content
    navigation.navigate('Commande_Fournisseur', { FournisseurData: FournisseurData });
  };
  const handleValidate = async (user) => {
    try {
      const responses = await axios.post(
        'http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/validerreception.php',
        {
          userid: user.id_commandeachat, // Use id_commandeachat for the selected card
        },
        {
          responseType: 'json',
        }
      );
    console.log(responses.data.message);
    }catch (error) {
      setLoading(false);
    }
  };

  const handleUsers = async (user) => {
    try {
      const responses = await axios.post(
        'http://10.20.74.42/logo/Components/Roles/interfaces/phpfolderv2/getligneachat.php',
        {
          idcmdcount: user.id_commandeachat, // Use id_commandeachat for the selected card
        },
        {
          responseType: 'json',
        }
      );

      setDatas(responses.data.userData); // Moved this line inside the try block

      // Create a table for the PDF content
      const tableRows = responses.data.userData
        .map(
          (rowData) => `
        <tr>
          <td>${rowData.id_produit}</td>
          <td>${rowData.libeller}</td>
          <td>${rowData.nom_categorie}</td>
          <td>${rowData.quantiter}</td>
          <td>${rowData.prix}</td>
          <td>${rowData.tva}</td>
        </tr>
      `
        )
        .join('');

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
                <td><strong>ID Achat:</strong> ${user.id_achat}</td>
                <td><strong>ID Commande:</strong> ${user.id_commandeachat}</td>
              </tr>
              <tr>
                <td><strong>ID Fournisseur:</strong> ${user.id_fournisseur}</td>
                <td><strong>Nom Entreprise:</strong> ${user.nom_entreprise}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong> ${user.email}</td>
                <td><strong>Téléphone:</strong> ${user.telephone}</td>
              </tr>
              <tr>
                <td><strong>Montant Total:</strong> ${user.montant_totale}</td>
                <td><strong>Date Livraison:</strong> ${user.date_livraison}</td>
              </tr>
            </table>
            <h2>Produits</h2>
            <table>
              <thead>
                <tr>
                  <th>ID Produit</th>
                  <th>Libellé</th>
                  <th>Catégorie</th>
                  <th>Quantité</th>
                  <th>Prix</th> 
                  <th>TVA</th>
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
    } catch (error) {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) =>
    item.nom_entreprise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.label}>ID: {item.id_commandeachat}</Text>
          <Text style={styles.label}>Id_achat: {item.id_achat}</Text>
          <Text style={styles.label}>Id_fournisseur: {item.id_fournisseur}</Text>
          <Text style={styles.label}>Nom_entreprise: {item.nom_entreprise}</Text>
          <Text style={styles.label}>email: {item.email}</Text>
          <Text style={styles.label}>telephone: {item.telephone}</Text>
          <Text style={styles.label}>categorie: {item.categorie}</Text>
          <Text style={styles.label}>Montant_total: {item.montant_totale}</Text>
          <Text style={styles.label}>date_livraison: {item.date_livraison}</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleUser(item, 0)}>
            <Text style={styles.buttonText}>Visualiser</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleUsers(item, 0)}>
            <Text style={styles.buttonText}>PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleValidate(item, 0)}>
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </View>
      </View>
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

      {/* Add spacing here */}
      <View style={{ paddingTop: 20 }}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Commandes</Text>
        </View>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_commandeachat.toString()}
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

export default FournisseurCommande;
