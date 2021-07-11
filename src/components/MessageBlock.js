import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {useAuth} from '../providers/AuthProvider';
import {useTheme} from '../providers/StyleProvider';

export default function MessageBlock({content, by}) {
  const {user} = useAuth();
  const {colors, rootStyles} = useTheme();
  const isFromMe = useMemo(() => user._id === by, [by, user]);
  const [arrowColor, setArrowColor] = useState(null);

  return (
    <TouchableHighlight
      onPressIn={() => setArrowColor('black')}
      onPress={() => {}}
      onHideUnderlay={() => {
        setArrowColor(null);
      }}
      style={
        isFromMe
          ? styles.fromMeContainer({colors, rootStyles})
          : styles.notFromMeContainer({colors, rootStyles})
      }>
      <>
        <Text style={rootStyles.font(colors)}>{content}</Text>
        <View style={styles.arrow(colors, isFromMe, arrowColor)} />
      </>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  baseContainer: rootStyles => ({
    ...rootStyles.p1,
    ...rootStyles.my1,
    maxWidth: '70%',
    borderRadius: 10,
  }),
  fromMeContainer: ({colors, rootStyles}) => ({
    backgroundColor: colors.GREEN_PRIMARY,
    ...styles.baseContainer(rootStyles),
    ...rootStyles.alignSelfStart,
    ...rootStyles.ms3,
  }),
  notFromMeContainer: ({colors, rootStyles}) => ({
    backgroundColor: colors.HEADER,
    ...styles.baseContainer(rootStyles),
    ...rootStyles.alignSelfEnd,
    ...rootStyles.me3,
  }),
  arrow: (colors, isFromMe, arrowColor) => ({
    position: 'absolute',
    zIndex: -10,
    top: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftWidth: 10,
    borderRightWidth: 20,
    borderTopWidth: 12,
    borderTopColor: arrowColor
      ? arrowColor
      : isFromMe
      ? colors.GREEN_PRIMARY
      : colors.HEADER,
    left: isFromMe ? -10 : null,
    right: !isFromMe ? -10 : null,
  }),
});
