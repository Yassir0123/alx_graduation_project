import React, { useState } from 'react';

import Main from './Components/Main.js';
import AppNavigator from './Components/Roles/Vendeur/AppNavigation.js';
import RoleNavigation from './Components/Roles/RoleNavigator.js';
import roles from './Components/Roles/interfaces/Products/AddProducts.js'
const App = () => {
  const [screen, setScreen] = useState(false);

 
  return (
    <>
       <Main  /> 
       {/* <AppNavigator/> */}
       
    </>
  );
};

export default App;
