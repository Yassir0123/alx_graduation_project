import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import axios from 'axios';
import {URL} from '@env'
const PSverify = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleResettingPassword = async () => {
    const users = route.params.userId; 
    const email=route.params.userEmail;
    try {
     console.log(users);
     console.log(code);
     console.log(email);
      const response = await axios.post('http://192.168.11.105/logo/Components/Login/phpfolder/verifycode.php',  {
        userId:users,
          email: email,
          code: code,
          
      });
      console.log(response.data);
      if (response.data.message === 'Login successful') {
        setErrorMessage('');
        navigation.navigate('PSreset', { userId: users, userEmail: email });
        // Pass the userId as parameter
    } 
       else {
          setErrorMessage('Invalid login credentials.');
      }


   //   console.log(response.data); // Output the server response
  } catch (error) {
      console.error('Error during login:', error); // if the php file isn't recognized
  }
        /*navigation.navigate('RoleNavigation', { userRole: domain});*/
      }

  return (
    <View style={styles.container}>
      <Image source={require('../img/Forgot-password-bro.png')} style={styles.Image} />
      <Text style={styles.text}>Vous avez oublié votre mot de passe ? Aucun souci !</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Code de vérification</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your code"
            onChangeText={(text) => setCode(text)}
            value={code}
          />
        </View>
        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleResettingPassword}>
          <View style={styles.buttonBackground}>
            <Text style={styles.buttonText}>Réinitialiser le mot de passe</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f3',
  },
  Image: {
    height: 240,
    marginBottom: '12%',
    width: 340,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: '4%',
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
    width:250,
    justifyContent:'center',
    marginLeft:16,
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

export default PSverify;
