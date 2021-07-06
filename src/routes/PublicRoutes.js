import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import {useTheme} from '../providers/StyleProvider';
import Icon from 'react-native-vector-icons/Ionicons';

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
      <Stack.Screen
        name="Register"
        component={Register}
        options={Object.assign(routeOption('Register'), {
          headerLeft: () => (
            <Icon
              name="arrow-back"
              color="white"
              size={30}
              style={{marginLeft: 10, marginRight: -30}}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
