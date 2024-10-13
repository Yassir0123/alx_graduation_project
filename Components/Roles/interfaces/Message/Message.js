import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
const App = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const fetchClientData = async () => {
        try {
          const response = await axios.post(
          'http://192.168.11.106/alx/alx/Components/Roles/interfaces/phpfolderv2/getproductpage.php',
            {
              responseType: 'json',
            }
          );
          const fetchedProducts = response.data;

          // Filter products with quantiter_stock <= 10
          const filteredProducts = fetchedProducts.filter(product => product.quantiter_stock <= 10);

          // Set products and count
          setProducts(filteredProducts);
          setProductCount(filteredProducts.length);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching product data:', error);
          setLoading(false);
        }
      };

      fetchClientData();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionTitle}>Produits</Text>
        <View style={styles.bellContainer}>
          <FontAwesome5 name="bell" size={24} color="#5a67d8" />
          <View style={styles.counter}>
            <Text style={styles.counterText}>{productCount}</Text>
          </View>
        </View>
      </View>

      {products.length > 0 ? (
        products.map((product, index) => (
          <View key={index} style={styles.transactionItem}>
            <Image source={{ uri: `http://192.168.11.106/alx/alx/Components/Roles/interfaces/Products/${product.image}` }} style={styles.productImage} />
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionName}>{product.libeller}</Text>
              <Text style={styles.transactionPrice}>{product.quantiter_stock <= 0 ? 'Out of stock' : product.quantiter_stock+' Left' } </Text>
              <Text style={styles.transactionCategory}>{product.nom_categorie}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text>No products found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  bellContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  counter: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff0000',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
    elevation: 3,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 20,
    borderRadius: 5,
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
    color: '#ff0000', // Red color for the quantity
  },
  transactionCategory: {
    marginTop: 5,
    fontSize: 12,
    color: '#999',
  },
});

export default App;
