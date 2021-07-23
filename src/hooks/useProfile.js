import React, {useCallback, useEffect, useState} from 'react';
import ContactsHandler from 'react-native-contacts';
import {
  assets,
  checkIfChatExists,
  getChatDataFormatted,
  isAdmin,
  isIphoneWithNotch,
  isMainAdmin,
  updateChat,
} from '../utils';
import {useAuth} from '../providers/AuthProvider';
import {useTheme} from '../providers/StyleProvider';
import {getParticipants, getProfile, getStarredMessages} from '../api';
import {useData} from '../providers/DataProvider';
import {useContacts} from './useContacts';
import Snackbar from 'react-native-snackbar';
//TODO add last active
// TODO add sockets update

export const useProfile = (route, navigation, scrollY) => {
  const avatar = route?.params?.avatar;
  const name = route?.params?.name;
  const chatFromRoute = route?.params?.chat;
  const [chat, setChat] = useState(chatFromRoute ? chatFromRoute : null);
  const profileId = route?.params?.profileId; //TODO get existing chats or fetch user data (in case not in chats)
  const isGroup = chat?.type && chat?.type !== 'private';
  const [loading, setLoading] = useState(false);
  const {user} = useAuth();
  const [starredCount, setStarredCount] = useState(null);
  const [loadingParticipants, setLoadingParticipants] = useState(isGroup);
  const [participants, setParticipants] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [activeParticipant, setActiveParticipant] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const {setChats, chats} = useData();
  const [isAdding, setIsAdding] = useState(false);
  const {contacts, refetchContacts} = useContacts();
  const [withNotifications, setWithNotifications] = useState(
    !chat?.usersWithoutNotifications?.includes(user._id),
  );

  const {colors} = useTheme();

  useEffect(() => {
    if (profileId) {
      setChat(null);
      setSearchVal('');
      setIsSearching(false);
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
            navigation.setParams({
              avatar: profile?.avatar
                ? {uri: profile.avatar}
                : assets.profilePlaceholder,
            });
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
          if (fetchedParticipants) {
            setFilteredParticipants(fetchedParticipants);
            setParticipants(fetchedParticipants);
          }
          setLoadingParticipants(false);
        }
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?._id, profileId]);

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
  const handleAddParticipant = useCallback(
    async participants => {
      if (!participants?.length) {
        return Snackbar.show({
          duration: Snackbar.LENGTH_SHORT,
          text: 'Please choose at least one contact',
        });
      }
      setIsAdding(false);
      const success = await updateChat(
        chat,
        setChats,
        {
          addParticipants: participants.map(p => p._id),
        },
        'participants',
      );
      if (success) {
        setChat(prev => ({...prev, participants: success.participants}));
        setParticipants(success.participants);
        setFilteredParticipants(success.participants);
      }
    },
    [chat, setChats],
  );

  const switchNotification = useCallback(
    async val => {
      if (loading) return;
      setLoading(true);
      const success = await updateChat(
        chat,
        setChats,
        {
          addParticipants: participants.map(p => p._id),
        },
        'usersWithoutNotifications',
      );
      if (success) setWithNotifications(val);

      setLoading(false);
    },
    [loading, setChats, chat, participants],
  );

  const getActiveParticipantsOptions = useCallback(() => {
    if (!activeParticipant) return [];
    const arrOfOpts = [
      {
        label: `Send message to ${activeParticipant.firstName} ${activeParticipant.lastName}`,
        onPress: () => {
          setActiveParticipant(null);
          navigation.navigate('Chat', {
            fromContacts: true,
            _id: activeParticipant._id,
          });
          route?.params?.onGoBack?.();
        },
      },
      {
        label: `Show ${activeParticipant.firstName} ${activeParticipant.lastName}`,
        onPress: () => {
          setActiveParticipant(null);
          navigation.navigate('ProfileView', {
            profileId: activeParticipant._id,
            onGoBack: route?.params?.onGoBack,
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
          setActiveParticipant(null);
        },
      });
    }

    if (isMainAdmin(chat, user)) {
      if (isAdmin(chat, activeParticipant)) {
        arrOfOpts.push({
          label: `Make ${activeParticipant.firstName} ${activeParticipant.lastName} not admin`,
          onPress: async () => {
            const {_id} = activeParticipant;
            setActiveParticipant(null);
            const success = await updateChat(
              chat,
              setChats,
              {
                removeAdmin: activeParticipant._id,
              },
              'admins',
            );
            if (success) {
              setChat(prev => ({
                ...prev,
                admins: prev.admins.filter(a => a !== _id),
              }));
              setFilteredParticipants(success.participants);
              setParticipants(success.participants);
            }
          },
        });
      }
    }
    if (isAdmin(chat, user)) {
      if (!isAdmin(chat, activeParticipant)) {
        arrOfOpts.push({
          label: `Make ${activeParticipant.firstName} ${activeParticipant.lastName} admin`,
          onPress: async () => {
            const {_id} = activeParticipant;
            setActiveParticipant(null);
            const success = await updateChat(
              chat,
              setChats,
              {
                addAdmin: activeParticipant._id,
              },
              'admins',
            );
            if (success) {
              setChat(prev => ({...prev, admins: [...prev.admins, _id]}));
              setFilteredParticipants(success.participants);
              setParticipants(success.participants);
            }
          },
        });
      }
      if (!isMainAdmin(chat, activeParticipant)) {
        arrOfOpts.push({
          label: `Remove ${activeParticipant.firstName} ${activeParticipant.lastName}`,
          onPress: async () => {
            setActiveParticipant(null);
            const success = await updateChat(
              chat,
              setChats,
              {
                removeParticipant: activeParticipant._id,
              },
              'participants',
            );
            if (success) {
              setFilteredParticipants(success.participants);
              setParticipants(success.participants);
            }
          },
        });
      }
    }
    return arrOfOpts;
  }, [
    activeParticipant,
    user,
    contacts,
    chat,
    setChats,
    refetchContacts,
    navigation,
    route?.params,
  ]);

  return {
    animationsStyle: {
      imageOpacity,
      nameContainerTop,
      nameTranslateX,
      headerColor,
    },
    handleAddParticipant,
    editGroup,
    switchNotification,
    avatar,
    name,
    starredCount,
    loadingParticipants,
    isSearching,
    filteredParticipants,
    searchVal,
    isAdding,
    withNotifications,
    participants,
    setIsSearching,
    setFilteredParticipants,
    setActiveParticipant,
    chat,
    setIsAdding,
    activeParticipant,
    getActiveParticipantsOptions,
    isGroup,
    profileId,
  };
};
