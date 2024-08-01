import 'react-native-gesture-handler';
import * as React from 'react';
import {Button, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import Message from '../interfaces/Message/Message';
import Atraiter from '../interfaces/Commandes/Commandetraiter';
import BDLRouter from '../interfaces/BonDeLivraison/BDLRouter';
import Productsroutes from '../interfaces/Products/productsroutes';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
    return (
        <>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={Atraiter}/>
                <Drawer.Screen name="Stock" component={Productsroutes}/>
                <Drawer.Screen name="Message" component={Message}/>
                <Drawer.Screen name="Bon De Livraison" component={BDLRouter}/>
            </Drawer.Navigator>
        </>
    );
}
export default AppNavigator