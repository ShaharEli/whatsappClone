import React from 'react';
import {StyleSheet, Text, TouchableOpacity, Animated} from 'react-native';
import {useTheme} from '../providers/StyleProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function ScrollToBottomBubble({yProgress, scrollToEnd}) {
  const {colors, rootStyles} = useTheme();

  const prog = yProgress.interpolate({
    inputRange: [0, 130, 150],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <AnimatedTouchableOpacity
      onPress={scrollToEnd}
      activeOpacity={0.6}
      style={[
        styles.container(colors, rootStyles),
        {transform: [{scale: prog}], opacity: prog},
      ]}>
      <FontAwesome
        name="angle-double-down"
        size={25}
        color={colors.GREY_LIGHT}
      />
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: (colors, rootStyles) => ({
    position: 'absolute',
    bottom: 150, //TODO:move to consts
    left: 10,
    zIndex: 1000,
    width: 30,
    height: 30,
    ...rootStyles.box,
    borderRadius: 30,
    backgroundColor: colors.HEADER,
  }),
});
