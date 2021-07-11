import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {useAuth} from '../providers/AuthProvider';
import {useTheme} from '../providers/StyleProvider';
import {
  dateToFromNowDaily,
  getNameAndImageFromChat,
  pickRandomListValue,
} from '../utils';
import Entypo from 'react-native-vector-icons/Entypo';

export default function ChatBlock({
  type,
  lastMessage,
  image,
  name,
  participants,
  usersTyping = [],
}) {
  const {user} = useAuth();
  const {rootStyles, colors} = useTheme();
  const [currentlyType, setCurrentlyType] = useState({});

  const {chatImage, chatName} = getNameAndImageFromChat(
    {
      type,
      image,
      name,
      participants,
    },
    user._id,
  );

  useEffect(() => {
    const interval = setInterval(getType, 1000);
    getType();
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersTyping.length]);

  const getType = () => {
    setCurrentlyType(prev => {
      if (usersTyping.length === 0) {
        return {};
      }
      if (usersTyping.length > 1) {
        return pickRandomListValue(
          usersTyping.filter(currUser => currUser._id !== prev._id),
        );
      } else {
        return usersTyping[0];
      }
    });
  };

  const renderContent = useCallback(() => {
    switch (lastMessage.type) {
      case 'text':
        return (
          <View>
            <Text style={styles.secondaryText(colors)}>
              {lastMessage.content}
            </Text>
          </View>
        );
      case 'image':
        if (lastMessage.content) {
          return (
            <View>
              <Entypo name="images" size={30} color={colors.SECONDARY_FONT} />
              <Text style={styles.secondaryText(colors)}>
                {lastMessage.content}
              </Text>
            </View>
          );
        } else {
          return (
            <View>
              <Entypo name="images" size={30} />
            </View>
          );
        }
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage, type]);

  const {firstName: typingFirstName = null, lastName: typingLastName = null} =
    currentlyType;

  return (
    <View
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
        <Text style={rootStyles.font(colors)}>
          {dateToFromNowDaily(lastMessage.createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  secondaryText: colors => ({
    color: colors.GREY_LIGHT,
  }),
  typingText: colors => ({
    color: colors.GREEN_PRIMARY,
  }),
});
