import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Vendeur from './Vendeur/AppNavigation'; 
import Commercial from './Commercial/AppNavigation'; 
import Operateur from './operateur/AppNavigation'; 
import Comptable from './Comptable/AppNavigation'; 
import Receptionist from './Receptionist/AppNavigation';
import Livreur from './Livreur/AppNavigation';
import Achat from './Achat/AppNavigation';
const Stack = createStackNavigator();

const componentMapping = {
    'vendeur.com': Vendeur,
    'commerciale.com': Commercial, 
     'operateur.com':Operateur,
     'comptable.com':Comptable,
     'receptionist.com':Receptionist,
     'livreur.com':Livreur,
     'achat.com':Achat
};

const RoleNavigation = ({route}) => { 

  const userRole = route.params.userRole; 

  const ComponentToRender = componentMapping[userRole];

  if (!ComponentToRender) {
    console.error(`No component found for user role: ${userRole}`);
    return null; // or return an error component
  }
    return (
        <>
            <Stack.Navigator initialRouteName="Interface">
                {ComponentToRender && <Stack.Screen
                    options={{
                    headerShown: false
                }}
                    component={ComponentToRender}name="Interface"/>}
            </Stack.Navigator>
        </>
    );
};

export default RoleNavigation;
