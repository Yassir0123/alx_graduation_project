import React, { useState } from 'react';

import Main from './Components/Main.js';
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
