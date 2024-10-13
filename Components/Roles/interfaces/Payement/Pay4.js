import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
const CustomerCard = ({ customer, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(customer)}>
      <View style={styles.header}>
        <FontAwesome name="user-circle" size={40} color="#6D28D9" />
        <View style={styles.headerText}>
          <Text style={styles.customerName}>Paiement #{customer.id_paiement}</Text>
          <Text style={styles.datePaiement}>{customer.date_paiement}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <Text style={styles.detailText}>Bon de Livraison: {customer.id_bonlivraison}</Text>
        <Text style={styles.detailText}>Client: {customer.prenom_client} {customer.nom_client}</Text>
        <Text style={styles.detailText}>Telephone: {customer.telephone_client}</Text>
        <Text style={styles.detailText}>Total Amount: {customer.montant_totale} MAD</Text>
        <Text style={styles.detailText}>Payment Method: {customer.moyen_paiement}</Text>
      </View>
    </TouchableOpacity>
  );
};

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [fullName, setFullName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const fullName = await AsyncStorage.getItem('fullname');
      setFullName(fullName);
      try {
        const response = await axios.post(
      'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getpay.php',
          { id: userId },
          { responseType: 'json' }
        );
        setCustomers(response.data.userData); // Use response.data.userData
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.prenom_client.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.nom_client.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCardPress = async (item) => {
    // Handle the press event here
    console.log('Pressed customer:', item);
    setLoading(true);
    try {
      const response = await axios.post(
    'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getprodbybon.php',
        { idbon: item.id_bonlivraison },
        { responseType: 'json' }
      );
        const userData = response.data.userData;
        generatePDF(item, userData);
    
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (transaction, userData) => {
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
          <h1>Payment Details</h1>
          <table>
            <tr>
              <td><strong>ID:</strong> ${transaction.id_paiement}</td>
              <td><strong>Client ID:</strong> ${transaction.id_client}</td>
            </tr>
            <tr>
              <td><strong>Client Name:</strong> ${fullName}</td>
              <td><strong>Client Phone:</strong> ${transaction.telephone_client}</td>
            </tr>
            <tr>
              <td><strong>Total Amount:</strong> ${transaction.montant_totale}</td>
              <td><strong>Payment Date:</strong> ${transaction.date_paiement}</td>
            </tr>
            <tr>
              <td><strong>Payment Method:</strong> ${transaction.moyen_paiement}</td>
              <td><strong>Delivery Person:</strong> ${transaction.nom_livreur} ${transaction.prenom_livreur}</td>
            </tr>
          </table>
          <h2>Order Details</h2>
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>TVA</th>
              </tr>
            </thead>
            <tbody>
              ${userData.map((item) => `
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
      const { uri } = await Print.printToFileAsync({ html: pdfContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error printing and sharing:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={20} color="#6D28D9" />
        <TextInput
          style={styles.searchInput}
          placeholder="Enter Name or Phone Number"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id_paiement.toString()}
        renderItem={({ item }) => <CustomerCard customer={item} onPress={handleCardPress} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 3,
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
  datePaiement: {
    color: '#6D28D9', // Purple color for date_paiement
  },
  details: {
    marginTop: 16,
  },
  detailText: {
    fontSize: 14,
    marginVertical: 2,
  },
});

export default App;
