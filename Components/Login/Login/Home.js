import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  const handleCommencerPress = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bienvenue}>Bienvenue</Text>
      <Image
        source={require('../img/Overwhelmed-bro.png')}
        style={styles.image}
      />
      <Text style={styles.text}>
        Préparez-vous à révolutionner votre commerce avec Logicom
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleCommencerPress}>
        <Text style={styles.buttonText}>Commencer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f4f3',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bienvenue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  image: {
    width: 340,
    height: 312,
    marginBottom: 40,
  },
  text: {
    fontSize: 18,
    width: 300,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop:'6%',
    width:230,
    justifyContent:'center',
    marginLeft:1,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;
