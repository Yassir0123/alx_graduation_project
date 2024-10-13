import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
          'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getcommandtoday.php',
          {
            userId: userId,
          },
          {
            responseType: 'json',
          }
        );
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
  }, []);

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

    navigation.navigate('Commande_Fournisseur', { FournisseurData: FournisseurData });
  };

  const handleValidate = async (user) => {
    console.log(user.id_commandeachat);
    try {
      const responses = await axios.post(
        'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/validerreception.php',
        {
          userid: user.id_commandeachat,
        },
        {
          responseType: 'json',
        }
      );
      console.log(responses.data);
    } catch (error) {
      console.error('Error validating:', error);
    }
  };

  const handleUsers = async (user) => {
    try {
      const responses = await axios.post(
        'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getligneachat.php',
        {
          idcmdcount: user.id_commandeachat,
        },
        {
          responseType: 'json',
        }
      );

      setDatas(responses.data.userData);

      const pdfContent = `
        <html>
          <head>
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #000; padding: 8px; text-align: center; }
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
        const { uri } = await Print.printToFileAsync({ html: pdfContent });
        await Sharing.shareAsync(uri);
      } catch (error) {
        console.error('Error printing and sharing:', error);
      }
    } catch (error) {
      console.error('Error fetching line items:', error);
    }
  };

  const filteredData = data.filter((item) =>
    item.nom_entreprise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.clientName}>{item.nom_entreprise}</Text>
 
      </View>
      <Text style={styles.orderDate}>{item.date_livraison}</Text>
      <View style={styles.orderDetails}>
        <Text style={styles.detailText}>ID: {item.id_commandeachat} • Fournisseur: {item.id_fournisseur}</Text>
        <Text style={styles.orderAmount}>{item.montant_totale} MAD</Text>
      </View>
      <View style={styles.actionButtons}>
        {roleUser !== 'vendeur.com' && (
          <TouchableOpacity style={styles.validateButton} onPress={() => handleValidate(item)}>
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.pdfButton} onPress={() => handleUsers(item)}>
          <Text style={styles.buttonText}>PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8e8e93" />
        <TextInput 
          style={styles.searchInput}
          placeholder="Rechercher une commande"
          placeholderTextColor="#8e8e93"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Commandes</Text>
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_commandeachat.toString()}
        contentContainerStyle={styles.orderList}
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
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  titleContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  pdfButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FournisseurCommande;