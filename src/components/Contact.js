import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useTheme} from '../providers/StyleProvider';
import {assets} from '../utils';
import Feather from 'react-native-vector-icons/Feather';

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
  selected,
}) {
  const {colors, rootStyles} = useTheme();
  return (
    <TouchableOpacity
      onPress={() =>
        onPress
          ? onPress(!selected, {
              _id,
              firstName,
              avatar: avatar ? {uri: avatar} : assets.profilePlaceholder,
              status,
              lastName,
            })
          : navigation.navigate('Chat', {
              _id,
              avatar: avatar ? {uri: avatar} : assets.profilePlaceholder,
              name: [firstName, lastName].join(' '),
              type: 'private',
              fromContacts: true,
            })
      }
      style={[rootStyles.flexRow, rootStyles.p2, rootStyles.alignCenter]}>
      <View>
        {icon ? (
          icon
        ) : (
          <Image
            style={rootStyles.avatar}
            source={avatar ? {uri: avatar} : assets.profilePlaceholder}
          />
        )}
        {selected && (
          <View style={styles.check(colors, rootStyles)}>
            <Feather name="check" size={14} />
          </View>
        )}
      </View>
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
  check: (colors, rootStyles) => ({
    position: 'absolute',
    right: -5,
    bottom: 0,
    backgroundColor: colors.GREEN_PRIMARY,
    borderRadius: 25,
    width: 18,
    height: 18,
    ...rootStyles.box,
    borderColor: colors.HEADER,
    borderWidth: 0.5,
  }),
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
