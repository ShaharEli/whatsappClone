import React from 'react';
import {View, Text} from 'react-native';
import {useAuth} from '../providers/AuthProvider';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Chats from '../screens/Chats/Chats';
import Settings from '../screens/Settings/Settings';
import Camera from '../screens/Camera/Camera';
import Stories from '../screens/Stories/Stories';
import Calls from '../screens/Calls/Calls';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../providers/StyleProvider';
import {isIphoneWithNotch} from '../utils';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function TabNavigator() {
  const {user} = useAuth();
  const {colors} = useTheme();
  return (
    <>
      <Tab.Navigator
        initialRouteName="Chats"
        style={{backgroundColor: colors.HEADER}}
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
        <Tab.Screen name="Status" component={Stories} />
        <Tab.Screen name="Calls" component={Calls} />
      </Tab.Navigator>
    </>
  );
}

export default function PrivateRoutes() {
  const {colors, rootStyles} = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tab"
        component={TabNavigator}
        options={({navigation, route}) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: colors.HEADER,
            height: isIphoneWithNotch() ? 90 : 50,
            shadowRadius: 0,
            shadowOpacity: 0,
            shadowOffset: {
              height: 0,
              width: 0,
            },
          },
          headerLeft: () => (
            <View style={rootStyles.flexRow}>
              <Entypo
                name="dots-three-vertical"
                color={colors.INACTIVE_TINT}
                size={20}
                style={rootStyles.mx4}
              />
              <Ionicons name="search" color={colors.INACTIVE_TINT} size={20} />
            </View>
          ),
          headerRight: () => (
            <Text
              style={{
                color: colors.INACTIVE_TINT,
                fontSize: 20,
                fontWeight: 'bold',
                ...rootStyles.me2,
              }}>
              WhatsappClone
            </Text>
          ),
        })}
      />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
