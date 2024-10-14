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
                        case 'Payments':
                            iconName = 'cash'; // Change this based on your preferred icon
                            break;
                        case 'Delivery Slips to process':
                            iconName = 'document-text'; // Change this based on your preferred icon
                            break;
                        case 'Alert':
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
            <Tab.Screen name="Payments" component={Payrout} />
            <Tab.Screen name="Delivery Slips to process" component={Atraiter} />
            <Tab.Screen name="Alert" component={Message} />
        </Tab.Navigator>
    );
}

export default AppNavigator;
