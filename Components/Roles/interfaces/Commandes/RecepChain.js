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

const  RecepChain = () => {
  return (
    <>
      <Stack.Navigator initialRouteName='Seecommande'>
   
      <Stack.Screen
        name="Seecommande"
        component={FournisseurCommande}
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

export default  RecepChain;