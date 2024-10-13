import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, ScrollView, Text } from 'react-native';
import { 
  Provider as PaperProvider, 
  Card, 
  Title, 
  Paragraph, 
  List, 
  Button,
  Portal,
  Modal,
  useTheme,
  configureFonts,
  DefaultTheme,
  RadioButton,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3f51b5',
    accent: '#ff4081',
  },
  fonts: configureFonts({
    default: {
      regular: {
        fontFamily: 'Roboto',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'Roboto-Medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'Roboto-Light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'Roboto-Thin',
        fontWeight: 'normal',
      },
    },
  }),
};

const useSlideInAnimation = (delay = 0) => {
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, [slideAnim, delay]);

  return slideAnim;
};

const CheckoutScreen = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const theme = useTheme();
  const slideAnim = useSlideInAnimation();
  const { products, Bonlivraison ,totalPrice, totalTVA } = route.params;
  const [loading, setLoading] = useState(true);
  const [totalprice, setTotalprice] = useState(0);
  const [clientDetails, setClientDetails] = useState(null);
  const navigation = useNavigation();
  // Calculate totals
  const calculateTotals = (products) => {
    let subtotal = 0;
    let totalTax = 0;

    products.forEach(product => {
      const productTotal = product.price * product.quantity;
      subtotal += productTotal;
      totalTax += productTotal * product.tva;
    });

    const totalAmount = subtotal + totalTax;
    return {
      subtotal: subtotal,
      tax: totalTax,
      totalAmount: totalAmount
    };
  };

  const { subtotal, tax, totalAmount } = calculateTotals(products);

  useEffect(() => {
    // Fetch client information
    const fetchClientData = async () => {
      try {
        const response = await axios.post(
          'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/getclientbyid.php',
          { id: Bonlivraison.id_client },
          { responseType: 'json' }
        );
        setClientDetails(response.data.userData[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching client data:', error);
        setLoading(false);
      }
    };

    fetchClientData();
  }, [Bonlivraison.id_client]);

  // Safely format numbers
  const formatAmount = (amount) => {
    return amount !== undefined ? amount.toFixed(2) : '0.00';
  };
  const handlepress = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const { subtotal, tax, totalAmount } = calculateTotals(products);
  
      // Prepare data for the paiement table
      const paymentData = {
        id_bonlivraison: Bonlivraison.id_bonlivraison,
        id_livreur: Bonlivraison.id_livreur,
        montant_totale: totalAmount,
        montant_payer: subtotal,
        moyen_paiement: paymentMethod,
        id_client: Bonlivraison.id_client,
        nom_client: clientDetails.nom,
        prenom_client: clientDetails.prenom,
        date_paiement: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        telephone_client: clientDetails.telephone_client,
      };
  
      // Prepare data for the bonvalider table
      const bonvaliderData = {
        id_bonlivraison: Bonlivraison.id_bonlivraison,
        id_commande: Bonlivraison.id_commande,
        id_operateur: Bonlivraison.id_operateur,
        id_livreur: Bonlivraison.id_livreur,
        id_commerciale: Bonlivraison.id_commerciale,
        id_vendeur: Bonlivraison.id_vendeur||0,
        id_client: Bonlivraison.id_client,
        nom_client: clientDetails.nom,
        prenom_client: clientDetails.prenom,
        localisation: Bonlivraison.localisation,
        date_livraison: Bonlivraison.date_livraison,
        telephone_client: clientDetails.telephone_client,
        montant_totale: totalAmount,
      };
  console.log(paymentData);
      // Send data to the server
      const response = await axios.post(
        'http://192.168.11.105/alx/alx/Components/Roles/interfaces/phpfolderv2/addpays.php',
        { paymentData, bonvaliderData },
        { responseType: 'json' }
      );
      // Handle response
      console.log('response: ',response.data);
      if (response.data.message === 'gotdata') {
        navigation.navigate('Pay7', {
          id_bonlivraison: Bonlivraison.id_bonlivraison,
          totalTVA: totalTVA,
          totalTax: tax, 
          // Pass total tax if needed
        });
      } else {
        console.log('Error:', response.data.message);
      }
    } catch (error) {
      console.error('error:', error);
    }
  };
  
  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.container}>
        <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Payment Information</Title>
              <List.Item
                title="Total Amount"
                description={`$${formatAmount(totalAmount)}`}
                left={props => <Ionicons name="logo-usd" size={24} color={theme.colors.primary} />}
              />
              <List.Item
                title="Subtotal"
                description={`$${formatAmount(subtotal)}`}
                left={props => <Ionicons name="receipt" size={24} color={theme.colors.primary} />}
              />
              <List.Item
                title="Tax"
                description={`$${formatAmount(tax)}`}
                left={props => <Ionicons name="pricetag" size={24} color={theme.colors.primary} />}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Client Information</Title>
              {loading ? (
                <Paragraph>Loading client information...</Paragraph>
              ) : clientDetails ? (
                <>
                  <Paragraph style={styles.contactName}>{`${clientDetails.prenom} ${clientDetails.nom}`}</Paragraph>
                  <Paragraph>{clientDetails.email}</Paragraph>
                  <Paragraph>{clientDetails.addresse}</Paragraph>
                </>
              ) : (
                <Paragraph>Client information not available.</Paragraph>
              )}
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Payment Method</Title>
              <RadioButton.Group onValueChange={value => setPaymentMethod(value)} value={paymentMethod}>
                <View style={styles.radioItem}>
                  <RadioButton value="Espece" />
                  <Paragraph>Espece</Paragraph>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton value="Cheque" />
                  <Paragraph>Cheque</Paragraph>
                </View>
              </RadioButton.Group>
            </Card.Content>
          </Card>

          <Button 
            mode="contained" 
            onPress={handlepress} 
            style={styles.validateButton}
            icon={() => <Ionicons name="checkmark" size={24} color="#fff" />}
          >
            Validate
          </Button>
        </Animated.View>
      </ScrollView>
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContent}>
          <Title>Payment Information</Title>
          <Paragraph>This screen shows the payment details and allows you to select a payment method to complete your purchase.</Paragraph>
          <Button onPress={() => setModalVisible(false)}>Close</Button>
        </Modal>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 8,
  },
  contactName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  validateButton: {
    marginTop: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default CheckoutScreen;
