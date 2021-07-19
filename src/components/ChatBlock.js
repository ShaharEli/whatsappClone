import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {useAuth} from '../providers/AuthProvider';
import {useTheme} from '../providers/StyleProvider';
import {
  dateToFromNowDaily,
  getChatDataFormatted,
  getType,
  MAX_WIDTH,
  pickRandomListValue,
} from '../utils';
import Entypo from 'react-native-vector-icons/Entypo';
import SeenIndicator from './SeenIndicator';
import {useNavigation} from '@react-navigation/core';

export default function ChatBlock({chat, preventDefault}) {
  const navigation = useNavigation();
  const {
    type,
    lastMessage,
    image,
    name,
    participants,
    usersTyping = [],
    unreadMessages,
    createdAt,
  } = chat;

  const {user} = useAuth();
  const {rootStyles, colors} = useTheme();
  const [currentlyType, setCurrentlyType] = useState({});

  const {chatImage, chatName, isActive, lastConnected} = getChatDataFormatted(
    {
      type,
      image,
      name,
      participants,
    },
    user._id,
  );

  useEffect(() => {
    const interval = setInterval(
      () => getType(setCurrentlyType, usersTyping),
      1000,
    );
    getType(setCurrentlyType, usersTyping);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersTyping.length]);

  const ChatSeen = useCallback(() => {
    return (
      <SeenIndicator
        participants={participants}
        isFromMe={(lastMessage?.by?._id || lastMessage?.by) === user._id}
        seenBy={lastMessage?.seenBy}
      />
    );
  }, [participants, lastMessage, user]);

  const renderContent = useCallback(() => {
    switch (lastMessage?.type) {
      case 'text':
        return (
          <View style={rootStyles.flexRow}>
            <Text numberOfLines={1} style={styles.secondaryText(colors)}>
              {type === 'group'
                ? lastMessage?.by?._id === user._id
                  ? 'You: '
                  : `${lastMessage?.by.firstName} ${lastMessage?.by.lastName}: `
                : null}
              {lastMessage.content}
            </Text>
            <ChatSeen />
          </View>
        );
      case 'image':
        if (lastMessage.content) {
          return (
            <View style={rootStyles.flexRow}>
              <Entypo name="images" size={30} color={colors.SECONDARY_FONT} />
              <Text numberOfLines={1} style={styles.secondaryText(colors)}>
                {lastMessage.content}
              </Text>
              <ChatSeen />
            </View>
          );
        } else {
          return (
            <View>
              <Entypo name="images" size={30} />
              <ChatSeen />
            </View>
          );
        }
      default:
        return (
          <View style={rootStyles.flexRow}>
            <Text numberOfLines={1} style={styles.secondaryText(colors)}>
              New group
            </Text>
            <ChatSeen />
          </View>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage, type]);

  const {firstName: typingFirstName = null, lastName: typingLastName = null} =
    currentlyType;

  return (
    <TouchableOpacity
      onPress={() => {
        preventDefault
          ? null
          : navigation.navigate('Chat', {
              chat,
              avatar: chatImage,
              name: chatName,
              type,
              isActive,
              lastConnected,
            });
      }}
      style={[
        rootStyles.flexRow,
        rootStyles.alignCenter,
        rootStyles.p3,
        rootStyles.spaceBetween,
      ]}>
      <View style={[rootStyles.flexRow, rootStyles.alignCenter]}>
        <Image style={[rootStyles.avatar, rootStyles.me3]} source={chatImage} />
        <View>
          <Text
            style={[
              rootStyles.font(colors),
              rootStyles.fontSize(20),
              rootStyles.strong,
              rootStyles.mb1,
            ]}>
            {chatName}
          </Text>
          {typingFirstName ? (
            <Text style={styles.typingText(colors)}>
              {type === 'private'
                ? 'typing...'
                : typingFirstName + ' ' + typingLastName + ' typing...'}
            </Text>
          ) : (
            renderContent()
          )}
        </View>
      </View>
      <View style={[rootStyles.alignSelfStart, rootStyles.mt3]}>
        <Text
          style={[
            rootStyles.font(colors),
            rootStyles.mb1,
            unreadMessages && styles.typingText(colors),
          ]}>
          {dateToFromNowDaily(lastMessage?.createdAt)}
        </Text>
        {unreadMessages ? (
          <Text
            style={[
              styles.unreadMessage(colors),
              styles.unreadMessageBg(colors, rootStyles),
            ]}>
            {unreadMessages}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  unreadMessage: colors => ({
    color: colors.HEADER,
  }),

  unreadMessageBg: (colors, rootStyles) => ({
    backgroundColor: colors.GREEN_PRIMARY,
    width: 20,
    height: 20,
    borderRadius: 20,
    textAlign: 'center',
    ...rootStyles.box,
    ...rootStyles.ms3,
  }),
  secondaryText: colors => ({
    color: colors.GREY_LIGHT,
    maxWidth: MAX_WIDTH - 150,
  }),
  typingText: colors => ({
    color: colors.GREEN_PRIMARY,
  }),
});
