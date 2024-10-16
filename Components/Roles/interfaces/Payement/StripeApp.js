import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

// ADD localhost address of your server
const API_URL = "http://192.168.11.105:3000";


const StripeApp = (props) => {
  const [email, setEmail] = useState();
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();

  const fetchPaymentIntentClientSecret = async () => {
    const { montantTotale } = props; // Extract the montantTotale from props
  
    try {
      const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          montantTotale: montantTotale, // Include the montantTotale in the request body
        }),
      });
  
      const { clientSecret, error } = await response.json();
      return { clientSecret, error };
    } catch (error) {
      console.error("Error fetching payment intent:", error);
      return { error };
    }
  };
  const handlePayPress = async () => {
    // 1. Gather the customer's billing information (e.g., email)
    if (!cardDetails?.complete || !email) {
      Alert.alert("Please enter complete card details and email");
      return;
    }
    const billingDetails = {
      email: email,
    };
    // 2. Fetch the intent client secret from the backend
    try {
      const { clientSecret, error } = await fetchPaymentIntentClientSecret();
      // 3. Confirm the payment
      if (error) {
        console.log("Unable to process payment");
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          type: "Card",
          billingDetails: billingDetails,
        });
        if (error) {
          alert(`Payment Confirmation Error ${error.message}`);
        } else if (paymentIntent) {
          alert("Payment Successful");
          console.log("Payment successful ", paymentIntent);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="E-mail"
        keyboardType="email-address"
        onChange={(event) => setEmail(event.nativeEvent.text)}
        style={styles.input}
      />
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
      />
      <TouchableOpacity style={styles.updateButton} >
      <Button onPress={handlePayPress} title="Pay"  type="clear"  color='#2feabd'  />

      </TouchableOpacity>
    </View>
  );
};
export default StripeApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  updateButton: {
    backgroundColor: '#2feabd',
    width: 100,
    height: 50,
    justifyContent: 'center',
    marginTop:30,
    alignItems: 'center',
    borderRadius: 50
},
  input: {
    backgroundColor: "#efefef",
    borderRadius: 8,
    fontSize: 20,
    height: 50,
    padding: 10,
    width:'100%',
    marginBottom: 20, // Added margin bottom to separate from CardField
  },

   

  card: {
    backgroundColor: "#efefef",
  },
  cardContainer: {
    height: 50,
    width: "100%", // Full width
  },
});
