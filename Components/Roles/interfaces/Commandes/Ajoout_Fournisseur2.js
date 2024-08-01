import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Ajout_Fournisseur2 = () => {
  const [date, setDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [nom_entreprise, setNomEntreprise] = useState("");
  const [telephone_contact, setTelephoneContact] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [data, setData] = useState([]);
  const [email_contact, setEmailContact] = useState('');
  const [pays, setPays] = useState('');
  const [code_postal, setCodePostal] = useState('');
  const [categorie, setCategorie] = useState(''); // Added state for Catégorie Produit

  useEffect(() => {
    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd");
    setDate(formattedDate);
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    setDate(formattedDate);
    hideDatePicker();
  };

  const navigation = useNavigation();

  const Navigate = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (userId !== null) {
        console.log('User ID:', userId);

        const requestData = {
          nom: nom_entreprise,
          email: email_contact,
          telephone: telephone_contact,
          categorie: categorie,
          adresse: adresse,
          ville: ville,
          pays: pays,
          codeposte: code_postal,
          date: date,
        };
  console.log(requestData);
      const response = await axios.post(
          'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/addfournisseur.php',
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const responses= await axios.get(
          'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getidsfournisseur.php',
        
        );
        const responser= await axios.get(
          'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getnewidachat.php',
        
        );
        setData(responses.data.userData);
       console.log(data);
        const FournisseurData = {
          idcmdcount: data[0].idcmdcount,
          nom_entreprise: requestData.nom,
          id_fournisseur:responser.data,
          
          date_livraison: requestData.date,
          categorie_produit: requestData.categorie,
          telephone_contact: requestData.telephone,
          email_contact: requestData.email,
          action: data[0].action,
        };
        console.log(FournisseurData);
      //  console.log(response.data);
    navigation.navigate('Fournisseurs')
      } else {
        console.log('User data not found.');
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.form}>
          <Text style={styles.label}>Nom de l'entreprise</Text>
          <TextInput
            style={styles.input}
            value={nom_entreprise}
            onChangeText={setNomEntreprise}
          />
          <Text style={styles.label}>Email de contact</Text>
          <TextInput
            style={styles.input}
            value={email_contact}
            onChangeText={setEmailContact}
          />
          <Text style={styles.label}> Catégorie:</Text>
          <TextInput
            style={styles.input}
            value={categorie}
            onChangeText={setCategorie} // Updated to set Catégorie
          />
          <Text style={styles.label}>Téléphone de contact</Text>
          <TextInput
            style={styles.input}
            value={telephone_contact}
            onChangeText={setTelephoneContact}
          />
          <Text style={styles.label}>Adresse</Text>
          <TextInput
            style={styles.input}
            value={adresse}
            onChangeText={setAdresse}
          />
          <Text style={styles.label}>Ville</Text>
          <TextInput
            style={styles.input}
            value={ville}
            onChangeText={setVille}
          />
          <Text style={styles.label}>Pays</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPays(text)}
            value={pays}
          />
          <Text style={styles.label}>Code Postal</Text>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            onChangeText={(text) => setCodePostal(text)}
            value={code_postal}
          />
          <View style={styles.datePickerContainer}>
            <Text style={styles.label}>Date de Naissance</Text>
            <TouchableOpacity
              onPress={showDatePicker}
              style={styles.datePickerButton}
              activeOpacity={0.8}
            >
              <AntDesign name="calendar" size={24} color="#42c991" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.input}
            activeOpacity={0.8}
            onPress={showDatePicker}
          >
            <TextInput
              style={styles.inputText}
              value={date}
              editable={false}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <TouchableOpacity style={styles.button} onPress={() => Navigate()}>
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 5,
    fontSize: 16,
    padding: 10,
    marginBottom: 15,
  },
  inputText: {
    fontSize: 16,
  },
  datePickerButton: {
    marginLeft: 10,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  form: {
    width: '80%',
    height: '100%', // Changed to 100% to make it scrollable
    marginTop: '10%', // Moved up a bit
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f4f3',
    height: '100%',
  },
  button: {
    backgroundColor: 'black',
    width: 150,
    marginTop: 10, // Adjusted margin top
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 13,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 25
  },
});

export default Ajout_Fournisseur2;
