import 'react-native-gesture-handler';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Message from '../interfaces/Message/Message';
import RecepChain from '../interfaces/Commandes/RecepChain';
import Newproductroutes from '../interfaces/Products/newproductroutes';
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
                    } else if (route.name === 'Add a Category') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'Alert') {
                        iconName = focused ? 'chatbox' : 'chatbox-outline';
                    } else if (route.name === 'Suppliers') {
                        iconName = focused ? 'people' : 'people-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={Newproductroutes} />
            <Tab.Screen name="Add a Category" component={Thirdproductsroutes} />
            <Tab.Screen name="Alert" component={Message} />
            <Tab.Screen name="Suppliers" component={RecepChain} />
        </Tab.Navigator>
    );
}

export default AppNavigator;