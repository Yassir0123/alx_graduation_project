import 'react-native-gesture-handler';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import BDLVALIDER from '../interfaces/BonDeLivraison/BDLVALIDER';
import PayementEffectuer from '../interfaces/Payement/Payement';
import Message from '../interfaces/Message/Message';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
    return (
        <>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Bon de livraison valider" component={BDLVALIDER}/>
                <Drawer.Screen name="Payement effectuer" component={PayementEffectuer}/>
                <Drawer.Screen name="Message" component={Message}/>
  
            </Drawer.Navigator>
        </>
    );
}
export default AppNavigator