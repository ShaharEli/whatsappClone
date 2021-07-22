import {TextField} from '@ubaids/react-native-material-textfield';
import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '../providers/StyleProvider';

export default function UnderlineTextField({
  containerStyle,
  onChangeText,
  placeholder,
  onFocus,
  value,
  addedStyle = {},
  characterRestriction = undefined,
}) {
  const {rootStyles, colors} = useTheme();
  const inputRef = useRef('');
  useEffect(() => {
    if (value !== undefined) {
      inputRef?.current?.setValue(value);
    }
  }, [value, inputRef]);
  return (
    <TextField
      placeholder={placeholder}
      containerStyle={
        containerStyle || {
          ...rootStyles.width(0.7),
          ...rootStyles.maxWidth(300),
          ...addedStyle,
        }
      }
      characterRestriction={characterRestriction}
      ref={inputRef}
      onChangeText={onChangeText}
      placeholderTextColor={colors.GREY_LIGHT}
      baseColor={colors.INPUT_BASE}
      tintColor={colors.GREEN_PRIMARY}
      textColor={colors.font}
      onFocus={onFocus}
    />
  );
}

const styles = StyleSheet.create({});
