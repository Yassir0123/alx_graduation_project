import 'react-native-gesture-handler';
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Message from '../interfaces/Message/Message';
import Atraiter from '../interfaces/Commandes/Commandetraiter';
import BDLRouter from '../interfaces/BonDeLivraison/BDLRouter';
import Productsroutes from '../interfaces/Products/productsroutes';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Stock') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Alerte') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Bon De Livraison') {
            iconName = focused ? 'document' : 'document-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { display: 'flex' },
      })}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={Atraiter} />
      <Tab.Screen name="Stock" component={Productsroutes} />
      <Tab.Screen name="Alerte" component={Message} />
      <Tab.Screen name="Bon De Livraison" component={BDLRouter} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
