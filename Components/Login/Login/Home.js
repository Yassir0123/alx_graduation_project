import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();
  const [showGif, setShowGif] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    const gifTimer = setTimeout(() => {
      setShowGif(false);
      setShowContent(true);
    }, 8500);

    return () => clearTimeout(gifTimer);
  }, []);

  useEffect(() => {
    if (showContent) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showContent]);

  const handleCommencerPress = () => {
    navigation.navigate('Login');
  };

  if (showGif) {
    return (
      <View style={styles.container}>
        <Image
          source={require('../img/loading-the-truck.gif')}
          style={styles.loadingGif}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.bienvenue, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        Welcome
      </Animated.Text>
      <Animated.Image
        source={require('../img/Overwhelmed-bro.png')}
        style={[styles.image, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      />
      <Animated.Text style={[styles.text, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        Get Ready to Revolutionize Your Business with WareCom!
      </Animated.Text>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <TouchableOpacity style={styles.button} onPress={handleCommencerPress}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </Animated.View>
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
  loadingGif: {
    width: 200,
    height: 200,
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
    marginTop: '6%',
    width: 230,
    justifyContent: 'center',
    marginLeft: 1,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;