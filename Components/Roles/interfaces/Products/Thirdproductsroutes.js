import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Addgrandcategory from './Addgrandcategory';
import Addcategory from './Addcategory';

const Stack = createStackNavigator();

const Thirdproductroutes = () => {
  return (
    <Stack.Navigator initialRouteName='gotoaddgrand'> 
      <Stack.Screen
        name="gotoaddcategorie"
        component={Addcategory}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="gotoaddgrand"
        component={Addgrandcategory}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

export default Thirdproductroutes;
