import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const App = ({navigation}) => {
  const [transactions, setTransactions] = useState([]);
  const [totalMontantTotale, setTotalMontantTotale] = useState(0);
  const [recentPayments, setRecentPayments] = useState([]);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const fullName = await AsyncStorage.getItem('fullname');
      setFullName(fullName);
      console.log('name:',fullName);

      try {
        const response = await axios.post(
          'http://192.168.0.48/logo/Components/Roles/interfaces/phpfolderv2/getpaiementpage.php',
          { id: userId },
          { responseType: 'json' }
        );
        console.log(response.data);
        console.log('Response data:', response.data);

        if (response.data.message === 'gotdata') {
          setTransactions(response.data.data.userData || []);
          setTotalMontantTotale(response.data.data.montant_totale || 0);
          setRecentPayments(response.data.data.topFive || []);
        } else {
          console.error('No data found.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTransactionPress = async (item) => {
    console.log(item);
    setLoading(true);
    try {
      const response = await axios.post(
        'http://192.168.0.48/logo/Components/Roles/interfaces/phpfolderv2/getprodbybon.php',
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
                <th>VAT</th>
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
  const handleButtonPress = () => {
    navigation.navigate('Pay2');
  };
  const handlePress= ()=>{
    navigation.navigate('Pay4');
  }
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5a67d8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.billContainer}>
        <Text style={styles.totalBillText}>Total Due Bill</Text>
        <Text style={styles.billAmount}>${totalMontantTotale}</Text>
        <Text style={styles.monthText}>July</Text>
        <TouchableOpacity style={styles.payNowButton}>
          <Text style={styles.payNowText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.recentPaymentContainer}>
        <Text style={styles.recentPaymentTitle}>Recent Payment</Text>
        <TouchableOpacity style={styles.addButton}  onPress={() => handleButtonPress()}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View horizontal style={styles.avatarContainer}>
        {recentPayments.length > 0 ? (
          recentPayments.map((payment, index) => (
            <TouchableOpacity key={index} style={styles.avatarItem} onPress={() => handleTransactionPress(payment)}>
              <Image
                source={{ uri: 'https://icons.veryicon.com/png/o/business/multi-color-financial-and-business-icons/user-139.png' }}
                style={styles.avatarImage}
              />
              <Text style={styles.avatarName}>{payment.nom_client} {payment.prenom_client}</Text>
              <Text style={styles.avatarAmount}>${payment.montant_totale}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No recent payments found.</Text>
        )}
      </View>

      <View style={styles.transactionHeader}>
        <Text style={styles.transactionTitle}>Transactions</Text>
        <TouchableOpacity onPress={() => handlePress()}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {transactions.length > 0 ? (
        transactions.map((transaction, index) => (
          <TouchableOpacity key={index} style={styles.transactionItem} onPress={() => handleTransactionPress(transaction)}>
            <FontAwesome5 name="money-bill-alt" size={50} color="#5a67d8" style={styles.transactionIcon} />
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionName}>Payment #{transaction.id_paiement} {transaction.nom_client} {transaction.prenom_client}</Text>
              <Text style={styles.transactionPrice}>${transaction.montant_totale}</Text>
              <Text style={styles.transactionTime}>{transaction.date_paiement}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No transactions found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  billContainer: {
    backgroundColor: '#5a67d8',
    borderRadius: 10,
    margin: 20,
    padding: 20,
    alignItems: 'center',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  totalBillText: {
    fontSize: 18,
    color: '#fff',
  },
  billAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },
  monthText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  payNowButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  payNowText: {
    color: '#5a67d8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recentPaymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  recentPaymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#5a67d8',
    borderRadius: 50,
    padding: 10,
  },
  avatarContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    flexDirection:'row',
    padding:10,
    marginLeft:5,
  },
  avatarItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  avatarName: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  avatarAmount: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    color: '#5a67d8',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
    elevation:5,
  },
  transactionIcon: {
    marginRight: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionPrice: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  transactionTime: {
    marginTop: 5,
    fontSize: 12,
    color: '#999',
  },
});

export default App;
