import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useTheme} from '../providers/StyleProvider';

export default function MainBtn({style, onPress, children, textStyle}) {
  const {colors, rootStyles} = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        rootStyles.box,
        {backgroundColor: colors.GREEN_PRIMARY},
        rootStyles.alignSelfCenter,
        style,
      ]}>
      <Text
        style={[
          {color: colors.BG},
          rootStyles.p1,
          textStyle,
          rootStyles.fontSize16,
        ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
