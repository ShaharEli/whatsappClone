import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, View, Image, TextInput, Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Settings from '../screens/Settings/Settings';
import Camera from '../screens/Camera/Camera';
import Stories from '../screens/Stories/Stories';
import Calls from '../screens/Calls/Calls';
import Entypo from 'react-native-vector-icons/Entypo';
import PushManager from '../api/PushManager';
import {useTheme} from '../providers/StyleProvider';
import {
  CHAT_OPTIONS,
  CONTACTS_OPTIONS,
  getActiveRouteState,
  isIphoneWithNotch,
  calcLastConnected,
  MAX_WIDTH,
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
import GroupMetaData from '../screens/GroupMetaData/GroupMetaData';
import {StackActions} from '@react-navigation/routers';
import {useAuth} from '../providers/AuthProvider';
import {useNavigation} from '@react-navigation/core';
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
  gestureEnabled: false,
});
function TabNavigator({navigation, route}) {
  const {colors} = useTheme();
  useEffect(() => {
    if (Platform.OS === 'android') PushManager.addNavigation(navigation, route);
  }, [navigation, route]);
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
      <Stack.Screen
        name="GroupMetaData"
        component={GroupMetaData}
        options={({navigation}) => ({
          ...baseHeader(colors),
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
              <View>
                <Text style={[rootStyles.me2, styles.headerRight(colors)]}>
                  New Group
                </Text>
                <Text style={[rootStyles.me2, styles.headerRightSmall(colors)]}>
                  Add data
                </Text>
              </View>
            </View>
          ),
        })}
      />

      <Stack.Screen
        name="NewGroup"
        component={NewGroup}
        options={({navigation, route}) => {
          const contactsNum = route?.params?.contactsNum;
          const selectedContactsNum = route?.params?.selectedContactsNum;
          const searching = route?.params?.searching;

          return {
            ...baseHeader(colors),
            unmountOnBlur: true,
            headerRight: () =>
              searching ? (
                <Ionicons
                  name="arrow-forward"
                  color={colors.INACTIVE_TINT}
                  size={30}
                  onPress={() => navigation.setParams({searching: false})}
                  style={rootStyles.mx3}
                />
              ) : (
                <SettingsMenu
                  withSettings={false}
                  onSearch={() => navigation.setParams({searching: true})}
                  navigation={navigation}
                />
              ),
            headerLeft: () =>
              searching ? (
                <View
                  style={[
                    rootStyles.flex1,
                    rootStyles.px4,
                    {width: MAX_WIDTH - 50}, //TODO move to consts
                  ]}>
                  <TextInput
                    autoFocus={true}
                    style={[rootStyles.flex1, rootStyles.font(colors)]}
                    onChangeText={searchValue =>
                      navigation.setParams({searchValue})
                    }
                  />
                </View>
              ) : (
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
                      New Group
                    </Text>
                    <Text
                      onPress={() => navigation.goBack()}
                      style={[rootStyles.me2, styles.headerRightSmall(colors)]}>
                      {!contactsNum || !selectedContactsNum
                        ? 'Add participants'
                        : `${selectedContactsNum} ${
                            selectedContactsNum > 1 ? 'contacts' : 'contact'
                          } selected`}
                    </Text>
                  </View>
                </View>
              ),
          };
        }}
      />
      <Stack.Screen name="Broadcast" component={Broadcast} />
      <Stack.Screen name="FavoriteMsgs" component={FavoriteMsgs} />
      <Stack.Screen name="ProfileView" component={ProfileView} />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({navigation, route}) => {
          const {
            avatar,
            name,
            _id,
            lastConnected,
            isActive,
            fromGroup,
            userTyping,
            subHeader,
            usersTyping,
          } = route.params;
          const groupNames = subHeader
            ?.sort(({_id}) => (user._id === _id ? 1 : -1))
            .map(({firstName, lastName, _id}) =>
              _id === user._id ? 'You' : `${firstName} ${lastName}`,
            )
            .join(', ');

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
                  onPress={() =>
                    fromGroup
                      ? navigation.dispatch(StackActions.popToTop())
                      : navigation.goBack()
                  }
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
                  {(isActive || lastConnected || subHeader) && (
                    <Text style={styles.headerRightSmall(colors)}>
                      {subHeader
                        ? usersTyping
                          ? `${usersTyping.firstName} ${usersTyping.lastName} typing...`
                          : groupNames
                        : userTyping
                        ? 'typing...'
                        : isActive
                        ? 'online'
                        : calcLastConnected(lastConnected)}
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
