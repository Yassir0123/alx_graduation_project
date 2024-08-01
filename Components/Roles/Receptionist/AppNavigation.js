import 'react-native-gesture-handler';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddProduct from '../interfaces/Products/AddProducts';
import Message from '../interfaces/Message/Message';
import AddCategory from '../interfaces/Products/Addcategory';
import FournisseurCommande from '../interfaces/Commandes/FournisseurCommande';
import RecepChain from '../interfaces/Commandes/RecepChain';
import { NavigationContainer } from '@react-navigation/native';
import Newproductroutes from '../interfaces/Products/newproductroutes';
import Addgrandcategory from '../interfaces/Products/Addgrandcategory';
import Thirdproductsroutes from '../interfaces/Products/Thirdproductsroutes';
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
 
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Ajouter une Categorie') {
                            iconName = focused ? 'add-circle' : 'add-circle-outline';
                        } else if (route.name === 'Message') {
                            iconName = focused ? 'chatbox' : 'chatbox-outline';
                        } else if (route.name === 'Fournisseurs') {
                            iconName = focused ? 'people' : 'people-outline';
                        }

                        // You can return any component that you like here!
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
                tabBarOptions={{
                    activeTintColor: 'blue',
                    inactiveTintColor: 'gray',
                }}
            >
                <Tab.Screen name="Home" component={Newproductroutes} />
                <Tab.Screen name="Ajouter une Categorie" component={Thirdproductsroutes} />
                <Tab.Screen name="Message" component={Message} />
                <Tab.Screen name="Fournisseurs" component={RecepChain} />
            </Tab.Navigator>
       
    );
}

export default AppNavigator;
