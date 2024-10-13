import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FournisseursInfos from './FournisseurInfos.js';
import FournisseurCommande from './FournisseurCommande.js';

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