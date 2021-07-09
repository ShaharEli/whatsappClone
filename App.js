import React from 'react';
import AuthProvider from './src/providers/AuthProvider';
import StyleProvider from './src/providers/StyleProvider';
import 'react-native-gesture-handler';
import Routes from './src/routes';
import './src/styles/loadFonts.js';
import {LogBox} from 'react-native';
import {LOGS_TO_IGNORE} from './src/utils';

LogBox.ignoreLogs(LOGS_TO_IGNORE);

const App = () => {
  return (
    <AuthProvider>
      <StyleProvider>
        <Routes />
      </StyleProvider>
    </AuthProvider>
  );
};

export default App;
