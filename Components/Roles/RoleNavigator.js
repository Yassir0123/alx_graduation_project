import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Commercial from './Commercial/AppNavigation'; 
const Stack = createStackNavigator();

const componentMapping = {
    'commerciale.com': Commercial
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
