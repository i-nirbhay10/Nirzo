/**
 * Nirzo Ecommerce App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FB" />
      <AppNavigator />
    </>
  );
}

export default App;
