import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Vendeur_Client = () => {
  const navigation = useNavigation();

  const [date, setDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [cin, setCIN] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = format(today, "dd-MM-yyyy");
    setDate(formattedDate);
  }, []);

  const saveUserData = async (id, email, idc) => {
    try {
      await AsyncStorage.setItem('userId', id.toString());
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('idclient', idc.toString());
      console.log('User data saved successfully!');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

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

  const Navigate = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const email = await AsyncStorage.getItem('email');

      if (userId !== null && email !== null) {
        const requestData = {
          userId: userId,
          email: email,
          cin: cin,
          adresse: adresse,
          localisation: localisation,
          nom: nom,
          prenom: prenom,
          date: date,
        };

        const response = await axios.post(
          'http://10.20.69.188/logo/Components/Roles/interfaces/phpfolderv2/addclient.php',
          JSON.stringify(requestData),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const userDataWithAction = { ...response.data.userData[0], action: 0 };

        console.log(userDataWithAction);
        setData(userDataWithAction);

        navigation.navigate('Ajouter_un_Produits', { clientData: userDataWithAction });
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
          <TextInput
            style={styles.input}
            placeholder="Adresse"
            value={adresse}
            onChangeText={setAdresse}
          />
          <TextInput
            style={styles.input}
            placeholder="Localisation"
            value={localisation}
            onChangeText={setLocalisation}
          />

          <Text style={styles.label}>Date de Naissance</Text>
          <View style={styles.dateContainer}>
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              value={date}
              editable={false}
            />
            <TouchableOpacity
              onPress={showDatePicker}
              style={styles.dateButton}
              activeOpacity={0.8}
            >
              <AntDesign name="calendar" size={24} color="#42c991" />
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.prevButton} onPress={() => navigation.goBack()}>
              <Text style={styles.prevButtonText}>Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={Navigate}>
              <Text style={styles.nextButtonText}>Valider</Text>
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateInput: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 16,
  },
  dateButton: {
    marginLeft: 10,
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

export default Vendeur_Client;
