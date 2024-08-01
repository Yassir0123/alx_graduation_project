import 'react-native-gesture-handler';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Message from '../interfaces/Message/Message';
import VosProduits from '../interfaces/Products/VosProduits';
import VosClients from '../interfaces/Clients/VosClients';
import VosVendeurs from '../interfaces/Vendeurs/VosVendeurs';
import CommandeRoute from '../interfaces/Commandes/CommandeRoutes';
import { NavigationContainer } from '@react-navigation/native';
import Productsroutes from '../interfaces/Products/productsroutes';


const Drawer = createDrawerNavigator();

const AppNavigator = () => {
    return (
        <>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={VosClients}/>
                <Drawer.Screen name="Stock" component={Productsroutes}/>
                <Drawer.Screen name="Message" component={Message}/>
                <Drawer.Screen name="Commande" component={CommandeRoute}/>
                <Drawer.Screen name="Vos_Vendeur" component={VosVendeurs}/>
        
            </Drawer.Navigator>
        </>
    );
}
export default AppNavigator