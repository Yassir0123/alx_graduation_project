import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import VosClients from '../interfaces/Clients/VosClients';
import Productsroutes from '../interfaces/Products/productsroutes';
import Message from '../interfaces/Message/Message';
import CommandeRoute from '../interfaces/Commandes/CommandeRoutes';

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
          } else if (route.name === 'Message') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Commande') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { display: 'flex' },
      })}
    >
      <Tab.Screen name="Home" component={VosClients} />
       <Tab.Screen name="Stock" component={Productsroutes} />
      <Tab.Screen name="Message" component={Message} />
      <Tab.Screen name="Commande" component={CommandeRoute} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
