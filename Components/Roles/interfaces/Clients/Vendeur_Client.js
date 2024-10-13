import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";

const Vendeur_Client = () => {
  const [date, setDate] = useState(new Date()); // Initialize with the current date
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [cin, setCIN] = useState(""); // CIN
  const [nom, setNom] = useState(""); // NOM
  const [prenom, setPrenom] = useState(""); // PRENOM
  const [adresse, setAdresse] = useState(""); // ADRESSE
  const [localisation, setLocalisation] = useState(""); // Localisation
  const [dateText, setDateText] = useState(""); // Formatted date text

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    const formattedDate = format(selectedDate, "dd/MM/yyyy"); // Format the date
    setDate(selectedDate);
    setDateText(formattedDate); // Update the formatted date text
    hideDatePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.text}>CIN</Text>
        <TextInput
          style={styles.input}
          value={cin}
          onChangeText={setCIN}
        />
        <Text style={styles.text}>Nom</Text>

        <TextInput
          style={styles.input}
          value={nom}
          onChangeText={setNom}
        />
        <Text style={styles.text}>Prenom</Text>

        <TextInput
          style={styles.input}
          value={prenom}
          onChangeText={setPrenom}
        />
        <Text style={styles.text}>Addresse</Text>

        <TextInput
        
          style={styles.input}
          value={adresse}
          onChangeText={setAdresse}
        />
        <Text style={styles.text}>Localisation</Text>

        <TextInput
          style={styles.input}
          value={localisation}
          onChangeText={setLocalisation}
        />
        <TouchableOpacity
          onPress={showDatePicker}
          style={styles.datePickerStyle}
          activeOpacity={0.8}
        >
          <Text>Date de naissance</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={dateText}
          editable={false} // Prevent manual editing
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize:16,
    fontWeight : 'bold',
  },
  datePickerStyle: {
    width: 230,
    borderColor: "gray",
    alignItems: "flex-start",
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  button: {
    backgroundColor: '#2feabd',
    width: 250,
    marginTop:'6%',
    marginLeft:'6%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    paddingVertical: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18 
  },
  container: {
    height: "100%",
    justifyContent: "center",
    backgroundColor: "#f0f4f3",
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "white",
    width: "100%",
    borderRadius: 5,
    fontSize: 16,
    padding: 15,
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
  },
  form: {
    width: "80%",
    marginLeft: 20,
  },
});

export default Vendeur_Client;


