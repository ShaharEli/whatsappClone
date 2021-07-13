import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Settings from '../screens/Settings/Settings';
import Camera from '../screens/Camera/Camera';
import Stories from '../screens/Stories/Stories';
import Calls from '../screens/Calls/Calls';
import Entypo from 'react-native-vector-icons/Entypo';
import {useTheme} from '../providers/StyleProvider';
import {
  CHAT_OPTIONS,
  CONTACTS_OPTIONS,
  getActiveRouteState,
  isIphoneWithNotch,
  calcLastConnected,
} from '../utils';
import SettingsMenu from '../components/SettingsMenu';
import NewGroup from '../screens/NewGroup/NewGroup';
import Broadcast from '../screens/Broadcast/Broadcast';
import FavoriteMsgs from '../screens/FavoriteMsgs/FavoriteMsgs';
import Contacts from '../screens/Contacts/Contacts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useContacts} from '../hooks';
import Chat from '../screens/Chat/Chat';
import Chats from '../screens/Chats/Chats';
import ProfileView from '../screens/ProfileView/ProfileView';
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
  const {colors} = useTheme();
  return (
    <>
      <Tab.Navigator
        initialRouteName="Chats"
        style={{backgroundColor: colors.HEADER}}
        tabBarOptions={styles.tabBarStyle(colors)}>
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
          name="Chats"
          options={({navigation}) => {
            const name = getActiveRouteState(
              navigation.dangerouslyGetState(),
            ).name;
            return {
              title: 'Chats',
            };
          }}
          component={Chats}
        />
        <Tab.Screen name="Status" component={Stories} />
        <Tab.Screen name="Calls" component={Calls} />
      </Tab.Navigator>
    </>
  );
}

export default function PrivateRoutes() {
  const {colors, rootStyles} = useTheme();
  const {refetchContacts} = useContacts();
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
      <Stack.Screen name="ProfileView" component={ProfileView} />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({navigation, route}) => {
          const {avatar, name, _id, lastConnected, isActive} = route.params;
          return {
            ...baseHeader(colors),
            headerRight: () => (
              <SettingsMenu
                noSearch
                navigation={navigation}
                options={CONTACTS_OPTIONS(refetchContacts)} //EDIT OPTIONS
              />
            ),
            unmountOnBlur: true,
            headerLeft: () => (
              <View style={[rootStyles.flexRow, rootStyles.alignCenter]}>
                <Ionicons
                  name="arrow-back"
                  color={colors.INACTIVE_TINT}
                  size={30}
                  onPress={() => navigation.goBack()}
                  style={rootStyles.mx3}
                />
                <Image source={avatar} style={rootStyles.customAvatar(30)} />

                <View style={rootStyles.ms4}>
                  <Text
                    onPress={() =>
                      navigation.navigate('ProfileView', {
                        avatar,
                        name,
                        _id,
                      })
                    }
                    style={[styles.headerRight(colors), styles.clickableTitle]}>
                    {name}
                  </Text>
                  {(isActive || lastConnected) && (
                    <Text style={styles.headerRightSmall(colors)}>
                      {isActive ? 'online' : calcLastConnected(lastConnected)}
                    </Text>
                  )}
                </View>
              </View>
            ),
          };
        }}
      />
      <Stack.Screen
        name="Contacts"
        component={Contacts}
        options={({navigation, route}) => ({
          ...baseHeader(colors),
          headerRight: () => (
            <SettingsMenu
              onSearch={() => navigation.setParams({searching: true})}
              navigation={navigation}
              options={CONTACTS_OPTIONS(refetchContacts)}
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
                  {!route?.params?.contactsNum
                    ? ''
                    : `${route?.params?.contactsNum} contacts`}
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
  clickableTitle: {
    width: '140%',
  },
  tabBarStyle: colors => ({
    showIcon: true,
    iconStyle: {marginBottom: -35},
    indicatorStyle: {backgroundColor: colors.INDICATOR, height: 3},
    activeTintColor: colors.INDICATOR,
    inactiveTintColor: colors.INACTIVE_TINT,
    labelStyle: {fontSize: 13},
    style: {
      backgroundColor: colors.HEADER,
    },
  }),
});
