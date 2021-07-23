import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import {
  calcLastConnected,
  CHAT_OPTIONS,
  CONTACTS_OPTIONS,
  isIphoneWithNotch,
  MAX_WIDTH,
} from '../utils';
import SettingsMenu from '../components/SettingsMenu';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {StackActions} from '@react-navigation/routers';
import styles from './styles';

export const noHeader = {headerShown: false};

export const cameraScreenHeader = colors => ({
  title: '',
  tabBarIcon: ({focused}) => (
    <Entypo
      name="camera"
      size={20}
      color={focused ? colors.INDICATOR : colors.INACTIVE_TINT}
    />
  ), //TODO find a way to make less wide
});
export const baseHeader = colors => ({
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

export const tabBarOptions = ({navigation}, colors, rootStyles) => ({
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
});

export const groupMetaDataHeader = ({navigation}, colors, rootStyles) => ({
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
});

export const newGroupHeader = ({navigation, route}, rootStyles, colors) => {
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
            onChangeText={searchValue => navigation.setParams({searchValue})}
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
};

export const chatHeader = (
  {navigation, route},
  user,
  colors,
  refetchContacts,
  rootStyles,
) => {
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
    chat,
  } = route.params;
  const groupNames = () => {
    if (!subHeader || !Array.isArray(subHeader)) return '';
    const ourUserIndex = subHeader?.findIndex(p => p._id === user._id);
    const ourUserInChat = ourUserIndex !== -1;
    const deepClonedArr = [...subHeader];
    if (ourUserInChat) {
      deepClonedArr.splice(ourUserIndex, 1);
    }
    const arrOfNames = deepClonedArr.map(
      ({firstName, lastName}) => `${firstName} ${lastName}`,
    );
    if (ourUserInChat) {
      arrOfNames.push('You');
    }
    return arrOfNames.join(', ');
  };

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

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProfileView', {
              avatar,
              name,
              _id,
              chat,
              isActive,
              lastConnected,
              onGoBack: () => navigation.setParams({refreshChat: true}),
            })
          }
          style={rootStyles.ms4}>
          <Text style={[styles.headerRight(colors), styles.clickableTitle]}>
            {name}
          </Text>
          {(isActive || lastConnected || subHeader) && (
            <Text style={styles.headerRightSmall(colors)}>
              {subHeader
                ? usersTyping
                  ? `${usersTyping.firstName} ${usersTyping.lastName} typing...`
                  : groupNames()
                : userTyping
                ? 'typing...'
                : isActive
                ? 'online'
                : calcLastConnected(lastConnected)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    ),
  };
};

export const contactsHeader = (
  {navigation, route},
  colors,
  refetchContacts,
  rootStyles,
) => ({
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
});

export const editGroupHeader = ({navigation, route}, colors, rootStyles) => ({
  ...baseHeader(colors),
  headerLeft: () => (
    <View style={[rootStyles.flexRow, rootStyles.alignCenter]}>
      <Ionicons
        name="arrow-back"
        color={colors.INACTIVE_TINT}
        size={30}
        onPress={() => navigation.goBack()}
        style={rootStyles.mx3}
      />
      <Text style={[rootStyles.me2, styles.headerRight(colors)]}>
        Edit group {route.params.target}
      </Text>
    </View>
  ),
});
