import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Keyboard} from 'react-native';
import EmojiBoard from 'react-native-emoji-board';
import {useTheme} from '../providers/StyleProvider';
import Entypo from 'react-native-vector-icons/Entypo';

export default function EmojiKb({
  onChangeText,
  style = {},
  cbHook = {},
  kbStyle = {},
}) {
  const [shown, setShown] = useState(false);
  const {colors, rootStyles} = useTheme();
  cbHook.current = setShown;
  useEffect(() => {
    if (shown) Keyboard.dismiss();
  }, [shown]);
  return (
    <>
      <TouchableOpacity
        onPress={() => setShown(prev => !prev)}
        hitSlop={{x: 10, y: 10, z: 10}}
        style={style}>
        <Entypo name="emoji-happy" color={colors.SECONDARY_FONT} size={25} />
      </TouchableOpacity>
      <View>
        <EmojiBoard
          containerStyle={{
            ...rootStyles.width(0.8, -40),
            marginBottom: 50,
            ...kbStyle,
            ...(shown ? {} : {width: 0, height: 0, opacity: 0}),
          }}
          showBoard={shown}
          onClick={onChangeText}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
