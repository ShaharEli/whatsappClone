import React from 'react';
import {View, Text, Image} from 'react-native';
import {useAuth} from '../providers/AuthProvider';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Chats from '../screens/Chats/Chats';
import Settings from '../screens/Settings/Settings';
import Camera from '../screens/Camera/Camera';
import Stories from '../screens/Stories/Stories';
import Calls from '../screens/Calls/Calls';
import Entypo from 'react-native-vector-icons/Entypo';
import {useTheme} from '../providers/StyleProvider';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

export default function PrivateRoutes() {
  const {user} = useAuth();
  const {colors, rootStyles} = useTheme();
  return (
    <>
      <Tab.Navigator
        initialRouteName="Chats"
        style={{marginTop: 100, backgroundColor: colors.HEADER}}
        tabBarOptions={{
          showIcon: true,
          iconStyle: {marginBottom: -35},
          indicatorStyle: {backgroundColor: colors.INDICATOR, height: 3},
          activeTintColor: colors.INDICATOR,
          inactiveTintColor: colors.INACTIVE_TINT,
          labelStyle: {fontSize: 13},
          style: {
            backgroundColor: colors.HEADER,
          },
        }}>
        <Tab.Screen
          name="Camera"
          component={Camera}
          options={({route, navigation}) => ({
            title: '',
            tabBarIcon: ({focused}) => (
              <Entypo
                name="camera"
                size={20}
                color={focused ? colors.INDICATOR : colors.INACTIVE_TINT}
              />
            ), //TODO find a way to make less wide
          })}
        />
        <Tab.Screen name="Chats" component={Chats} />
        <Tab.Screen name="Stories" component={Stories} />
        <Tab.Screen name="Calls" component={Calls} />
      </Tab.Navigator>
    </>
  );
}
