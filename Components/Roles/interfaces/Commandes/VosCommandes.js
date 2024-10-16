import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, StatusBar, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
const { width } = Dimensions.get('window');

const VosCommandes = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [roleUser, setRoleUser] = useState();
  const [editedData, setEditedData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY] = useState(new Animated.Value(0));
  const [statistics, setStatistics] = useState([]);
  const Navigate = useCallback(() => { 
    navigation.navigate('Client');
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const email = await AsyncStorage.getItem('email');
        const emailParts = email.split('@');
        const domain = emailParts[1];
        setRoleUser(domain);

        try {
          const response = await axios.post(
    'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/getcommands.php',
            {
              userid: userId,
              email: email,
            },
            {
              responseType: 'json',
            }
          );
          try {
            const responser = await axios.post(
              'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/getstatistics.php',
              {
                userid: userId,
                email: email,
              },
              {
                responseType: 'json',
              }
            );
            console.log(responser.data);
            setStatistics({
              totalProductsSold: responser.data.totalProductsSold,
              totalCommandsValidated: responser.data.totalCommandsValidated,
              totalAmountValidated: responser.data.totalAmountValidated,
              totalmtdate: responser.data.totalmtdate,
              totalcmddate: responser.data.totalcmddate,
            });
            console.log(statistics);
          } catch (error) {
            console.error('Error:', error);
          }
          if (response.data.message === 'got data') {
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
    }, [])
  );

  const role = roleUser === 'vendeur.com';

  const handleUser = async (user, action) => {
    setEditingUser(user);
    const clientData = {
      idcmdcount: user.id_commande,
      nom: user.nom_client,
      prenom: user.prenom_client,
      localisation: user.localisation,
      date_livraison: user.date_livraison,
      id_client: user.id_client,
      id_vendeur: user.id_vendeur,
      montanttotale: user.montant_totale,
      id_commerciale: user.id_commerciale,
      action: 1,
      modify: 1,
    };
  
    if (action === 0) {
      navigation.navigate('Commanded', { clientData });
    } else if (action === 1) {
      const userId = await AsyncStorage.getItem('userId');
      const email = await AsyncStorage.getItem('email');
   
      const response = await axios.post(
'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/addcommande.php',
        JSON.stringify(clientData),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
    } else if (action === 2) {
      let responses = [];
  
      try {
        responses = await axios.post(
  'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/getlignecommande.php',
          {
            idcmdcount: user.id_commande,
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
            <h1>Commande Details</h1>
            <table>
              <tr>
                <td><strong>ID:</strong> ${user.id_commande}</td>
                <td><strong>ID Client:</strong> ${user.id_client}</td>
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
        const { uri } = await Print.printToFileAsync({ html: pdfContent });
        await Sharing.shareAsync(uri);
      } catch (error) {
        console.error('Error printing and sharing:', error);
      }
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderItem} onPress={() => handleUser(item, 0)}>
      <View style={styles.orderHeader}>
        <Text style={styles.clientName}>{item.nom_client} {item.prenom_client}</Text>
      </View>
      <Text style={styles.orderDate}>{item.date_livraison}</Text>
      <View style={styles.orderDetails}>
        <Text style={styles.detailText}>ID: {item.id_commande} • Client: {item.id_client} • {item.localisation}</Text>
        <Text style={styles.orderAmount}>{item.montant_totale} MAD</Text>
      </View>
      <View style={styles.actionButtons}>
        {!role && (
          <TouchableOpacity style={styles.validateButton} onPress={() => handleUser(item, 1)}>
            <Text style={styles.validateButtonText}>Validate</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.pdfButton} onPress={() => handleUser(item, 2)}>
          <Text style={styles.pdfButtonText}>View PDF</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const stats = [
    { title: "Total Cmds", value: data.length.toString(), icon: "cart-outline", colors: ["#FF9FF3", "#FF6B6B"] },
    { title: "Total Amount", value: `€${data.reduce((total, item) => total + parseFloat(item.montant_totale || 0), 0).toFixed(2)}`, icon: "cash-outline", colors: ["#54A0FF", "#5F27CD"] },
  ];

  const renderStatItem = ({ item }) => (
    <LinearGradient colors={item.colors} style={styles.statItem} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
      <Ionicons name={item.icon} size={24} color="white" />
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statTitle}>{item.title}</Text>
    </LinearGradient>
  );

  const renderListHeader = () => (
    <>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8e8e93" />
        <TextInput 
          style={styles.searchInput}
          placeholder="Research an order"
          placeholderTextColor="#8e8e93"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
      </View>
      
      <FlatList
        data={stats}
        renderItem={renderStatItem}
        keyExtractor={(item) => item.title}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsContainer}
      />
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Your orders</Text>
        <TouchableOpacity style={styles.addButton} onPress={Navigate}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Animated.FlatList
        data={data}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id_commande.toString()}
        contentContainerStyle={styles.orderList}
        ListHeaderComponent={renderListHeader}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 12,
    height: 40,
    width:'97%',
    marginLeft:10
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statItem: {
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: width / 2 - 32,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  orderList: {
    paddingHorizontal: 16,
  },
  orderItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  validateButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
  },
  validateButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  pdfButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 8,
  },
  pdfButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default VosCommandes;