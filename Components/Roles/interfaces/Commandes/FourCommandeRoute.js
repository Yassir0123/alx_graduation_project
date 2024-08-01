import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import NewClient from './NewClient';
import Vendeur_Client from './Vendeur_Client';
import Client3 from './Client3';
import Client1 from './Client1';
import Client2 from './Client2';

import VosFournisseurs from '../Vendeurs/Fournisseurs';
import VosCommandes from '../Vendeurs/VosFournisseur';
import Ajout_Fournisseur from '../Vendeurs/Achat_Fournisseur';
import Fournisseur3 from './fournisseur3';
import NewFournisseur from './NewFournisseur';
import FournisseursInfos from './FournisseurInfos';
import Ajout_Fournisseur2 from './Ajoout_Fournisseur2';
import FournisseurCommande from './FournisseurCommande';

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
   
      
      </Stack.Navigator>
    </>
  );
};

export default  FourCommandeRoutes;