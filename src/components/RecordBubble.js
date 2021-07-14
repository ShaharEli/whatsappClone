import React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';
import {CircleWrapper} from '../styles/styleComponents';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '../providers/StyleProvider';
export default function RecordBubble({isSendAvailable, onSubmit, disabled}) {
  const {colors} = useTheme();
  return (
    <Pressable
      style={styles.container}
      disabled={disabled}
      onPress={isSendAvailable ? onSubmit : () => {}}>
      <CircleWrapper>
        <FontAwesome
          name={isSendAvailable ? 'send' : 'microphone'}
          color={colors.SECONDARY_FONT}
          size={25}
        />
      </CircleWrapper>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {alignSelf: 'flex-end', marginBottom: 10},
});
