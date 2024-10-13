import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Login/Login/Home';
import Login from '../Login/Login/Login';
import RoleNavigation from '../Roles/RoleNavigator';
import Commercial_Vendeur from '../Roles/interfaces/Commandes/BonDeCommande2';
const Stack = createStackNavigator();

const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }} 
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoleNavigation"
          component={RoleNavigation}
          options={{ headerShown: false }}
        />
       < Stack.Screen
          name="Ajouter_un_Vendeur"
          component={Commercial_Vendeur}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
