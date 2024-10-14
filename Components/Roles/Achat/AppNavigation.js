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

          if (route.name === 'Suppliers') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Add a product') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Alert') {
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
      <Tab.Screen name="Suppliers" component={VosFournisseurs} />
      <Tab.Screen name="Add a product" component={Newproductroutes} />
      <Tab.Screen name="Orders" component={FourCommandeRoutes} />
      <Tab.Screen name="Alert" component={Message} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
