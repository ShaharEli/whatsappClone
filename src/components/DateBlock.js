import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../providers/StyleProvider';
import {dateToFromNowToChat} from '../utils';

export default function DateBlock({value}) {
  const {colors, rootStyles} = useTheme();
  return (
    <View style={styles.container(colors, rootStyles)}>
      <Text style={styles.txt(colors)}>{dateToFromNowToChat(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: (colors, rootStyles) => ({
    ...rootStyles.alignSelfCenter,
    backgroundColor: colors.HEADER,
    padding: 4,
    marginTop: 5,
    marginBottom: 7,
    borderRadius: 8,
  }),
  txt: colors => ({
    color: colors.SECONDARY_FONT,
  }),
});
