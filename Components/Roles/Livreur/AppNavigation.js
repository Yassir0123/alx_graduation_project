import 'react-native-gesture-handler';
import * as React from 'react';
import Payrout from '../interfaces/Payement/Payrout';
import Atraiter from '../interfaces/Payement/BDLTRAITER';
import Message from '../interfaces/Message/Message';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Paiement"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Paiement':
                            iconName = 'cash'; // Change this based on your preferred icon
                            break;
                        case 'Bon de Livraison  a Traiter':
                            iconName = 'document-text'; // Change this based on your preferred icon
                            break;
                        case 'Message':
                            iconName = 'chatbubble'; // Change this based on your preferred icon
                            break;
                        default:
                            iconName = 'information-circle';
                            break;
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Paiement" component={Payrout} />
            <Tab.Screen name="Bon de Livraison a Traiter" component={Atraiter} />
            <Tab.Screen name="Message" component={Message} />
        </Tab.Navigator>
    );
}

export default AppNavigator;
