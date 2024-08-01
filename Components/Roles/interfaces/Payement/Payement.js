import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios'; // Import axios for API requests
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]); // Initialize data as an empty array
  const [loading, setLoading] = useState(true);
  const [totalMontantPayer, setTotalMontantPayer] = useState(0); // Initialize totalMontantPayer as 0
  const [totalMontantTotale, setTotalMontantTotale] = useState(0); // Initialize totalMontantTotale as 0

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const clientData = {
        id: userId,
      };

      try {
        const response = await axios.post(
          'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getpay.php',
          clientData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        setData(response.data.userData); // Set the fetched data to the 'data' state

        // Calculate the total sum of montant_payer and montant_totale
        const totalPayer = response.data.userData.reduce((acc, item) => acc + parseFloat(item.montant_payer), 0);
        const totalTotale = response.data.userData.reduce((acc, item) => acc + parseFloat(item.montant_totale), 0);
        setTotalMontantPayer(totalPayer);
        setTotalMontantTotale(totalTotale);

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [data]); // Empty dependency array to fetch data only once

  const handleButtonPress = () => {
    navigation.navigate('Pay2'); // Navigate to the Add Payment screen
  };

  // Filter payments based on the search query
  const filteredPayments = data.filter((payment) =>
    payment.nom_client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.paddingTop}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name"
          placeholderTextColor="#040200"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
      </View>

      <View style={styles.topRow}>
        <View style={styles.totalMontantCard}>
          <Text style={styles.cardText}>Total Payer</Text>
          <Text style={[styles.totalMontantText, { fontWeight: 'bold' }]}>
            {totalMontantPayer.toFixed(2)}
          </Text>
        </View>
        <View style={styles.totalMontantCard}>
          <Text style={styles.cardText}>Total MT</Text>
          <Text style={styles.totalMontantText}>{totalMontantTotale.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Vos Paiements</Text>
      </View>

      <ScrollView style={styles.paymentContainer}>
        {filteredPayments.map((payment) => (
          <View style={styles.payment} key={payment.id_paiement}>
            <Text style={styles.paymentText}>
              <Text style={styles.boldText}>
                Payment #{payment.id_paiement} - {payment.nom_client} {payment.prenom_client} #{payment.id_client}{' '}
              </Text>
            </Text>
            <Text
              style={[
                styles.paymentText,
                { color: payment.montant_payer !== payment.montant_totale ? 'red' : 'green' },
              ]}
            >
              Montant: {payment.montant_payer} / {payment.montant_totale}
            </Text>
            <Text style={styles.paymentText}>Moyen Paiement: {payment.moyen_paiement}</Text>
            <Text style={styles.paymentText}>ID Livreur: {payment.id_livreur}</Text>
            <Text style={styles.paymentText}>
              Téléphone: {payment.telephone_client}               Date: {payment.date_paiement}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 0, // Adjusted top padding
  },
  paddingTop: {
    paddingTop: 20, // Additional padding at the top
  },
  searchBar: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: '#040200',
    color: '#040200',
    fontSize: 18,
    padding: 10,
    marginBottom: 40,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  totalMontantCard: {
    flex: 1,
    backgroundColor: '#040200',
    borderRadius: 10,
    padding: 20,
    marginRight: 10,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  totalMontantText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationCard: {
    flex: 1,
    backgroundColor: '#040200',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  cardText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#040200',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paymentContainer: {
    flex: 1,
  },
  payment: {
    backgroundColor: '#F9E076',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20, // Increased marginBottom for spacing
  },
  paymentText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
  },
});
