import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';



import VosFournisseurs from './Fournisseurs';
import VosCommandes from './VosFournisseur';
import Ajout_Fournisseur from './Achat_Fournisseur';
import Fournisseur3 from './fournisseur3';
import NewFournisseur from './NewFournisseur';
import FournisseursInfos from './FournisseurInfos';
import ScheduleDelivery from './fr2';
import PlaceCommand from './fr3';
import OrderDelivered from './fr4';


const Stack = createStackNavigator();

const  FourCommandeRoutes = () => {
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
        name="Ajout_Fournisseur"
        component={Ajout_Fournisseur}
        options={{ headerShown: false }}
      />
       
      <Stack.Screen
        name="Vos_Fournisseurs"
        component={VosFournisseurs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Fournisseur_existant"
        component={Fournisseur3}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chercher_Fournisseur_existant"
        component={NewFournisseur}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Commande_Fournisseur"
        component={FournisseursInfos}
        options={{ headerShown: false }}
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
      </Stack.Navigator>
     
    </>
  );
};

export default  FourCommandeRoutes;