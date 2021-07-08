import React from 'react';
import AuthProvider from './src/providers/AuthProvider';
import StyleProvider from './src/providers/StyleProvider';
import 'react-native-gesture-handler';
import Routes from './src/routes';
import './src/styles/loadFonts.js';
import {LogBox} from 'react-native';
LogBox.ignoreLogs([
  'Require cycle: node_modules/react-native/Libraries/Network/fetch.js',
  'If you want to use Reanimated 2 ',
]);

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
