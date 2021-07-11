import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {useTheme} from '../providers/StyleProvider';
import {MAX_WIDTH} from '../utils';
import RecordBubble from './RecordBubble';
import Entypo from 'react-native-vector-icons/Entypo';
export default function ChatInput({onChangeText, value, onSubmit}) {
  const {rootStyles, colors} = useTheme();
  return (
    <View
      style={[
        rootStyles.flexRow,
        rootStyles.alignCenter,
        rootStyles.px2,
        rootStyles.mt3,
      ]}>
      <RecordBubble onSubmit={onSubmit} isSendAvailable={!!value} />
      <View style={[rootStyles.ms2, rootStyles.mb3, styles.container(colors)]}>
        <Entypo
          name="attachment"
          color={colors.SECONDARY_FONT}
          size={25}
          style={styles.flexEnd}
        />
        <TextInput
          maxHeight={150}
          minHeight={50}
          value={value}
          onChangeText={onChangeText}
          textAlignVertical="bottom"
          placeholder="Type message"
          style={styles.input(colors)}
          multiline
          placeholderTextColor={colors.SECONDARY_FONT}
        />
        <Entypo
          name="emoji-happy"
          color={colors.SECONDARY_FONT}
          size={25}
          style={styles.flexStart}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: colors => ({
    backgroundColor: colors.HEADER,
    width: MAX_WIDTH - 70,
    borderRadius: 30,
    padding: 3,
  }),
  flexEnd: {
    position: 'absolute',
    left: 10,
    bottom: 13,
  },
  flexStart: {
    position: 'absolute',
    right: 10,
    bottom: 13,
  },
  input: colors => ({
    width: '70%',
    lineHeight: 27,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    color: colors.font,
  }),
});
