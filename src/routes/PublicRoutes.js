import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import {useTheme} from '../providers/StyleProvider';

const Stack = createStackNavigator();

export default function PublicRoutes() {
  const {colors} = useTheme();

  const routeOption = useCallback(
    title => ({
      title,
      headerStyle: {
        backgroundColor: colors.HEADER,
      },
      headerTitleAlign: 'left',
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }),
    [colors],
  );
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={routeOption('Sign in')}
      />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
