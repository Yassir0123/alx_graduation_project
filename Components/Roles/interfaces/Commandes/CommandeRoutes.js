import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import NewClient from './NewClient';
import Vendeur_Client from './Vendeur_Client';
import Client3 from './Client3';
import Client1 from './Client1';
import Client2 from './Client2';
import VosCommandes from './VosCommandes';
import ScheduleDelivery from './cmd2';
import OrderDelivered from './cmd4';
import PlaceCommand from './cmd3';
import Commande from './cmd1';
const Stack = createStackNavigator();

const  CommandeRoute = () => {
  return (
    <>
      <Stack.Navigator initialRouteName='Commandes'>
        <Stack.Screen
          name="Commandes"
          component={VosCommandes}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Client"
          component={NewClient}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Nouveau_Client"
          component={Vendeur_Client}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Chercher_Client_existant"
          component={Client3}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Ajouter_un_Produits"
          component={Client1}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Ajouter_un_Produits2"
          component={Client2}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="PlaceCommand"
          component={PlaceCommand}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ScheduleDelivery"
          component={ScheduleDelivery}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderDelivered"
          component={OrderDelivered}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Commande"
          component={Commande}
          options={{ headerShown: false }}
        />
      
      </Stack.Navigator>
    </>
  );
};

export default  CommandeRoute;
