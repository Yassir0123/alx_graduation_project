import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, StatusBar, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
const { width } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const VosCommandes = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [roleUser, setRoleUser] = useState();
  const [editedData, setEditedData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY] = useState(new Animated.Value(0));

  const Navigate = () => {
    navigation.navigate('Chercher_Fournisseur_existant');
  };

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
            'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/getcommandeachat.php',
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
    }, [])
  );

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
      action: 2,
      modify: 1,
    };

    navigation.navigate('Commande_Fournisseur', { FournisseurData: FournisseurData });
  };

  const handleUsers = async (user) => {
    try {
      const responses = await axios.post(
        'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/getligneachat.php',
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
            <h1>Order Details</h1>
            <table>
              <tr>
                <td><strong>ID Achat:</strong> ${user.id_achat}</td>
                <td><strong>ID Order:</strong> ${user.id_commandeachat}</td>
              </tr>
              <tr>
                <td><strong>ID Supplier:</strong> ${user.id_fournisseur}</td>
                <td><strong>Company name:</strong> ${user.nom_entreprise}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong> ${user.email}</td>
                <td><strong>Phone number:</strong> ${user.telephone}</td>
              </tr>
              <tr>
                <td><strong>Total Amount:</strong> ${user.montant_totale}</td>
                <td><strong>Delivery Date:</strong> ${user.date_livraison}</td>
              </tr>
            </table>
            <h2>Products</h2>
            <table>
              <thead>
                <tr>
                  <th>ID Product</th>
                  <th>Label</th>
                  <th>Cateogry</th>
                  <th>Quantity</th>
                  <th>Price</th> 
                  <th>TVA</th>
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
    } catch (error) {
      setLoading(false);
    }
  };

  const stats = [
    { title: "Total Cmds", value: data.length.toString(), icon: "cart-outline", colors: ["#FF9FF3", "#FF6B6B"] },
    { title: "Total Amount", value: data.reduce((total, item) => total + parseFloat(item.montant_totale || 0), 0).toFixed(2), icon: "cash-outline", colors: ["#54A0FF", "#5F27CD"] },
  ];

  const renderStatItem = ({ item }) => (
    <LinearGradient colors={item.colors} style={styles.statItem} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
      <Ionicons name={item.icon} size={24} color="white" />
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statTitle}>{item.title}</Text>
    </LinearGradient>
  );

  const renderCommandeItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUser(item)} style={styles.commandeItem}>
      <View style={styles.commandeHeader}>
        <Text style={styles.entrepriseName}>{item.nom_entreprise}</Text>
      </View>
      <Text style={styles.commandeDate}>{item.date_livraison}</Text>
      <View style={styles.commandeDetails}>
        <Text style={styles.detailText}>ID: {item.id_commandeachat} • Supplier: {item.id_fournisseur}</Text>
        <Text style={styles.commandeAmount}>{item.montant_totale.toFixed(2)} MAD</Text>
      </View>
      <TouchableOpacity style={styles.viewButton} onPress={() => handleUsers(item)}>
        <Text style={styles.viewButtonText}>Generate PDF</Text>
        <Ionicons name="document-text-outline" size={18} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
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
        <Text style={styles.title}>Your Orders</Text>
        <TouchableOpacity style={styles.addButton} onPress={Navigate}>
          <Ionicons name="add-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <AnimatedFlatList
        data={data}
        renderItem={renderCommandeItem}
        keyExtractor={(item) => item.id_commandeachat.toString()}
        contentContainerStyle={styles.commandeList}
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
    width:'98%',
    marginLeft:5
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    width:'50%'
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statItem: {
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: width / 2 - 38,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 8,
  },
  commandeList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  commandeItem: {
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
  commandeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entrepriseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  commandeDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  commandeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  commandeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
  },
  viewButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default VosCommandes;