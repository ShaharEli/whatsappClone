import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  headerRight: colors => ({
    color: colors.INACTIVE_TINT,
    fontSize: 20,
    fontWeight: 'bold',
  }),
  headerRightSmall: colors => ({
    color: colors.INACTIVE_TINT,
  }),
  clickableTitle: {
    width: '140%',
  },
  tabBarStyle: colors => ({
    showIcon: true,
    iconStyle: {marginBottom: -35},
    indicatorStyle: {backgroundColor: colors.INDICATOR, height: 3},
    activeTintColor: colors.INDICATOR,
    inactiveTintColor: colors.INACTIVE_TINT,
    labelStyle: {fontSize: 13},
    style: {
      backgroundColor: colors.HEADER,
    },
  }),
});
