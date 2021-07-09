import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../providers/StyleProvider';
import {FLOATING_BTN_SIZE, MAX_HEIGHT} from '../utils';

export default function FloatingBtn({children, onPress}) {
  const {colors} = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={styles.container(colors)}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: colors => ({
    width: FLOATING_BTN_SIZE,
    height: FLOATING_BTN_SIZE,
    backgroundColor: colors.GREEN_PRIMARY,
    borderRadius: FLOATING_BTN_SIZE,
    position: 'absolute',
    top: MAX_HEIGHT - 280,
    left: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }),
});
