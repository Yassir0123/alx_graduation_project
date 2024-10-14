import React, { useEffect,useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderDelivered = () => {
const [userid,setUserid]=useState('');
const [emails,setEmail]=useState('');
  useEffect(() => {
    const fetchClientData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const email = await AsyncStorage.getItem('email');
      setUserid(userId);
      setEmail(email);
    };
    fetchClientData();
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Your Deliver Slip has been created</Text>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?cs=srgb&dl=pexels-ash-122861-376464.jpg&fm=jpg' }} // Replace with your image URL
            style={styles.image}
          />
        </View>
        <View style={styles.orderInfo}>
          <Text style={styles.orderText}>Enjoy your order!</Text>
          <Text style={styles.thankText}>
            Keep on the good work ! Let us know how it went.
          </Text>
          <View style={styles.contactContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?cs=srgb&dl=pexels-ash-122861-376464.jpg&fm=jpg' }} // Replace with your profile image URL
              style={styles.profileImage}
            />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactName}>{emails}</Text>
              <Text style={styles.contactDescription}>
                Email us if you have any issue
              </Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Ionicons name="mail-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  backButton: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  helpButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00b14f',
  },
  orderInfo: {
    marginTop: 16,
  },
  orderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  thankText: {
    fontSize: 14,
    marginBottom: 16,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactDescription: {
    fontSize: 14,
    color: '#888',
  },
  callButton: {
    padding: 8,
  },
  noteContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#888',
  },
});

export default OrderDelivered;
