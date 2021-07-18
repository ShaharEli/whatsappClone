import {TextField} from '@ubaids/react-native-material-textfield';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '../providers/StyleProvider';

export default function UnderlineTextField({
  containerStyle,
  onTextChange,
  placeholder,
  onFocus,
}) {
  const {rootStyles, colors} = useTheme();
  return (
    <TextField
      placeholder={placeholder}
      containerStyle={
        containerStyle || {
          ...rootStyles.width(0.7),
          ...rootStyles.maxWidth(300),
        }
      }
      onTextChange={onTextChange}
      placeholderTextColor={colors.GREY_LIGHT}
      baseColor={colors.INPUT_BASE}
      tintColor={colors.GREEN_PRIMARY}
      textColor={colors.font}
      onFocus={onFocus}
    />
  );
}

const styles = StyleSheet.create({});
