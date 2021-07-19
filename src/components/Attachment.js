import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useTheme} from '../providers/StyleProvider';

export default function Attachment({
  icon,
  label,
  cb,
  lightColor,
  darkColor,
  toggleAttachmentsFolder,
}) {
  const {colors, rootStyles} = useTheme();
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => {
        cb();
        toggleAttachmentsFolder();
      }}>
      <View style={styles.container}>
        <View style={styles.halfCircle(darkColor)} />
        <View style={styles.halfCircle(lightColor)} />
        <Entypo
          name={icon}
          size={22}
          color={colors.WHITE}
          style={styles.icon}
        />
      </View>
      <Text style={[rootStyles.font(colors)]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  halfCircle: backgroundColor => ({
    backgroundColor,
    height: 25,
    width: 50,
  }),
  container: {borderRadius: 100, overflow: 'hidden', width: 50},
  btn: {
    margin: 10,
  },
  icon: {position: 'absolute', left: '27%', top: '25%'},
});
