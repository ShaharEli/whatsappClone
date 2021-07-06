import React from 'react';
import {StyleSheet} from 'react-native';

import {OutlinedTextField} from '@ubaids/react-native-material-textfield';
import {useTheme} from '../providers/StyleProvider';

export default function TextField({
  label,
  keyboardType = null,
  onChangeText,
  error = null,
  ref,
}) {
  const {colors} = useTheme();
  return (
    <OutlinedTextField
      label={label}
      keyboardType={keyboardType}
      error={error}
      onChangeText={onChangeText}
      tintColor={colors.TEXT_INPUT_LABEL}
      baseColor={colors.INPUT_BASE}
      textColor={colors.font}
      errorColor={colors.RED}
      ref={ref}
    />
  );
}

const styles = StyleSheet.create({});
