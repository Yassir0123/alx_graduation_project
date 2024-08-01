import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const ProductDetail = ({ route }) => {
  const navigation = useNavigation();
  const { productinfos } = route.params;

  React.useEffect(() => {
    console.log('Product data received:', productinfos);
  }, [productinfos]);

  const handlePress = (buttonName) => {
    Alert.alert(`${buttonName} Pressed`);
  };

  const handlegoback = () => {
    console.log(productinfos);
    navigation.navigate('gotoaddproduct');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.textContainer}>
          <TouchableOpacity onPress={handlegoback}>
            <Icon name="arrow-back" size={30} color="#000" style={styles.arrow} />
          </TouchableOpacity>
          <Text style={styles.text}>Product</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `http://10.20.74.42/logo/Components/Roles/interfaces/Products/${productinfos.image}` }}
            style={styles.image}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>Name: {productinfos.libeller}</Text>
        </View>
        <View style={styles.grid}>
          <View style={styles.row}>
            <Text style={styles.gridItem}>Category: {productinfos.nom_categorie}</Text>
            <Text style={styles.gridItem}>Prix: {productinfos.prix_ht}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.gridItem}>Quantity: {productinfos.quantiter_stock}</Text>
            <Text style={styles.gridItem}>TVA: {productinfos.tva}%</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.customButton, styles.editButton]} onPress={() => handlePress('Edit')}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.customButton, styles.deleteButton]} onPress={() => handlePress('Delete')}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>   
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    margin: 20,
  },
  imageContainer: {
    alignItems: 'center'
  },
  image: {
    width: 190,
    height: 200,
    borderWidth: 5,
    borderColor: 'black',
    borderRadius: 10,
  },
  name: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    padding: 10,
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
  },
  grid: {
    width: '100%',
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  gridItem: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    padding: 5,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  customButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#28a745',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  arrow: {
    position: 'absolute',
    top: 16,
    right: 140,
  },
});

export default ProductDetail;
