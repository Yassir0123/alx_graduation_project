import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { AntDesign } from '@expo/vector-icons';
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
    // Generate email when nom or prenom changes
    if (nom && prenom) {
      const random = Math.floor(Math.random() * 9000 + 1000); // Generate a 4-digit random number
      const emailFormat = `${nom[0]}.${prenom}${random}@vendeur.com`;
      setEmail(emailFormat);
    }
    else{
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
          'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/addvendeur.php',
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
      <ScrollView>
        <View style={styles.form}>
          <Text style={styles.label}>CIN </Text>
          <TextInput
            style={styles.input}
            value={cin}
            onChangeText={setCIN}
          />
          <Text style={styles.label}>Nom </Text>
          <TextInput
            style={styles.input}
            value={nom}
            onChangeText={setNom}
          />
          <Text style={styles.label}>Prenom </Text>
          <TextInput
            style={styles.input}
            value={prenom}
            onChangeText={setPrenom}
          />
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={email}
              editable={false} // Make email input non-editable
            />
          </View>
          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              value={password}
              
            />
          </View>
          <Text style={styles.label}>Addresse </Text>
          <TextInput
            style={styles.input}
            value={adresse}
            onChangeText={setAdresse}
          />
          <Text style={styles.label}>Zone</Text>
          <TextInput
            style={styles.input}
            value={localisation}
            onChangeText={setLocalisation}
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

export default Commercial_Vendeur;
