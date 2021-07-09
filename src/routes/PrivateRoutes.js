import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAuth} from '../providers/AuthProvider';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Settings from '../screens/Settings/Settings';
import Camera from '../screens/Camera/Camera';
import Stories from '../screens/Stories/Stories';
import Calls from '../screens/Calls/Calls';
import Entypo from 'react-native-vector-icons/Entypo';
import {useTheme} from '../providers/StyleProvider';
import {CHAT_OPTIONS, CONTACTS_OPTIONS, isIphoneWithNotch} from '../utils';
import ChatsStack from './ChatsStack';
import SettingsMenu from '../components/SettingsMenu';
import NewGroup from '../screens/NewGroup/NewGroup';
import Broadcast from '../screens/Broadcast/Broadcast';
import FavoriteMsgs from '../screens/FavoriteMsgs/FavoriteMsgs';
import Contacts from '../screens/Contacts/Contacts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
const baseHeader = colors => ({
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
    shadowColor: 'transparent',
  },
});

function TabNavigator() {
  const {user} = useAuth();
  const {colors} = useTheme();
  return (
    <>
      <Tab.Navigator
        initialRouteName="ChatsStack"
        style={{backgroundColor: colors.HEADER}}
        tabBarOptions={tabBarStyle(colors)}>
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
        <Tab.Screen
          name="ChatsStack"
          options={() => ({
            title: 'Chats',
          })}
          component={ChatsStack}
        />
        <Tab.Screen name="Status" component={Stories} />
        <Tab.Screen name="Calls" component={Calls} />
      </Tab.Navigator>
    </>
  );
}

export default function PrivateRoutes() {
  const {colors, rootStyles} = useTheme();
  const {user} = useAuth();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tab"
        component={TabNavigator}
        options={({navigation, route}) => ({
          ...baseHeader(colors),
          headerRight: () => (
            <SettingsMenu
              onSearch={() => navigation.setParams({searching: true})}
              options={CHAT_OPTIONS}
              navigation={navigation}
            />
          ),
          headerLeft: () => (
            <Text style={[rootStyles.mx3, styles.headerRight(colors)]}>
              WhatsappClone
            </Text>
          ),
        })}
      />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="NewGroup" component={NewGroup} />
      <Stack.Screen name="Broadcast" component={Broadcast} />
      <Stack.Screen name="FavoriteMsgs" component={FavoriteMsgs} />
      <Stack.Screen
        name="Contacts"
        component={Contacts}
        options={({navigation, route}) => ({
          ...baseHeader(colors),
          headerRight: () => (
            <SettingsMenu
              onSearch={() => navigation.setParams({searching: true})}
              navigation={navigation}
              options={CONTACTS_OPTIONS}
            />
          ),
          headerLeft: () => (
            <View style={[rootStyles.flexRow, rootStyles.alignCenter]}>
              <Ionicons
                name="arrow-back"
                color={colors.INACTIVE_TINT}
                size={30}
                onPress={() => navigation.goBack()}
                style={rootStyles.mx3}
              />
              <View>
                <Text style={[rootStyles.me2, styles.headerRight(colors)]}>
                  Choose contact
                </Text>
                <Text
                  onPress={() => navigation.goBack()}
                  style={[rootStyles.me2, styles.headerRightSmall(colors)]}>
                  {user.contacts.length} contacts
                </Text>
              </View>
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRight: colors => ({
    color: colors.INACTIVE_TINT,
    fontSize: 20,
    fontWeight: 'bold',
  }),
  headerRightSmall: colors => ({
    color: colors.INACTIVE_TINT,
  }),
});

const tabBarStyle = colors => ({
  showIcon: true,
  iconStyle: {marginBottom: -35},
  indicatorStyle: {backgroundColor: colors.INDICATOR, height: 3},
  activeTintColor: colors.INDICATOR,
  inactiveTintColor: colors.INACTIVE_TINT,
  labelStyle: {fontSize: 13},
  style: {
    backgroundColor: colors.HEADER,
  },
});
