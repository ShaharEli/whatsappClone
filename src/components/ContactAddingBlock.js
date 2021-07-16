import React, {useEffect, useRef} from 'react';
import {Image, StyleSheet, View, Pressable, Animated, Text} from 'react-native';
import {useTheme} from '../providers/StyleProvider';
import Feather from 'react-native-vector-icons/Feather';
const ANIMATION_DUR = 500;
const animationSettings = animationIn => ({
  toValue: animationIn ? 1 : 0,
  duration: ANIMATION_DUR,
  useNativeDriver: true,
});

export default function ContactAddingBlock({
  setSelectedContacts,
  avatar,
  _id,
  firstName,
}) {
  const {colors, rootStyles} = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, animationSettings(true)).start();
    Animated.timing(scale, animationSettings(true)).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onRemove = () => {
    Animated.timing(opacity, animationSettings(false)).start();
    Animated.timing(scale, animationSettings(false)).start();
    setTimeout(
      () => setSelectedContacts(prev => prev.filter(c => c._id !== _id)),
      ANIMATION_DUR,
    );
  };
  return (
    <Pressable onPress={onRemove}>
      <Animated.View style={{opacity, transform: [{scale}], ...rootStyles.ms4}}>
        <Image source={avatar} style={[rootStyles.avatar, rootStyles.ms1]} />
        <Animated.View
          style={[styles.icon(colors), {opacity, transform: [{scale}]}]}>
          <Feather name="x" size={20} colors={colors.BG} />
        </Animated.View>
        <Text
          style={{color: colors.SECONDARY_FONT, ...rootStyles.alignSelfCenter}}>
          {firstName}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: colors => ({
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: colors.GREY,
    width: 25,
    height: 25,
    bottom: 13,
    borderRadius: 25,
    borderColor: colors.BG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    left: -8,
  }),
});
