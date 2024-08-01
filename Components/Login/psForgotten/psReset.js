import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios'; // Import axios to send data to the server
import {URL} from '@env'
const PSreset = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [password, setPassword] = useState('');
  const [c_password, setC_password] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const users = route.params.userId; 
  
  const Handlepasswordchanged = async () => {
    
    //we get the id
  console.log(users);
    
    if(password==='' || c_password===''){
      setErrorMessage('Fill all inputs');
      exit;
    }
    if (password === c_password) { // Check if passwords match
      try {
        console.log('lol',users);
        console.log(route.params.userEmail);
        console.log(password);
        const response = await axios.post('http://192.168.11.105/logo/Components/Login/phpfolder/reset.php' , {
          userId:users,
          userEmail:route.params.userEmail,
          newPassword: password, // Send the new password
        });

        if (response.data.message === 'welldone') {
          setErrorMessage(''); // Clear any previous error messages
          navigation.navigate('PSresetted'); // Navigate to the success page
        } else {
          setErrorMessage('Password reset failed.'); // Set error message if reset fails
        }
      } catch (error) {
        console.error('Error during password reset:', error);
        setErrorMessage('Password reset failed.');
      }
    } else {
      setErrorMessage('Passwords do not match.'); // Set error message if passwords don't match
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../img/Forgot-password-bro.png')} style={styles.Image} resizeMode="contain" />
      <Text style={styles.text}>Vous avez oublié votre mot de passe ? Aucun souci !</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nouveau mot de passe</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            value={password}
          />
        </View>

        <Text style={styles.label}>Confirmer votre mot de passe</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            onChangeText={(text) => setC_password(text)}
            secureTextEntry={true}
            value={c_password}
          />
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={Handlepasswordchanged}>
            <Text style={styles.buttonText}>Confirmer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ... (styles and export)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#f0f4f3',
  },
  Image: {
    height: 300, // Adjust the height as needed
    width: '100%', // Use the full width available
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: '5%',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  form: {
    width: '80%',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop:'6%',
    width:285,
    justifyContent:'center',
    marginLeft:1,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16, // Slightly reduce font size for better fit
    textAlign: 'center', // Center the button text
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign:'center',
}
});

export default PSreset;