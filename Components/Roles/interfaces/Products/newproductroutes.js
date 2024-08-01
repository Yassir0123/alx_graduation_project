import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductDetail from './ProductDetail';
import AddProducts from './AddProducts';

const Stack = createStackNavigator();

const Newproductroutes = () => {
  return (
    <Stack.Navigator initialRouteName='gotoaddproduct'> 
      <Stack.Screen
        name="gotoaddproduct"
        component={AddProducts}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="gotodetails"
        component={ProductDetail}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

export default Newproductroutes;
