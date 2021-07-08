import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {useAuth} from '../providers/AuthProvider';
import RealTimeDataProvider from '../providers/RealTimeDataProvider';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';

export default function Routes() {
  const {isSigned} = useAuth();

  return (
    <NavigationContainer>
      {isSigned ? (
        <RealTimeDataProvider>
          <PrivateRoutes />
        </RealTimeDataProvider>
      ) : (
        <PublicRoutes />
      )}
    </NavigationContainer>
  );
}
