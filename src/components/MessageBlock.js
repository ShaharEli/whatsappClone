import moment from 'moment';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Animated,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native';
import {useAuth} from '../providers/AuthProvider';
import {useTheme} from '../providers/StyleProvider';
import SeenIndicator from './SeenIndicator';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from 'react-native-gesture-handler';
import {MAX_WIDTH} from '../utils';
import Entypo from 'react-native-vector-icons/Entypo';

function MessageBlock({
  content,
  by,
  lastMessageFrom,
  createdAt,
  seenBy,
  participants,
  chatType,
  participantsColors,
  media,
  type,
}) {
  const {user} = useAuth();
  const {colors, rootStyles} = useTheme();
  const isFromMe = useMemo(
    () => user._id === (by?._id ? by._id : by),
    [by, user],
  );
  const [arrowColor, setArrowColor] = useState(null);
  const [isForwording, setIsForwording] = useState(false);
  const messageCreator = useMemo(
    () =>
      chatType !== 'private'
        ? !by?._id || user._id === by._id
          ? 'You'
          : `${by.firstName} ${by.lastName}`
        : null,
    [by, user, chatType],
  );

  const swipeRef = useRef();

  const handleAnimationEnd = ({nativeEvent: {translationX}}) => {
    if (translationX > MAX_WIDTH / 2) {
      setIsForwording(true);
    }
    setTimeout(() => swipeRef?.current?.close(), translationX - 50); //TODO make better
  };

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton>
        <Animated.View
          style={[
            {
              transform: [{translateX: trans}],
            },
            styles.forword(colors, rootStyles),
          ]}>
          <Entypo
            name="forward"
            color={colors.WHITE}
            style={[
              {
                transform: [{rotateY: '180deg'}],
              },
            ]}
            size={30}
          />
        </Animated.View>
      </RectButton>
    );
  };
  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      ref={swipeRef}
      onEnded={e => handleAnimationEnd(e)}>
      <TouchableHighlight
        onPressIn={() => setArrowColor('black')}
        onPress={() => {}}
        onHideUnderlay={() => {
          setArrowColor(null);
        }}
        style={
          isFromMe
            ? styles.fromMeContainer({colors, rootStyles})
            : styles.notFromMeContainer({colors, rootStyles})
        }>
        <>
          {messageCreator && (
            <Text
              style={[
                rootStyles.textColor(participantsColors[by?._id || by]),
                styles.msgText,
              ]}>
              {messageCreator}
            </Text>
          )}
          {media && type === 'image' && (
            <Image source={{uri: media}} style={styles.img} />
          )}
          <View style={rootStyles.flexRow}>
            <Text style={[rootStyles.font(colors), styles.msgText]}>
              {content}
            </Text>
            <Text style={styles.time(colors)}>
              {moment(createdAt).format('HH:mm')}
            </Text>
            <SeenIndicator {...{participants, isFromMe, seenBy}} />
            {(!lastMessageFrom ||
              (lastMessageFrom?._id
                ? lastMessageFrom?._id
                : lastMessageFrom) !== (by?._id ? by._id : by)) && (
              <View style={styles.arrow(colors, isFromMe, arrowColor)} />
            )}
          </View>
        </>
      </TouchableHighlight>
    </Swipeable>
  );
}

export default React.memo(MessageBlock);

// TODO move to another file 👇

const styles = StyleSheet.create({
  forword: (colors, rootStyles) => ({
    backgroundColor: colors.BLACK_TRANSPARENT,
    ...rootStyles.customAvatar(39),
    ...rootStyles.box,
  }),
  baseContainer: rootStyles => ({
    ...rootStyles.p1,
    ...rootStyles.my1,
    // ...rootStyles.flexRow,
    maxWidth: '70%',
    borderRadius: 10,
  }),
  fromMeContainer: ({colors, rootStyles}) => ({
    backgroundColor: colors.GREEN_PRIMARY,
    ...styles.baseContainer(rootStyles),
    ...rootStyles.alignSelfStart,
    ...rootStyles.ms3,
  }),
  msgText: {
    maxWidth: '80%',
    zIndex: 10,
  },
  notFromMeContainer: ({colors, rootStyles}) => ({
    backgroundColor: colors.HEADER,
    ...styles.baseContainer(rootStyles),
    ...rootStyles.alignSelfEnd,
    ...rootStyles.me3,
  }),
  arrow: (colors, isFromMe, arrowColor) => ({
    position: 'absolute',
    zIndex: -10,
    top: -10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftWidth: 10,
    borderRightWidth: 20,
    borderTopWidth: 12,
    borderTopColor: arrowColor
      ? arrowColor
      : isFromMe
      ? colors.GREEN_PRIMARY
      : colors.HEADER,
    left: isFromMe ? -20 : null,
    right: !isFromMe ? -20 : null,
  }),
  time: colors => ({
    alignSelf: 'flex-end',
    marginLeft: 10,
    color: colors.GREY_LIGHT,
  }),
  img: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
});
