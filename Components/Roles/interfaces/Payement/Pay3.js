import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput,Modal,TouchableOpacity} from 'react-native';
import { RadioButton } from 'react-native-paper';
import StripePay from './PaiementTest';
const Pay3 = ({route}) => {
  const [checked, setChecked] = useState('first'); // Initialize the selected value
  const [numeriqueInputVisible, setNumeriqueInputVisible] = useState(false);
  const [numeriqueValue, setNumeriqueValue] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const { Bonlivraison } = route.params;
  const [montantTotale, setMontantTotale] = useState(Bonlivraison.montant_totale);
  const handlevalidate= ()=>{
//YOUR LOGIC TO VALIDATE

  }
  const handleRadioChange = (newValue) => {
    setChecked(newValue);
  
    // Show the text input below the first two options
    if (newValue === 'first' || newValue === 'second') {
      setNumeriqueInputVisible(true);
    } else {
      setNumeriqueInputVisible(false);
    }
  
    // Check if the "Carte Visa" option is selected and show the modal
    if (newValue === 'third') {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  };
  

  return (
    <View style={styles.container}>
            <View>
        <View style={styles.row}>
          <Text style={styles.text}>Bon: {Bonlivraison.id_bonlivraison} </Text>
          <Text style={styles.text}>{Bonlivraison.date_livraison}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Nom : {Bonlivraison.nom_client}</Text>
          <Text style={styles.text}>Prenom: {Bonlivraison.prenom_client}</Text>
        </View>
        <Text style={[styles.text, styles.infos]}>Addresse : {Bonlivraison.localisation}</Text>
        <Text style={[styles.text, styles.infos]}>telephone: {Bonlivraison.telephone_client}</Text>
        <View style={styles.row}>
          <Text style={styles.text}>Commande : {Bonlivraison.id_commande}</Text>
          <Text style={styles.text}>Livreur : {Bonlivraison.id_vendeur}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Montant Total : {montantTotale}</Text>
        </View>

      <View style={styles.radio}>
        <Text>Methode de paiement:</Text>
        <RadioButton.Group onValueChange={handleRadioChange} value={checked}>
          <View>
            <RadioButton.Item label="En espece" value="first" />
          </View>
          <View>
            <RadioButton.Item label="Cheque" value="second" />
          </View>
          <View>
            <RadioButton.Item label="Carte Visa" value="third" />
          </View>
        </RadioButton.Group>
        {numeriqueInputVisible && (
          <TextInput
            style={styles.numeriqueInput}
            placeholder="Le montant payé"
            keyboardType="numeric"
            value={numeriqueValue}
            onChangeText={(text) => setNumeriqueValue(text)}
          />
        )}
        <Text>Selected option: {checked}</Text>
      </View>
     {isModalVisible? <Modal style={styles.modalContent} >
  <View style={styles.modalContent}>
  <TouchableOpacity  style={styles.updateButton} onPress={() => setModalVisible(false)}>
            <Text style={{ fontSize: 40, marginLeft: '80%' }}>✕</Text>
          </TouchableOpacity>
          <StripePay mt = {montantTotale} />
   
  </View>
</Modal>:''}
<TouchableOpacity style={styles.button} onPress={handlevalidate} >
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
    </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infos: {
    padding: 10,
    marginBottom: 10,
  },
  radio: {
    marginTop: 20,
  },
  textradio: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },numeriqueInput:{
    backgroundColor:'white',
    height:'16%',
    
    textAlign:'center'

  },modalContent:{
    height:30
  },
  addButton: {
    width: 200,
    height: 50,
    marginTop: 10,
    marginLeft: '-4%'
},
button: {
  backgroundColor: '#2feabd',


  borderRadius: 10,
  paddingVertical: 15,
  paddingHorizontal:30,
    }
,modalContent: {
    flex: 1,


    justifyContent: 'center',
    
    backgroundColor: '#f0f4f3',
    
  
},
  buttonText: {
    color: '#ffffff',
    fontSize: 22,
    textAlign: 'center',
  },
});


export default Pay3;
