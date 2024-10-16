import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Commercial_Vendeur = () => {
  const [date, setDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [cin, setCIN] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = format(today, "dd-MM-yyyy");
    setDate(formattedDate);
  }, []);

  useEffect(() => {
    if (nom && prenom) {
      const random = Math.floor(Math.random() * 9000 + 1000);
      const emailFormat = `${nom[0]}.${prenom}${random}@vendeur.com`;
      setEmail(emailFormat);
    } else {
      setEmail('');
    }
  }, [nom, prenom]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    const formattedDate = format(selectedDate, "dd-MM-yyyy");
    setDate(formattedDate);
    hideDatePicker();
  };


  const navigation = useNavigation();
  const back= async()=>{
    navigation.goBack();
  }
  const Navigate = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (userId !== null ) {
        console.log('User ID:', userId);
   
        const requestData = {
          userId: userId,
          cin: cin,
          adresse: adresse,
          zone: localisation,
          nom: nom,
          prenom: prenom,
          date: date,
          email: email,
          password: password,
        };

        const response = await axios.post(
          'http://192.168.125.68/logo/Components/Roles/interfaces/phpfolderv2/addvendeur.php',
          JSON.stringify(requestData),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        console.log(response.data);
        navigation.navigate('Vos_Vendeur');
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
            placeholder="CIN" 
            value={cin}
            onChangeText={setCIN}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Nom" 
            value={nom}
            onChangeText={setNom}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Prenom" 
            value={prenom}
            onChangeText={setPrenom}
          />
          <Text style={styles.label}>Date de Naissance</Text>
          <TouchableOpacity onPress={showDatePicker}>
            <TextInput 
              style={styles.input} 
              value={date} 
              editable={false}
            />
          </TouchableOpacity>
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            value={email}
            editable={false}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Mot de passe" 
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Addresse" 
            value={adresse}
            onChangeText={setAdresse}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Zone" 
            value={localisation}
            onChangeText={setLocalisation}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.prevButton} onPress={back}>
              <Text style={styles.prevButtonText}>Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={Navigate}>
              <Text style={styles.nextButtonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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

export default Commercial_Vendeur;