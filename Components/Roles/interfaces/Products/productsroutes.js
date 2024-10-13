import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Voscategories from './Voscategories';
import Voscategoriesgrand from './Voscategoriesgrand';
import VosProduits from './VosProduits';
import ProductDetail from './ProductDetail';
import AddProducts from './AddProducts';

const Stack = createStackNavigator();

const Productsroutes = () => {
  return (
    <Stack.Navigator initialRouteName='gotograndcategories'> 
      <Stack.Screen
        name="gotoproducts"
        component={VosProduits}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="gotocategories"
        component={Voscategories}
        options={{
          headerShown: false
        }}
      />
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
      <Stack.Screen
        name="gotograndcategories"
        component={Voscategoriesgrand}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

export default Productsroutes;
