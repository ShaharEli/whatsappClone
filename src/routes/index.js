import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {useAuth} from '../providers/AuthProvider';
import DataProvider from '../providers/DataProvider';
import {navigationRef} from '../utils';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';

export default function Routes() {
  const {isSigned} = useAuth();

  return (
    <NavigationContainer ref={navigationRef}>
      {isSigned ? (
        <DataProvider>
          <PrivateRoutes />
        </DataProvider>
      ) : (
        <PublicRoutes />
      )}
    </NavigationContainer>
  );
}
