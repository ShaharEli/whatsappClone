import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useTheme} from '../providers/StyleProvider';
import {assets} from '../utils';

export default function Contact({
  navigation,
  icon = null,
  label = null,
  firstName,
  lastName,
  _id,
  avatar,
  status,
  onPress,
}) {
  const {colors, rootStyles} = useTheme();
  return (
    <TouchableOpacity
      onPress={() =>
        onPress ? onPress() : navigation.navigate('Chat', {id: _id})
      }
      style={[rootStyles.flexRow, rootStyles.p2, rootStyles.alignCenter]}>
      {icon ? (
        icon
      ) : (
        <Image
          style={rootStyles.avatar}
          source={avatar ? {uri: avatar} : assets.profilePlaceholder}
        />
      )}
      <View style={rootStyles.mx4}>
        <Text style={styles.name(colors)}>
          {label ? label : [firstName, lastName].join(' ')}
        </Text>
        {status ? <Text style={styles.status(colors)}>{status}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  name: colors => ({
    color: colors.font,
    fontSize: 16,
  }),
  status: colors => ({
    color: colors.SECONDARY_FONT,
    fontSize: 13,
    paddingTop: 2,
  }),
});
