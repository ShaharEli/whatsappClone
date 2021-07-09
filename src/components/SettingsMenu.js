import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity as TO} from 'react-native';
import {useTheme} from '../providers/StyleProvider';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MAX_HEIGHT, MAX_WIDTH, SETTINGS_MENU_SIZE} from '../utils';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function SettingsMenu({
  navigation,
  onSearch,
  options,
  noSearch = false,
  withSettings = true,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {rootStyles, colors} = useTheme();
  return (
    <View style={rootStyles.mx3}>
      <View style={rootStyles.flexRow}>
        {withSettings && (
          <Entypo
            onPress={() => setIsMenuOpen(true)}
            name="dots-three-vertical"
            color={colors.INACTIVE_TINT}
            size={20}
            style={rootStyles.mx4}
          />
        )}
        {!noSearch && (
          <Ionicons
            onPress={onSearch}
            name="search"
            color={colors.INACTIVE_TINT}
            size={20}
          />
        )}
      </View>
      {isMenuOpen && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsMenuOpen(false)}
          containerStyle={styles.overlay}>
          <View style={styles.menuContainer(colors)}>
            {options.map(({route = null, label, onPress}) => (
              <TouchableOpacity
                style={styles.route(colors)}
                key={label}
                onPress={() =>
                  route ? navigation.navigate(route) : onPress()
                }>
                <Text style={{color: colors.SECONDARY_FONT}}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: colors => ({
    position: 'absolute',
    right: 15,
    width: SETTINGS_MENU_SIZE,
    height: SETTINGS_MENU_SIZE,
    backgroundColor: colors.SETTINGS_MENU,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 2,
    zIndex: 10000,
  }),
  route: colors => ({
    justifyContent: 'center',
    padding: 10,
    color: colors.font,
  }),
  overlay: {
    position: 'absolute',
    height: MAX_HEIGHT,
    width: MAX_WIDTH,
    right: '-20%',
    backgroundColor: 'transparent',
  },
});
