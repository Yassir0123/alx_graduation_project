import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PSresetted = () => {
  const navigation = useNavigation();

  const handleLoginNavigation = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../img/Done-bro.png')} style={styles.image} resizeMode="contain" />
      <Text style={styles.text}>Votre mot de passe a été réinitialisé avec succès !</Text>
      <TouchableOpacity style={styles.button} onPress={handleLoginNavigation}>
        <Text style={styles.buttonText}>Connectez-vous</Text>
      </TouchableOpacity>
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
    marginBottom: '10%',
    height: 280,
    width: '100%',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: '5%',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: '6%',
    width: 250,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PSresetted;
