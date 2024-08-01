import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import { updateProduct, AddProductToCommand,deleteProduct } from './FunctionsCRUD';
const PlaceCommand = ({ route }) => {
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const navigation = useNavigation(); // Use the useNavigation hook
  const { clientData, product,selectedMainCategory,selectedSubCategory } = route.params;

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        console.log('clientData: ', clientData);
        console.log('product: ', product);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchClientData();
  }, [clientData, product]);

  const addItemToCart = () => {
    if (quantity > product.quantity) {
      setError('La quantité choisie dépasse celle du stock');
      return;
    }

    const addedProduct = {
      idProduct: product.id,
      quantiter: quantity,
      category:selectedSubCategory,
      tva:product.tva,
      libeller:product.name,
      idcmd:clientData.idcmdcount,
      price:product.price,
      
    };
    console.log('##################');
    console.log(addedProduct);

   AddProductToCommand(addedProduct);
  
   navigation.navigate('Commande',{clientData}); // Navigate to ScheduleDelivery screen
  };

  const storeData = async (value) => {
    console.log(value);
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{  uri: `http://10.20.69.188/logo/Components/Roles/interfaces/Products/${product.img}`}} // Replace with the actual image URL
          style={styles.image}
        />
        <Text style={styles.title}>{product.name} - Each</Text>
        <Text style={styles.price}>${product.price} /lb</Text>
        <View style={styles.tags}>
          <Text style={styles.tag}>{selectedMainCategory}</Text>
          <Text style={styles.tag}>{selectedSubCategory}</Text>
        </View>
        <View style={styles.preferenceContainer}>
          <Text style={styles.preferenceTitle}>Details</Text>
          <Text style={styles.preferenceText}>Choisissez votre quantiter souhaité</Text>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
            <Ionicons name="remove" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity onPress={addItemToCart} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginHorizontal: 4,
  },
  preferenceContainer: {
    width: '100%',
    marginBottom: 16,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  preferenceText: {
    fontSize: 14,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 16,
  },
  addButton: {
    backgroundColor: '#00b14f',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    fontSize: 14,
  },
});

export default PlaceCommand;
