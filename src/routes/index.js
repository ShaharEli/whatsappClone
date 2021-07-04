import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {useAuth} from '../providers/AuthProvider';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';

export default function Routes() {
  const {isSigned} = useAuth();

  return (
    <NavigationContainer>
      {isSigned ? <PrivateRoutes /> : <PublicRoutes />}
    </NavigationContainer>
  );
}
