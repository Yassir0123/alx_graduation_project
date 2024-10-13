import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BDL1 from './BDL1';
import BDL2 from './BDL2';
import BDL3 from './BDL3';


const Stack =createStackNavigator()

const BDLRouter =()=>{
    return (
        <Stack.Navigator initialRouteName='BDL1'>
            <Stack.Screen
            name='BDL1'
            component ={BDL1}
            options={{
                headerShown:false
            }}
            />
              <Stack.Screen
            name='BDL2'
            component ={BDL2}
            options={{
                headerShown:false
            }}
            />
              <Stack.Screen
            name='BDL3'
            component ={BDL3}
            options={{
                headerShown:false
            }}
            />
            
        </Stack.Navigator>
    )
}
export default BDLRouter