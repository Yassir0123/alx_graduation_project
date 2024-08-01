import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Login/Login/Home';
import Login from '../Login/Login/Login';
import Message from '../Roles/interfaces/Message/Message';
import PSforgotten from '../Login/psForgotten/psForgotten';
import PSreset from '../Login/psForgotten/psReset';
import PSresetted from '../Login/psForgotten/psResetted';
import RoleNavigation from '../Roles/RoleNavigator';
import Commercial_Vendeur from '../Roles/interfaces/Vendeurs/BonDeCommande2';
import Ajout_Fournisseur from '../Roles/interfaces/Vendeurs/Achat_Fournisseur';
import VosFournisseurs from '../Roles/interfaces/Vendeurs/Fournisseurs';
import PSverify from '../Login/psForgotten/verifycode';
import NewFournisseur from '../Roles/interfaces/Commandes/NewFournisseur';
import Fournisseur3 from '../Roles/interfaces/Commandes/fournisseur3';
import FournisseurInfos from '../Roles/interfaces/Commandes/FournisseurInfos';
import Ajout_Fournisseur2 from '../Roles/interfaces/Commandes/Ajoout_Fournisseur2';



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
        name="Ajout_Fournisseur2"
        component={Ajout_Fournisseur2}
        options={{ headerShown: false }}
      />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Message"
          component={Message}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PSforgotten"
          component={PSforgotten}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PSreset"
          component={PSreset}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PSresetted"
          component={PSresetted}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="Psverify"
          component={PSverify}
          options={{ headerShown: false }}
        />
       < Stack.Screen
          name="Ajouter_un_Vendeur"
          component={Commercial_Vendeur}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="RoleNavigation"
          component={RoleNavigation}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
