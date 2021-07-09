import {TextField} from '@ubaids/react-native-material-textfield';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CircleWrapper} from '../styles/styleComponents';
import RecordBubble from './RecordBubble';

export default function ChatInput({onChangeText}) {
  return (
    <View style={{backgroundColor: 'red'}}>
      <RecordBubble />
      <TextField multiline />
    </View>
  );
}

const styles = StyleSheet.create({});
