import 'react-native-gesture-handler';
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Message from '../interfaces/Message/Message';
import VosFournisseurs from '../interfaces/Commandes/Fournisseurs';
import FourCommandeRoutes from '../interfaces/Commandes/FourCommandeRoute';
import Newproductroutes from '../interfaces/Products/newproductroutes';
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Fournisseurs') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Ajouter Un Produit') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Commande') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Alerte') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { display: 'flex' },
      })}
      initialRouteName="Fournisseurs"
    >
      <Tab.Screen name="Fournisseurs" component={VosFournisseurs} />
      <Tab.Screen name="Ajouter Un Produit" component={Newproductroutes} />
      <Tab.Screen name="Commande" component={FourCommandeRoutes} />
      <Tab.Screen name="Alerte" component={Message} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
