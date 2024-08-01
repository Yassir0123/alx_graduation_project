import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { updateProduct, deleteProduct } from './FunctionsCRUD';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BDL3 = ({ route }) => {
  const selectedCommande = route.params.selectedCommande;
  const selectedLivreur = route.params.selectedLivreur;
  const initialProductData = route.params.commandProducts;
  const bonclay = route.params.bonclay;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [editedData, setEditedData] = useState({});
  const [productsData, setProductsData] = useState(initialProductData); // State to hold product data
  const [bigdata, setBigdata] = useState([]);


  const handleUpdate = () => {
    updateProduct(editedData);
    setEditModalVisible(false);

    // Update the product data in the state
    const updatedProducts = productsData.map((product) =>
      product.id_lignecommande === editedData.id ? { ...product, ...editedData } : product
    );
    setProductsData(updatedProducts);
  };

  const handleEdit = (product) => {
    setEditedData({
      id: product.id_lignecommande,
      title: product.libeller,
      category: product.nom_categorie,
      stock: product.quantiter,
      price: product.prix,
    });
    setEditModalVisible(true);
  };
  const validation=async()=>{
    console.log('lol:',bigdata);
    //console.log('sofia nigga');
    const responser = await axios.post(
      'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/modifyqte.php',
      {
      newdata:bigdata,
      },
      {
        responseType: 'json',
      }
    );




   const userId = await AsyncStorage.getItem('userId');
   
    console.log(selectedCommande[0].id_commande);
    console.log(selectedCommande[0].nom_client);
    console.log(selectedCommande[0].prenom_client);
    console.log(selectedCommande[0].localisation);
    console.log(totalPrice.toFixed(2));
    console.log(userId);
    console.log(selectedCommande[0].id_client);
    console.log(selectedCommande[0].id_commerciale);
    console.log(selectedCommande[0].id_vendeur);
    console.log(selectedCommande[0].telephone);
    console.log(selectedCommande[0].date_livraison);
    console.log(selectedLivreur[0].id_livreur);
   const response = await axios.post(
      'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/validatebon.php',
      {
       id: selectedCommande[0].id_commande,
        nom:selectedCommande[0].nom_client,
        prenom:selectedCommande[0].prenom_client,
        localisation:selectedCommande[0].localisation,
        mt:totalPrice.toFixed(2),
        userid:userId,
        idvend:selectedCommande[0].id_vendeur,
        idcom:selectedCommande[0].id_commerciale,
        idclient:selectedCommande[0].id_client,
        tel:selectedCommande[0].telephone,
        date:selectedCommande[0].date_livraison,
        idliv:selectedLivreur[0].id_livreur,
      },
      {
        responseType: 'json',
      }
    );
     if(response.data.message==='Data inserted successfully'){
      navigation.navigate('BDL1');
     }else{
      console.log(response.data);
     }


  
};
  const handleDelete = (id) => {
    deleteProduct(id);

    // Remove the deleted product from the state
    const updatedProducts = productsData.filter((product) => product.id_lignecommande !== id);
    setProductsData(updatedProducts);
  };

  useEffect(() => {
    const fetchData= async()=>{
    const response = await axios.post(
      'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getlignecommande.php',
      {
        idcmdcount: selectedCommande[0].id_commande,
      },
      {
        responseType: 'json',
      }
    );

    setProductsData(response.data.userData);
    const mappedData = response.data.userData.map((product) => ({
      id_produit: product.id_produit,
      quantity: product.quantiter,
    }));

    setBigdata(mappedData);
    let calculatedTotalPrice = 0;
    if (productsData) {
      productsData.forEach((product) => {
        const total_price = product.quantiter * product.prix * (1 + product.tva);
        calculatedTotalPrice += total_price;
       
      });
    }
    setTotalPrice(calculatedTotalPrice);

  }
  fetchData();
  }, [productsData]);

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.row}>
          <Text style={styles.text}>Bon: {bonclay} </Text>
          <Text style={styles.text}>{selectedCommande[0].date_livraison}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Nom : {selectedCommande[0].nom_client}</Text>
          <Text style={styles.text}>Prenom: {selectedCommande[0].prenom_client}</Text>
        </View>
        <Text style={[styles.text, styles.infos]}>Addresse : {selectedCommande[0].localisation}</Text>
        <Text style={[styles.text, styles.infos]}>telephone: {selectedCommande[0].telephone}</Text>
        <View style={styles.row}>
          <Text style={styles.text}>command :{selectedCommande[0].id_commande}</Text>
          <Text style={styles.text}>livreur : {selectedLivreur[0].nom } {selectedLivreur[0].prenom } </Text>
        </View>
      </View>
      <ScrollView horizontal style={styles.scrollView}>
        <ScrollView>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>ID_Product</Text>
            <Text style={styles.headerText}>Libeller</Text>
            <Text style={styles.headerText}>Categorie</Text>
            <Text style={styles.headerText}>Quantiter</Text>
            <Text style={styles.headerText}>Prix (HT)</Text>
            <Text style={styles.headerText}>Tva</Text>
            <Text style={styles.headerText}>Editer</Text>
            <Text style={styles.headerText}>Supprimer</Text>
          </View>
          <View>
            {productsData && productsData.length > 0 ? (
              productsData.map((product, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{product.id_produit}</Text>
                  <Text style={styles.tableCell}>{product.libeller}</Text>
                  <Text style={styles.tableCell}>{product.nom_categorie}</Text>
                  <Text style={styles.tableCell}>{product.quantiter}</Text>
                  <Text style={styles.tableCell}>{product.prix}</Text>
                  <Text style={styles.tableCell}>{product.tva}</Text>
                  <TouchableOpacity
                    style={styles.tableCell}
                    onPress={() => handleEdit(product)}
                  >
                    <Text style={styles.editButton}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.tableCell}
                    onPress={() => handleDelete(product.id_lignecommande)}
                  >
                    <Text style={styles.editButton}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text>No data available</Text>
            )}
          </View>
        </ScrollView>
      </ScrollView>
      <Modal visible={isEditModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleUpdate}>
            <Text style={{ fontSize: 40, marginLeft: '70%' }}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalHeader}>Editer un produit</Text>
          <Text style={styles.labelText}>Label:</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            editable={false}
            value={editedData.title}
            onChangeText={(text) => setEditedData({ ...editedData, title: text })}
          />
          <Text style={styles.labelText}>Catégorie:</Text>
          <TextInput
            style={styles.input}
            placeholder="Category"
            editable={false}
            value={editedData.category}
            onChangeText={(text) => setEditedData({ ...editedData, category: text })}
          />
          <Text style={styles.labelText}>Quantité:</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantité"
            value={editedData.stock}
            keyboardType="numeric"
            onChangeText={(text) => setEditedData({ ...editedData, stock: text })}
          />
          <Text style={styles.labelText}>Prix:</Text>
          <TextInput editable={false} style={styles.input}>{editedData.price}</TextInput>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => validation()}>
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
        <Text style={styles.mtText}>MT:   {totalPrice.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infos: {
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2feabd',
    width: 120,
    alignSelf: 'center',
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 15,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 22,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: '60%',
    maxWidth: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#74c9bb',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#82c797',
  },
  headerText: {
    backgroundColor: '#74c9bb',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    width: 120,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#47c778',
  },
  editButton: {
    textAlign: 'center',
    padding: 10,
    color: '#2feabd',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  mtText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f3',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: '#2feabd',
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  tableCell: {
    textAlign: 'center',
    padding: 10,
    width: 120,
  },
});

export default BDL3;