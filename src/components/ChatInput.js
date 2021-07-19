import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../providers/StyleProvider';
import {attachments, MAX_WIDTH} from '../utils';
import RecordBubble from './RecordBubble';
import Entypo from 'react-native-vector-icons/Entypo';
import EmojiKb from './EmojiKb';
import Attachment from './Attachment';
const ANIMATION_DUR = 500;
const animationOpacitySettings = animationIn => ({
  toValue: animationIn ? 1 : 0,
  duration: ANIMATION_DUR,
  useNativeDriver: false,
});

const animationBottomSettings = animationIn => ({
  toValue: animationIn ? 70 : -400,
  duration: ANIMATION_DUR,
  useNativeDriver: false,
});

export default function ChatInput({
  onChangeText,
  value,
  onSubmit,
  disabled,
  msgType,
  setMsgType,
  setMedia,
  media,
  navigation,
}) {
  const {rootStyles, colors} = useTheme();
  const [attachmentsShown, setAttachmentsShown] = useState(false);
  const emojiKeyboardRef = useRef();
  const opacity = useRef(new Animated.Value(0)).current;
  const bottom = useRef(new Animated.Value(0)).current;
  const openAttachmentsFolder = () => {
    Keyboard.dismiss();
    setAttachmentsShown(prev => !prev);
  };
  useEffect(() => {
    if (attachmentsShown) {
      Animated.timing(opacity, animationOpacitySettings(true)).start();
      Animated.timing(bottom, animationBottomSettings(true)).start();
    } else {
      Animated.timing(opacity, animationOpacitySettings(false)).start();
      Animated.timing(bottom, animationBottomSettings(false)).start();
    }

    return () => {
      Animated.timing(opacity, animationOpacitySettings(false)).start();
      Animated.timing(bottom, animationBottomSettings(false)).start();
    };
  }, [attachmentsShown]);

  return (
    <View>
      <Animated.View
        style={[
          rootStyles.bg(colors),
          rootStyles.spaceAround,
          rootStyles.flexWrap,
          rootStyles.flexRow,
          rootStyles.width(0.98),
          rootStyles.alignSelfCenter,
          {
            position: 'absolute',
            zIndex: 100,
            bottom,
            opacity,
          },
        ]}>
        {attachments(navigation, setMedia, setMsgType).map(item => (
          <Attachment {...item} key={item.label} />
        ))}
      </Animated.View>
      <View
        style={[
          rootStyles.flexRow,
          rootStyles.alignCenter,
          rootStyles.px2,
          rootStyles.mt3,
        ]}>
        <RecordBubble
          onSubmit={onSubmit}
          isSendAvailable={!!value}
          disabled={disabled}
        />
        <View
          style={[rootStyles.ms2, rootStyles.mb3, styles.container(colors)]}>
          <Entypo
            name="attachment"
            color={colors.SECONDARY_FONT}
            size={25}
            style={styles.flexEnd}
            onPress={openAttachmentsFolder}
          />
          <TextInput
            maxHeight={150}
            minHeight={50}
            value={value}
            onFocus={() => emojiKeyboardRef?.current?.(false)}
            onChangeText={onChangeText}
            placeholder="Type message"
            style={styles.input(colors)}
            multiline
            placeholderTextColor={colors.SECONDARY_FONT}
          />
          <EmojiKb
            onChangeText={onChangeText}
            style={styles.flexStart}
            cbHook={emojiKeyboardRef}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: colors => ({
    backgroundColor: colors.HEADER,
    width: MAX_WIDTH - 70,
    borderRadius: 30,
    padding: 3,
  }),
  flexEnd: {
    position: 'absolute',
    left: 10,
    bottom: 13,
  },

  flexStart: {
    position: 'absolute',
    right: 10,
    bottom: 13,
  },
  input: colors => ({
    width: '70%',
    lineHeight: 27,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    color: colors.font,
  }),
});
