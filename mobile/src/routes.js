import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './screens/Login';
import Main from './screens/Main';

export default createAppContainer(
  createSwitchNavigator({
    Login,
    Main
  })
);
