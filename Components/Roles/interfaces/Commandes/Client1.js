import React, { useState,useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateProduct, AddProductToCommand,deleteProduct } from './FunctionsCRUD';
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import {URL} from '@env'
const Client1 = ({ route }) => {
  
  const { clientData } = route.params;
  const navigation = useNavigation();
const [loading,setLoading]=useState(true);
  const [selected, setSelected] = useState();
  const [productData, setProductData] = useState([]);
  const [productDatas, setProductDatas] = useState([]);
  const [dateText, setDateText] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [ids, setids] = useState('');
  const [montanttotal,Setmt]=useState(0)
  let action;
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const handleConfirm = (selectedDate) => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    setDateText(formattedDate);
    hideDatePicker();
  };

  const [editingProduct, setEditingProduct] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [addData, setAddData] = useState({});

  const [isEditModalVisible, setEditModalVisible] = useState(false);
 
  const handleAdd = async () => {
    try {
      // Fetch product data if not already fetched
     
        const response = await axios.get(
          'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getproductpage.php'
        );
        console.log(response.data)
        setProductData(response.data);
      

      setAddModalVisible(true);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  const handleEdit = (product) => {
  setids(product.id_produit);
   // setEditingProduct(product);
    setEditedData({
      id:product.id_lignecommande,
      title: product.libeller,
      category: product.nom_categorie,
      stock: product.quantiter,
      price: product.prix,
    });
    setEditModalVisible(true);
  };

  const Delete = (id) => {
 

    deleteProduct(id);
  };

  const handleAddProduct = async () => {
    action=1;
    console.log('quantiter de stock:',formattedData[addData.id].qt);
    console.log('quantiter recu:',addData.quantity);
    const recu=addData.quantity;
    const stck=formattedData[addData.id].qt;
    if(recu>stck){
      setErrorMessage('quantité maximale : '+ stck);
    }else{
 // console.log(formattedData[addData.id].tva);
 setErrorMessage('');
    const addedProduct = {
      idProduct: formattedData[addData.id].id,
      idUser: clientData.id_client,
      quantiter: addData.quantity,
      category:formattedData[addData.id].category,
      tva:formattedData[addData.id].tva,
      libeller:formattedData[addData.id].value,
      idcmd:clientData.idcmdcount,
      price:formattedData[addData.id].price,
      
    };
    console.log('##################');
    console.log(addedProduct);
  
    clientData.action=1;

    AddProductToCommand(addedProduct);
    setAddModalVisible(false);
  }
  };
  const handlevalidate=async()=>{
    const userId = await AsyncStorage.getItem('userId');
    const email = await AsyncStorage.getItem('email');
    console.log(clientData.id_client);
    console.log(clientData.nom);
    console.log(clientData.prenom);
    console.log(clientData.localisation);
    console.log(montanttotal);
    console.log(userId);
    console.log(email);
    console.log(dateText);
    const response = await axios.post(
      'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/validatecmd.php',
      {
       id: clientData.id_client,
        nom:clientData.nom,
        prenom:clientData.prenom,
        localisation:clientData.localisation,
        mt:montanttotal,
        userid:userId,
        email:email,
        date:dateText,
      },
      {
        responseType: 'json',
      }
    );
     if(response.data.message==='Data inserted successfully'){
      navigation.navigate('Commandes');
     }else{
      console.log(response.data);
     }


  
};
const handleUpdate = () => {
  /*const a = ids;
  console.log(a);
  const b = formattedData.find((item) => item.id === a);
  console.log('stock:', b.qt);
  const c = parseFloat(editedData.stock); // Parse c to a float
  console.log('choosen:', c);

  if (c > parseFloat(b.qt)) { // Parse b.qt to a float for comparison
    console.log('right');
    setErrorMessage('quantité maximale : ' + b.qt);
  } else {
    setErrorMessage('');
    console.log('left');*/
    updateProduct(editedData);
    setEditModalVisible(false);
  
};


const formattedData = productData.map((item, index) => ({
    key: String(index), // You can use the index as the key
    id:item.id_produit,
    value: item.libeller,
    category: item.nom_categorie,
    qt:item.quantiter_stock,
    price: item.prix_ht,
    tva: item.tva,
    

  }));

  useEffect(() => {
    // Define the Axios request within the useEffect
  
    const fetchData = async () => {
      try {
 
         if(clientData.action===0){
          const response = await axios.post(
            'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/deletecmd.php',
            {
              idcmdcount: clientData.idcmdcount,
            },
            {
              responseType: 'json',
            }
          );

     
        }
        else{
    // Make an Axios GET request to your API endpoint
    
    const response = await axios.post(
      'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getlignecommande.php',
      {
        idcmdcount: clientData.idcmdcount,
      },
      {
        responseType: 'json',
      }
    );

    setProductDatas(response.data.userData);
        }
  if(clientData.Data!=null){
 setDateText(clientData.date_livraison);
  }
    
        let MT = 0;
        
          {productDatas? productDatas.forEach((item) => {
            MT += item.quantiter*item.prix * (1 + item.tva);
            setLoading(false) }):MT=0;
    }
       
        Setmt(MT);
        
      } catch (error) {
     
        setLoading(false);
      }
    };
  
  
    fetchData();
  
    // Include addData and deleteProduct in the dependency array
  }, [addData, Delete]);
  
  const selectedItem = formattedData.find((item) => item.key === String(addData.id));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commandes</Text>
      <View style={styles.user}>

        <Text style={{fontWeight:'bold',fontSize:20}}>montant total </Text>
        <Text style={{fontWeight:'bold',fontSize:20}}>{montanttotal}</Text>

      </View>
      <View style={styles.user}>
        <Text>Commande {clientData.idcmdcount}</Text>
        <Text>{clientData.nom} {clientData.prenom}</Text>
      </View>
      <View style={styles.userDate}>
        <Text>Date de Livraison</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton} activeOpacity={0.8}>
          <AntDesign name="calendar" size={24} color="black" />
        </TouchableOpacity>
        <TextInput style={styles.input} value={dateText} editable={false} onTouchStart={showDatePicker} />
        <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} />
      </View>
      <View style={styles.buttonContent}>
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <View style={styles.buttonContent}>
          <AntDesign name="pluscircle" size={30} color="#383636" />
          <Text>Ajouter un Produit</Text>
        </View>
      </TouchableOpacity>
    
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
          {productDatas && productDatas.length > 0 ? (
  productDatas.map((item, index) => (
    <View style={styles.tableRow} key={index}>
      <Text style={styles.tableCell}>{item.id_produit}</Text>
      <Text style={styles.tableCell}>{item.libeller}</Text>
      <Text style={styles.tableCell}>{item.nom_categorie}</Text>
      <Text style={styles.tableCell}>{item.quantiter}</Text>
      <Text style={styles.tableCell}>{item.prix}</Text>
      <Text style={styles.tableCell}>{item.tva}</Text>
      <TouchableOpacity
        style={styles.tableCell}
        onPress={() => handleEdit(item)}
      >
        <Text style={styles.editButton}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tableCell}
        onPress={() => Delete(item.id_lignecommande)}
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
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={isAddModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setAddModalVisible(false)}>
            <Text style={{ fontSize: 40, marginLeft: '70%' }}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalHeader}>Ajouter un Product</Text>
          <Text style={styles.labelText}>Choisissez un produit:</Text>
          <SelectList
            boxStyles={{
              backgroundColor: 'white',
            }}
            inputStyles={{
             backgroundColor:'white',   
            }}
            style={styles.input}
            setSelected={(item) => {
              setAddData({ ...addData, id: item }); // Update addData with the selected item
              setSelected(item.value); // Set the selected item to the title
            }}
            data={formattedData} // Use the formatted data
          />
          <Text style={styles.labelText}>Category:</Text>
          <TextInput
            style={styles.input}
            placeholder="Category"
            editable={false}
            value={selectedItem ? String(selectedItem.category) : 'Catégorie'}
            onChangeText={(text) => setAddData({ ...addData, category: text })}
          />
          <Text style={styles.labelText}>Quantité:</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantité"
            value={addData.stock}
            keyboardType="numeric"
            onChangeText={(text) => setAddData({ ...addData, quantity: text })}
          />
          <Text style={styles.labelText}>Prix:</Text>
          <TextInput
            editable={false}
            placeholder="Price"
            style={styles.input}
            value={selectedItem ? String(selectedItem.price) : 'Prix'}
          />
             {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
        <TouchableOpacity style={styles.updateButton} onPress={handleAddProduct}>
            <Text style={styles.buttonText}>Ajouter</Text>
          </TouchableOpacity>

        </View>
      </Modal>
      <TouchableOpacity style={styles.validerButton} onPress={handlevalidate}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({

    container: {
        backgroundColor: '#f0f4f3',
        width: '100%',
        padding: 10
    },
    title: {
        marginTop: '5%',
        marginLeft: '-1 %',
   
        fontSize: 30,
        fontWeight: 'bold'
    },
    user: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    userDate: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    datePickerButton: {
        width: 30,
        height: 30,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10
    },
    validerButton: {
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
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'white',
        borderRadius: 5,
        fontSize: 16,
        padding: 10
    },labelText:{
        fontWeight: 'bold',
    },
    addButton: {
        width: 200,
        height: 50,
        marginTop: 10,
        marginLeft: '-4%'
    },
    button: {
      backgroundColor: '#2feabd',
 
    
      borderRadius: 10,
      paddingVertical: 15,
      paddingHorizontal:30,
        },
    
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft:10,
    },
    scrollView: {
        maxHeight: '60%',
        maxWidth: '100%'
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#74c9bb',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#82c797'
    },
    headerText: {
        backgroundColor: '#74c9bb',
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
        width: 120
    },
    tableRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#47c778'
    },
    editButton: {
        textAlign: 'center',
        padding: 10,
        color: '#2feabd',
        fontWeight: 'bold'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f3'
    },
    modalHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    }, 

    input: {
        width: '80%',
        padding: 10,
        marginBottom: 10,
        borderColor: '#ccc',
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 5
    },
    updateButton: {
        backgroundColor: '#2feabd',
        width: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    errorMessage: {
      color: 'red',
      fontSize: 16,
      marginTop: 10,
      textAlign:'center',
  },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    tableCell: {
        textAlign: 'center',
        padding: 10,
        width: 120
    }
});

export default Client1;
