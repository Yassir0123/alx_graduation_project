import React from 'react';
import Router from './Routes/Router'; 
import Test from './test';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './Roles/Achat/AppNavigation';



const Main = () => {
  return (
    <>
    {/* <AppNavigator/> */}
<Router/>
      {/* <Test /> */}
    </>
  );
};

export default Main;
