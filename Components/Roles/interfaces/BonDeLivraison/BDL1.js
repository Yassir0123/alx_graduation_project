import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, StatusBar, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const BDL1 = () => {
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
    navigation.navigate('BDL2');
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const userId = await AsyncStorage.getItem('userId');
        console.log(userId);
        const clientData = {
          id: userId,
        };

        const response = await axios.post(
          `http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getbons.php`,
          JSON.stringify(clientData),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        setData(response.data.userData);
        console.log(response.data.message);
      };
      fetchData();
    }, [])
  );

  const handlePress = async (user) => {
    try {
      responses = await axios.post(
        'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getlignecommande.php',
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
        <h1>Note ${user.id_bonlivraison} Details</h1>
        <table>
          <tr>
            <td><strong>Order </strong> ${user.id_commande}</td>
            <td><strong>ID Client:</strong> ${user.id_client}</td>
          </tr>
          <tr>
          <td><strong>Operator: </strong> ${user.id_operateur}</td>
          <td><strong>Delivery Person:</strong> ${user.id_livreur}</td>
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
            <td><strong>Delivery Date:</strong> ${user.date_livraison}</td>
          </tr>
        </table>
        <h2>Products</h2>
        <table>
          <thead>
            <tr>
              <th>id_product</th>
              <th>label</th>
              <th>Category_name</th>
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
    const { uri } = await Print.printToFileAsync({ html: pdfContent });
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error('Error printing and sharing:', error);
  }
  };

  const stats = [
    { title: "Total Notes", value: data.length.toString(), icon: "document-text-outline", colors: ["#FF9FF3", "#FF6B6B"] },
    { title: "Total Amounts", value: data.reduce((total, item) => total + parseFloat(item.montant_totale || 0), 0).toFixed(2), icon: "cash-outline", colors: ["#54A0FF", "#5F27CD"] },
  ];

  const renderStatItem = ({ item }) => (
    <LinearGradient colors={item.colors} style={styles.statItem} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
      <Ionicons name={item.icon} size={24} color="white" />
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statTitle}>{item.title}</Text>
    </LinearGradient>
  );

  const renderBonLivraisonItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.bonItem}>
      <View style={styles.bonHeader}>
        <Text style={styles.clientName}>{item.nom_client} {item.prenom_client}</Text>
      </View>
      <Text style={styles.bonDate}>{item.date_livraison}</Text>
      <View style={styles.bonDetails}>
        <Text style={styles.detailText}>ID: {item.id_bonlivraison} • Client: {item.id_client} • {item.localisation}</Text>
        <Text style={styles.bonAmount}>{item.montant_totale} MAD</Text>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>Generate PDF</Text>
        <Ionicons name="arrow-forward" size={18} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderListHeader = () => (
    <>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8e8e93" />
        <TextInput 
          style={styles.searchInput}
          placeholder="Research your note"
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
        <Text style={styles.title}>Your Notes</Text>
        <TouchableOpacity style={styles.addButton} onPress={Navigate}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <AnimatedFlatList
        data={data}
        renderItem={renderBonLivraisonItem}
        keyExtractor={(item) => item.id_bonlivraison.toString()}
        contentContainerStyle={styles.scrollContent}
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
  scrollContent: {
    paddingBottom: 80,
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
  statsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statItem: {
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: width / 2 - 24,
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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
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
  bonList: {
    paddingHorizontal: 16,
   
  },
  bonItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width:'95%',
    marginLeft:10
  },
  bonHeader: {
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
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bonDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  bonDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  bonAmount: {
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

export default BDL1;