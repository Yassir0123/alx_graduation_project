import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Image } from 'react-native';
import { FAB, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const DeliveryOptions = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedOption, setSelectedOption] = useState('home');
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalTVA, setTotalTVA] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();
  const { Bonlivraison } = route.params;

  useEffect(() => {
    if (Bonlivraison) {
      axios.post(
        'http://192.168.125.68/alx/alx/Components/Roles/interfaces/phpfolderv2/getprodbybonimg.php',
        { idbon: Bonlivraison.id_bonlivraison },
        { responseType: 'json' }
      ).then(response => {
        const userData = response.data.userData;

        const fetchedProducts = userData.map(item => ({
          id: item.id_produit,
          name: item.libeller,
          category: item.nom_categorie,
          price: item.prix,
          quantity: item.quantiter,
          tva: item.tva,
          total: item.prix * item.quantiter,
          image: item.image
        }));

        const totalQuantity = fetchedProducts.reduce((acc, product) => acc + product.quantity, 0);
        const totalPrice = fetchedProducts.reduce((acc, product) => acc + product.total, 0);
        const totalTVA = fetchedProducts.reduce((acc, product) => acc + product.tva, 0);

        setProducts(fetchedProducts);
        setTotalQuantity(totalQuantity);
        setTotalPrice(totalPrice);
        setTotalTVA(totalTVA);
      }).catch(error => {
        console.error('Error fetching data:', error);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [Bonlivraison]);

  const handlePassOrder = () => {
    navigation.navigate('Pay6', { products, Bonlivraison, totalPrice, totalTVA });
  };
  
  const deliveryOptions = [
    { id: 'home', icon: 'home', label: 'Home Delivery', detail: 'Your order will be delivered to your doorstep.' },
    { id: 'subway', icon: 'subway', label: 'Subway Pickup', detail: 'Pick up your order at the nearest subway station.' },
    { id: 'store', icon: 'business', label: 'Store Pickup', detail: 'Collect your order from the nearest store.' },
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Choose Delivery Method</Text>
          <View style={styles.optionsContainer}>
            {deliveryOptions.map((option) => (
              <TouchableOpacity
                key={`delivery-option-${option.id}`}
                style={[
                  styles.optionCard,
                  selectedOption === option.id && styles.selectedOptionCard,
                ]}
                onPress={() => handleOptionClick(option)}
              >
                <Ionicons
                  name={option.icon}
                  size={30}
                  color={selectedOption === option.id ? '#fff' : '#3f51b5'}
                />
                <Text style={[styles.optionText, selectedOption === option.id && styles.selectedOptionText]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.orderText}>Total Quantity</Text>
          <Chip mode="outlined" style={styles.quantityChip}>
            <Text style={styles.quantityNumber}>{products.length}</Text>
          </Chip>
        </View>

        <Text style={styles.sectionTitle}>Your Products</Text>
        {products.map((product) => (
          <TouchableOpacity key={`product-${product.id}`} style={styles.productContainer} onPress={() => navigation.navigate('OrderItemsScreen', { products: [product], Bonlivraison })}>
            <View style={styles.productCard}>
              <Image source={{ uri:`http://192.168.125.68/alx/alx/Components/Roles/interfaces/Products/${product.image}` }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productPrice}>${product.price}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#757575" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon={() => <Ionicons name="checkmark" size={24} color="#fff" />}
        onPress={handlePassOrder}
        label="Pass Order"
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#3f51b5',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionCard: {
    backgroundColor: '#e8eaf6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '31%',
  },
  selectedOptionCard: {
    backgroundColor: '#3f51b5',
  },
  optionText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#3f51b5',
    fontSize: 12,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  orderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  quantityChip: {
    backgroundColor: '#e8eaf6',
  },
  quantityNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3f51b5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3f51b5',
  },
  productContainer: {
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  productCategory: {
    fontSize: 14,
    color: '#555',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3f51b5',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3f51b5',
  },
});

export default DeliveryOptions;