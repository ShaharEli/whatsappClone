import React from 'react';
import AuthProvider from './src/providers/AuthProvider';
import StyleProvider from './src/providers/StyleProvider';
import 'react-native-gesture-handler';
import Routes from './src/routes';

const App = () => {
  return (
    <StyleProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </StyleProvider>
  );
};

export default App;
