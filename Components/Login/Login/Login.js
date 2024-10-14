import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import {URL} from '@env';
const Login = () => {
  
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // Save user data
const saveUserData = async (id, email,nom,prenom) => {
  try {
    await AsyncStorage.setItem('userId', id.toString());
    await AsyncStorage.setItem('email', email);
    const fullName = `${nom} ${prenom}`;
    AsyncStorage.setItem('fullname', fullName);
    console.log('User data saved successfully!');
    console.log(fullName)
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

  const handleLogin = async () => {
    try {
      if(!email.includes('@')){
          setErrorMessage('Invalid email');
      }
      const emailParts = email.split('@');
      const domain = emailParts[1]

      const validDomains = ['vendeur.com', 'commerciale.com', 'livreur.com', 'comptable.com', 'receptionist.com', 'operateur.com','achat.com'];
      
       if(!validDomains.includes(domain)) {
          setErrorMessage('Invalid email domain.');
          return;
      }
       console.log('lol',URL);
      const response = await axios.post('http://192.168.11.105/alx/alx/Components/Login/phpfolder/login.php',  {
          email: email,
          password: password,
      });
      if (response.data.message === 'Login successful') {
          setErrorMessage('');
      console.log(response.data)
          saveUserData(response.data.id,email,response.data.nom,response.data.prenom);
          navigation.navigate('RoleNavigation', { userRole: domain});      
      
      } else {
          setErrorMessage('Invalid login credentials.');
      }


   //   console.log(response.data); // Output the server response
  } catch (error) {
      console.error('Error during login:', error); // if the php file isn't recognized
  }
        /*navigation.navigate('RoleNavigation', { userRole: domain});*/
      }
  
      const handleForgotPassword=()=>{
    navigation.navigate('PSforgotten')
  }
  return (
    <View style={styles.container}>
      <Image source={require('../img/Authentication-bro.png')} style={styles.image} />
      <Text style={styles.text}>Login</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            value={password}
          />
          {/*<Text style={styles.forgotPassword} onPress={() => handleForgotPassword()}>
             Mot de passe oublié?
            </Text>
 */}
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

           <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>
        </View>
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
  image: {
    height: 300,
    width: 300,
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom:'5%'
  },
  label: {
    fontSize: 16,
    fontWeight:'bold',
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
    width:290,
    justifyContent:'center',
    marginLeft:1,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18 
  },forgotPassword:{
    color: '#46a6bf',
    textAlign: 'right',
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign:'center',
}
});

export default Login;
