import 'react-native-gesture-handler';
import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Message from '../interfaces/Message/Message';
import Productsroutes from '../interfaces/Products/productsroutes';
import VosFournisseurs from '../interfaces/Vendeurs/Fournisseurs';
import Fournisseurs from '../interfaces/Vendeurs/VosFournisseur';
import AddProduct from '../interfaces/Products/AddProducts';
import FourCommandeRoutes from '../interfaces/Commandes/FourCommandeRoute';


const Drawer = createDrawerNavigator();

const AppNavigator = () => {
    return (
        <>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Fournisseurs" component={VosFournisseurs}/>
                <Drawer.Screen name="Ajouter Un Produit" component={AddProduct}/>
                <Drawer.Screen name="Commande" component={FourCommandeRoutes}/>
                <Drawer.Screen name="Message" component={Message}/>
            </Drawer.Navigator>
        </>
    );
}
export default AppNavigator