import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
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
  const [categorie, setCategorie] = useState('');

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
  const prev = async() =>{
    navigation.goBack();
  }
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
    'http://192.168.125.68/logo/Components/Roles/interfaces/phpfolderv2/addfournisseur.php',
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const responses= await axios.get(
    'http://192.168.125.68/logo/Components/Roles/interfaces/phpfolderv2/getidsfournisseur.php',
        );
        const responser= await axios.get(
    'http://192.168.125.68/logo/Components/Roles/interfaces/phpfolderv2/getnewidachat.php',
        );
        setData(responses.data.userData);
        console.log(data);
        const FournisseurData = {
       //   idcmdcount: data[0].idcmdcount,
          nom_entreprise: requestData.nom,
          id_fournisseur:responser.data,
          date_livraison: requestData.date,
          categorie_produit: requestData.categorie,
          telephone_contact: requestData.telephone,
        email_contact: requestData.email,
        //  action: data[0].action,
        };
        console.log(FournisseurData);
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Company Name"
            value={nom_entreprise}
            onChangeText={setNomEntreprise}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email_contact}
            onChangeText={setEmailContact}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={categorie}
            onChangeText={setCategorie}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={telephone_contact}
            onChangeText={setTelephoneContact}
          />
          <TextInput
            style={styles.input}
            placeholder="Adress"
            value={adresse}
            onChangeText={setAdresse}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={ville}
            onChangeText={setVille}
          />
          <TextInput
            style={styles.input}
            placeholder="Country"
            value={pays}
            onChangeText={setPays}
          />
          <TextInput
            style={styles.input}
            placeholder="Zip Code"
            keyboardType='numeric'
            value={code_postal}
            onChangeText={setCodePostal}
          />
          <Text style={styles.label}>Creation_Date</Text>
          <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{date || "Sélectionner une date"}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.prevButton} onPress={prev}>
              <Text style={styles.prevButtonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={Navigate}>
              <Text style={styles.nextButtonText}>Validate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 30,
    margin: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  label: {
    color: '#666',
    marginBottom: 5,
  },
  dateButton: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  prevButton: {
    borderWidth: 1,
    borderColor: '#ff3b30',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  prevButtonText: {
    color: '#ff3b30',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Ajout_Fournisseur2;
