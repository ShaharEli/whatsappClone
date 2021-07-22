import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Animated,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Modal,
} from 'react-native';
import ContactsHandler from 'react-native-contacts';

import {useTheme} from '../../providers/StyleProvider';
import {Divider, ScreenWrapper} from '../../styles/styleComponents';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  assets,
  checkIfChatExists,
  getChatDataFormatted,
  isIphoneWithNotch,
  MAX_WIDTH,
} from '../../utils';
import If from '../../components/If';
import Feather from 'react-native-vector-icons/Feather';
import {useAuth} from '../../providers/AuthProvider';
import {
  editChat,
  getParticipants,
  getProfile,
  getStarredMessages,
} from '../../api';
import {useData} from '../../providers/DataProvider';
import Contact from '../../components/Contact';
import {useContacts} from '../../hooks';
const AnimatedImage = Animated.createAnimatedComponent(Image);
const IMAGE_HEIGHT = MAX_WIDTH / 2;
//TODO add last active
export default function ProfileView({route, navigation}) {
  const {rootStyles, colors} = useTheme();
  const avatar = route?.params?.avatar;
  const name = route?.params?.name;
  const chatFromRoute = route?.params?.chat;
  const [chat, setChat] = useState(chatFromRoute ? chatFromRoute : null);
  const profileId = route?.params?.profileId || '60ebf5206d150e338a00e56d'; //TODO get existing chats or fetch user data (in case not in chats)
  const isGroup = chat?.type && chat?.type !== 'private';
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [starredCount, setStarredCount] = useState(null);
  const [loadingParticipants, setLoadingParticipants] = useState(isGroup);
  const [participants, setParticipants] = useState([]);
  const [activeParticipant, setActiveParticipant] = useState(null);
  const {setChats, chats} = useData();
  const [withNotifications, setWithNotifications] = useState(
    !chat?.usersWithoutNotifications?.includes(user._id),
  );
  const scrollY = useRef(new Animated.Value(0)).current;

  const {contacts, refetchContacts} = useContacts();

  useEffect(() => {
    if (!chat?._id) {
      if (!profileId) return;
      const existedChat = checkIfChatExists(chats, user, {_id: profileId});
      if (existedChat) {
        const {isActive, lastConnected, chatImage, chatName} =
          getChatDataFormatted(existedChat, user._id);
        navigation.setParams({
          avatar: chatImage,
          name: chatName,
        });
        setChat(existedChat);
      } else {
        (async () => {
          const profile = await getProfile(profileId);
          if (profile) {
            if (profile.avatar) {
              navigation.setParams({avatar: {uri: profile.avatar}});
            } else {
              navigation.setParams({avatar: assets.profilePlaceholder});
            }
            navigation.setParams({
              name: `${profile.firstName} ${profile.lastName}`,
            });
          }
        })();
      }
    } else {
      (async () => {
        const count = await getStarredMessages(chat._id);
        if (count === false) return;
        setStarredCount(count);
        if (chat?.type !== 'private') {
          const fetchedParticipants = await getParticipants(chat._id);
          fetchedParticipants && setParticipants(fetchedParticipants);
          setLoadingParticipants(false);
        }
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?._id]);

  const switchNotification = useCallback(
    async val => {
      if (loading) return;
      setLoading(true);
      const newChat = await editChat(chat?._id, {withNotifications: val});
      if (newChat) {
        setWithNotifications(val);
        setChats(prev => {
          return prev.map(c => {
            if (c._id === newChat?._id) {
              return {
                ...c,
                usersWithoutNotifications: newChat.usersWithoutNotifications,
              };
            }
            return c;
          });
        });
      }
      setLoading(false);
    },
    [loading, setChats, chat?._id],
  );

  const isAdmin = useMemo(() => {
    if (!chat || chat?.type !== 'group' || !chat?.name || !chat?.participants)
      return;
    return !!chat?.participants?.find(
      admin => admin?._id === user._id || admin === user._id,
    );
  }, [chat, user]);

  const isMainAdmin = useMemo(() => {
    if (!chat || chat?.type !== 'group' || !chat?.name || !chat?.participants)
      return;
    return !!chat?.mainAdmin === user._id;
  }, [chat, user]);

  // const translateY = scrollY.interpolate({inputRange: [], outputRange: []});

  const editGroup = target => {
    navigation.navigate('EditGroup', {chat, target});
  };

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 100, 180],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const nameContainerTop = scrollY.interpolate({
    inputRange: [0, 100, 180],
    outputRange: [
      isIphoneWithNotch() ? 200 : 140,
      isIphoneWithNotch() ? 100 : 90,
      isIphoneWithNotch() ? 40 : 0,
    ],
    extrapolate: 'clamp',
  });

  const nameTranslateX = scrollY.interpolate({
    inputRange: [0, 100, 180],
    outputRange: [30, 30, 60],
    extrapolate: 'clamp',
  });
  const headerColor = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: ['transparent', colors.HEADER],
    extrapolate: 'clamp',
  });
  // route.params?.fromContacts && route.params?._id
  const getActiveParticipantsOptions = useCallback(() => {
    if (!activeParticipant) return [];
    const arrOfOpts = [
      {
        label: `Send message to ${activeParticipant.firstName} ${activeParticipant.lastName}`,
        onPress: () => {
          navigation.navigate('Chat', {
            fromContacts: true,
            _id: activeParticipant._id,
          });
        },
      },
    ];
    if (contacts.findIndex(c => c._id === activeParticipant._id) === -1) {
      arrOfOpts.push({
        label: 'Add to contacts',
        onPress: async () => {
          const isAdded = await ContactsHandler.openContactForm({
            displayName: `${activeParticipant.firstName} ${activeParticipant.lastName}`,
            familyName: activeParticipant.lastName,
            givenName: activeParticipant.firstName,
            phoneNumbers: [{label: 'mobile', number: activeParticipant.phone}],
          });
          if (isAdded) {
            await refetchContacts();
          }
        },
      });
    }
    return arrOfOpts;
  }, [activeParticipant, isAdmin, contacts]);

  return (
    <ScreenWrapper>
      <Modal visible={!!activeParticipant}>
        <TouchableOpacity
          style={[rootStyles.flex1, rootStyles.bg(colors), rootStyles.box]}
          onPress={() => setActiveParticipant(null)}>
          <TouchableOpacity>
            {getActiveParticipantsOptions().map(({label, onPress}) => (
              <TouchableOpacity onPress={onPress} key={label}>
                <Text>{label}</Text>
              </TouchableOpacity>
            ))}
            <Text>jo</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <SafeAreaView style={rootStyles.flex1}>
        <Ionicons
          name="arrow-back"
          color={colors.INACTIVE_TINT}
          size={30}
          onPress={() => navigation.goBack()}
          style={styles.backArrow}
        />
        <Animated.View
          style={[
            styles.nameContainer,
            {
              top: nameContainerTop,
              backgroundColor: headerColor,
            },
          ]}>
          <Animated.Text
            style={[
              styles.name(rootStyles, colors),
              {transform: [{translateX: nameTranslateX}]},
            ]}>
            {name}
          </Animated.Text>
          {isGroup && (
            <Feather
              name="edit-2"
              size={20}
              color={colors.font}
              onPress={() => editGroup('name')}
            />
          )}
        </Animated.View>
        <Animated.ScrollView
          bounces={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: false},
          )}>
          <If
            cond={!!name}
            message="Error not found"
            onPress={() => navigation.goBack()}>
            <AnimatedImage
              source={avatar}
              style={[styles.image, {opacity: imageOpacity}]}
            />
            <If cond={isGroup}>
              <Divider m={10} />
              <TouchableOpacity
                style={styles.block(colors, rootStyles)}
                onPress={() => editGroup('description')}>
                {chat?.description ? (
                  <>
                    <Text style={styles.descColor(colors)}>Description</Text>
                    <Text style={rootStyles.font(colors)}>
                      {chat.description}
                    </Text>
                  </>
                ) : (
                  <Text style={rootStyles.font(colors)}>Add description</Text>
                )}
              </TouchableOpacity>
            </If>
            <Divider m={10} />
            <If cond={profileId !== user._id}>
              <View
                style={[
                  styles.block(colors),
                  rootStyles.flexRow,
                  rootStyles.alignCenter,
                  rootStyles.spaceBetween,
                  rootStyles.px4,
                ]}>
                <Text style={rootStyles.font(colors)}>
                  Silent notifications
                </Text>
                <Switch
                  value={withNotifications}
                  onValueChange={switchNotification}
                />
              </View>
              <Divider bg={colors.GREY} h={1} />
            </If>
            <TouchableHighlight
              underlayColor={colors.HIGHLIGHT}
              onPress={() => {
                navigation.navigate('Media', {chat});
              }}
              style={[
                styles.block(colors),
                rootStyles.px4,
                rootStyles.justifyCenter,
              ]}>
              <Text style={rootStyles.font(colors)}>Show media</Text>
            </TouchableHighlight>
            <Divider bg={colors.GREY} h={1} />
            <TouchableHighlight
              underlayColor={colors.HIGHLIGHT}
              onPress={() => {
                navigation.navigate('FavoriteMsgs', {chat});
              }}
              style={[
                styles.block(colors),
                rootStyles.px4,
                rootStyles.flexRow,
                rootStyles.alignCenter,
                rootStyles.spaceBetween,
              ]}>
              <>
                <Text style={rootStyles.font(colors)}>Starred messages</Text>
                {starredCount !== null && (
                  <Text style={[rootStyles.font(colors), rootStyles.me5]}>
                    {starredCount}
                  </Text>
                )}
              </>
            </TouchableHighlight>
            <If cond={isGroup}>
              <Divider bg={colors.GREY} h={1} />
              <FlatList
                style={rootStyles.backgroundColor(colors.LIGHT_BG)}
                bounces={false}
                ListEmptyComponent={
                  loadingParticipants ? <ActivityIndicator /> : null
                }
                data={participants}
                keyExtractor={p => p._id}
                renderItem={({item}) => (
                  <Contact
                    {...item}
                    bg={colors.LIGHT_BG}
                    isAdmin={chat?.admins?.includes(item._id)}
                    disabled={item._id === user._id}
                    onPress={() => setActiveParticipant(item)}
                  />
                )}
              />
            </If>
          </If>
        </Animated.ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
const BLOCK_HEIGHT = 50;
const styles = StyleSheet.create({
  backArrow: {
    marginLeft: 10,
    top: isIphoneWithNotch() ? 60 : 20,
    zIndex: 1010,
    position: 'absolute',
  },
  image: {
    width: IMAGE_HEIGHT * 2,
    height: IMAGE_HEIGHT,
    resizeMode: 'contain',
  },

  name: (rootStyles, colors) => ({
    ...rootStyles.font(colors),
    ...rootStyles.fontSize(20),
  }),
  nameContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    position: 'absolute',
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 20,
    zIndex: 1000,
  },
  block: colors => ({
    backgroundColor: colors.LIGHT_BG,
    padding: 10,
    height: BLOCK_HEIGHT,
    justifyContent: 'center',
  }),
  descColor: colors => ({
    color: colors.GREEN_PRIMARY,
  }),
});
