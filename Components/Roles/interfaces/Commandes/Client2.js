import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const Client2 = () => {
  const navigation = useNavigation();
 t [Produit,
        setProduit] = useState('');
    const [Quantity,
        setQuantity] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.text}>Produit</Text>
                <TextInput style={styles.input} value={Produit} onChangeText={setProduit}/>

                <Text style={styles.text}>Quantité</Text>
                <TextInput style={styles.input} value={Quantity} onChangeText={setQuantity} keyboardType="numeric" // Set the keyboard to numeric
                />

                <TouchableOpacity style={styles.button} onPress={() => Navigate()}>

                    <Text style={styles.buttonText}>Valider</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    datePickerStyle: {
        width: 230,
        borderColor: "gray",
        alignItems: "flex-start",
        borderWidth: 0,

        borderBottomWidth: 1
    },
    button: {
        backgroundColor: '#2feabd',
        width: 150,
        marginTop: '6%',
        marginLeft: '6%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingVertical: 30
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 25
    },
    container: {
        height: "100%",
        justifyContent: "center",
        backgroundColor: "#f0f4f3"
    },
    input: {
        borderWidth: 1,
        borderColor: "white",
        backgroundColor: "white",
        width: "100%",
        borderRadius: 5,
        fontSize: 16,
        padding: 15,
        marginBottom: 15
    },
    inputMessage: {
        borderWidth: 1,
        borderColor: "white",
        backgroundColor: "white",
        width: "100%",
        borderRadius: 5,
        fontSize: 16,
        padding: 100,
        marginBottom: 15
    },
    label: {
        fontWeight: "bold"
    },
    form: {
        width: "80%",
        marginLeft: 20
    }
});

export default Client2;