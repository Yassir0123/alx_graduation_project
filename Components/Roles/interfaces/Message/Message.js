import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Linking,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const Message = () => {
  const route = useRoute();
  const [Objet, setObjet] = useState('');
  const [Email, setEmail] = useState('');
  const [Message, setMessage] = useState('');
  const [data, setData] = useState([]);
  const [Loading, setLoading] = useState(true);
  const FournisseurData = route.params;

  useEffect(() => {
    const fetchData = async () => {
      console.log('lol',FournisseurData);

      // Check if FournisseurData is defined
     
        try {
          const response = await axios.post(
            'http://192.168.11.105/logo/Components/Roles/interfaces/phpfolderv2/getligneachat.php',
            {
              idcmdcount: FournisseurData.idcmd,
            },
            {
              responseType: 'json',
            }
          );
             console.log(response.data); 
          if (response.data.message === 'got data') {
            setData(response.data.userData);
            console.log(data);
          } else {
            console.log('nothing');
          }

          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
   
    };

    fetchData();
  }, [FournisseurData]);

  // Set initial values for Email and Message if FournisseurData is defined
  useEffect(() => {
    if (FournisseurData) {
      setEmail(FournisseurData.emails || '');
      // Create the initial message content by mapping the data
      const messageContent = data.map((item) => `${item.libeller}: ${item.quantiter}`);
      setMessage(messageContent.join('\n'));
    }
  }, [FournisseurData, data]);
  const sendEmail = () => {
    // Create the mailto URL
    const subject = encodeURIComponent(Objet);
    const body = encodeURIComponent(Message);
    const recipient = encodeURIComponent(Email);

    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

    // Open the email client
    Linking.openURL(mailtoUrl)
      .then(() => {
        console.log('Email client opened successfully');
      })
      .catch((error) => {
        console.error('Error opening email client:', error);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.text}>Objet</Text>
          <TextInput style={styles.input} value={Objet} onChangeText={setObjet} />

          <Text style={styles.text}>E-mail Destinataire</Text>

          <TextInput style={styles.input} value={Email} onChangeText={setEmail} />

          <Text style={styles.text}>Message</Text>

          <TextInput
            style={styles.inputMessage}
            value={Message}
            onChangeText={setMessage}
            multiline={true}
            numberOfLines={100}
          />

          <TouchableOpacity style={styles.button}  onPress={sendEmail}>
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2feabd',
    width: 120,
    alignSelf: 'center',
    marginTop: 20, 
    borderRadius: 10,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 22,
    textAlign:'center',
  },
container: {
    flex: 1, // Use flex instead of setting a fixed height
    justifyContent: 'center',
    backgroundColor: '#f0f4f3',
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 5,
    fontSize: 16,
    padding: 15,
    marginBottom: 15,
  },
  inputMessage: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 5,
    fontSize: 16,
    padding: 15,
    textAlignVertical: "top",
    marginBottom: 15,
    height: 260
  },
  form: {
    width: '80%',
    marginLeft: 20,
    marginTop: '18%', // Adjust the marginTop to move the form higher
  },
});

export default Message;
