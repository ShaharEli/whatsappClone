import React, {useEffect} from 'react';
import AuthProvider from './src/providers/AuthProvider';
import StyleProvider from './src/providers/StyleProvider';
import 'react-native-gesture-handler';
import Routes from './src/routes';
import './src/styles/loadFonts.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  useEffect(() => {
    console.log(AsyncStorage.getAllKeys());
  });
  return (
    <StyleProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </StyleProvider>
  );
};

export default App;
