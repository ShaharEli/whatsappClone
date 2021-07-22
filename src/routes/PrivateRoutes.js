import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Settings from '../screens/Settings/Settings';
import Camera from '../screens/Camera/Camera';
import Stories from '../screens/Stories/Stories';
import Calls from '../screens/Calls/Calls';
import {useTheme} from '../providers/StyleProvider';
import Broadcast from '../screens/Broadcast/Broadcast';
import FavoriteMsgs from '../screens/FavoriteMsgs/FavoriteMsgs';
import Contacts from '../screens/Contacts/Contacts';
import {useContacts} from '../hooks';
import Chat from '../screens/Chat/Chat';
import Chats from '../screens/Chats/Chats';
import ProfileView from '../screens/ProfileView/ProfileView';
import GroupMetaData from '../screens/GroupMetaData/GroupMetaData';
import {useAuth} from '../providers/AuthProvider';
import styles from './styles';
import {
  cameraScreenHeader,
  chatHeader,
  contactsHeader,
  groupMetaDataHeader,
  newGroupHeader,
  newProfileHeader,
  noHeader,
  tabBarOptions,
} from './headers';
import Location from '../screens/Location/Location';
import EditGroup from '../screens/EditGroup/EditGroup';
import Media from '../screens/Media/Media';
import ParticipantsController from '../components/ParticipantsController';
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function TabNavigator({route}) {
  const {colors} = useTheme();
  const searching = route?.params?.searching;
  const preventDefault = route?.params?.preventDefault;
  return (
    <Tab.Navigator
      initialRouteName="Chats"
      style={{backgroundColor: colors.HEADER}}
      tabBarOptions={styles.tabBarStyle(colors)}>
      <Tab.Screen
        name="Camera"
        component={Camera}
        options={cameraScreenHeader(colors)}
      />
      <Tab.Screen
        name="Chats"
        options={() => ({
          title: 'Chats',
        })}>
        {({navigation, route}) => {
          return <Chats {...{searching, preventDefault, navigation, route}} />;
        }}
      </Tab.Screen>
      <Tab.Screen name="Status" component={Stories} />
      <Tab.Screen name="Calls" component={Calls} />
    </Tab.Navigator>
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
        options={({navigation, route}) =>
          tabBarOptions({navigation, route}, colors, rootStyles)
        }
      />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen
        name="GroupMetaData"
        component={GroupMetaData}
        options={({navigation}) =>
          groupMetaDataHeader({navigation}, colors, rootStyles)
        }
      />
      <Stack.Screen
        name="NewGroup"
        options={({navigation, route}) =>
          newGroupHeader({navigation, route}, rootStyles, colors)
        }>
        {({navigation, route}) => {
          return (
            <ParticipantsController {...{newGroup: true, navigation, route}} />
          );
        }}
      </Stack.Screen>
      <Stack.Screen name="Media" component={Media} />
      <Stack.Screen name="Broadcast" component={Broadcast} />
      <Stack.Screen name="FavoriteMsgs" component={FavoriteMsgs} />
      <Stack.Screen
        name="ProfileView"
        component={ProfileView}
        options={() => ({...noHeader, unmountOnBlur: true})}
      />
      <Stack.Screen name="Location" component={Location} />
      <Stack.Screen name="EditGroup" component={EditGroup} />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({navigation, route}) =>
          chatHeader(
            {navigation, route},
            user,
            colors,
            refetchContacts,
            rootStyles,
          )
        }
      />
      <Stack.Screen
        name="Contacts"
        component={Contacts}
        options={({navigation, route}) =>
          contactsHeader(
            {navigation, route},
            colors,
            refetchContacts,
            rootStyles,
          )
        }
      />
    </Stack.Navigator>
  );
}
