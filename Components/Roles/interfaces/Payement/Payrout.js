import 'react-native-gesture-handler';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';

import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Pay1 from './Pay1';
import Pay2 from './Pay2';
import Pay3 from './Pay3';
import Pay4 from './Pay4';
import Pay5 from './Pay5';
import Pay6 from './Pay6';
import Pay7 from './Pay7';
import OrderItemsScreen from './OrderItemsScreen';
const Stack = createStackNavigator();

const Payrout = () => {
  return (
    <Stack.Navigator initialRouteName="Pay1">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Pay1"
        component={Pay1}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Pay2"
        component={Pay2}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Pay3"
        component={Pay3}
      />
        <Stack.Screen
        name="Pay4"
        component={Pay4}
        options={{
          headerShown: false
        }}
      />
        <Stack.Screen
        name="Pay5"
        component={Pay5}
        options={{
          headerShown: false
        }}
      />
        <Stack.Screen
        name="Pay6"
        component={Pay6}
        options={{
          headerShown: false
        }}
      />
       <Stack.Screen
        name="Pay7"
        component={Pay7}
        options={{
          headerShown: false
        }}
      />
             <Stack.Screen
        name="OrderItemsScreen"
        component={OrderItemsScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

export default Payrout;
