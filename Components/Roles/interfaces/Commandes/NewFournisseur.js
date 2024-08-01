import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NewFournisseur = () => {
  const navigation = useNavigation();

  const NavigateNouveau = () => {
    navigation.navigate('Ajout_Fournisseur', { action: 0 });
  };
  const Navigate = () => {
    navigation.navigate('Fournisseur_existant');
  };
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity style={styles.button} onPress={NavigateNouveau}>
          <Text style={styles.buttonText}>Nouveau-Fournisseur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={Navigate}>
          <Text style={styles.buttonText}>Fournisseur-Existant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f3',
    height: '100%',
  },
  button: {
    backgroundColor: '#1e1f1f',
    width: 300,
    alignSelf: 'center',
    marginBottom: '15%', // Adjust the marginBottom to move the buttons higher
    marginTop: '4%', // Adjust the marginTop to move the buttons higher
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 25,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 22,
    textAlign: 'center',
  },
});

export default NewFournisseur;
