import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TextField from '../../components/TextField';
import {useTheme} from '../../providers/StyleProvider';

export default function Login() {
  const {colors} = useTheme();
  return (
    <View>
      <Text>Toggle</Text>
      <TextField />
    </View>
  );
}

const styles = StyleSheet.create({});
