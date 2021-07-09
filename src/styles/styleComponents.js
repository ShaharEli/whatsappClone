import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {useTheme} from '../providers/StyleProvider';
import {assets, AVATAR_SIZE} from '../utils';

export function WidthContainer({children}) {
  const {rootStyles} = useTheme();
  return (
    <View
      style={[
        rootStyles.width(0.9),
        rootStyles.alignSelfCenter,
        rootStyles.maxWidth(350),
      ]}>
      {children}
    </View>
  );
}

export function Divider({children, m: marginVertical}) {
  return <View style={{marginVertical}}>{children}</View>;
}

export function Logo({
  w: width = 200,
  h: height = 200,
  mv: marginVertical,
  mh: marginHorizontal,
  m: margin,
  mt: marginTop,
  mb: marginBottom,
  alsc = true,
  style = {},
}) {
  const {rootStyles} = useTheme();
  return (
    <Image
      source={assets.logo}
      style={[
        {
          width,
          height,
          marginVertical,
          margin,
          marginTop,
          marginBottom,
          marginHorizontal,
        },
        alsc && rootStyles.alignSelfCenter,
        style,
      ]}
    />
  );
}

export const ScreenWrapper = ({children, style = {}}) => {
  const {rootStyles, colors} = useTheme();
  return (
    <View style={[rootStyles.backgroundColor(colors), rootStyles.flex1, style]}>
      {children}
    </View>
  );
};

export const CircleWrapper = ({children, size = AVATAR_SIZE}) => {
  const {colors} = useTheme();
  return <View style={styles.circleContainer(colors, size)}>{children}</View>;

  // return <View style={styles.circleContainer(colors, size)}>{children}</View>;
};
const styles = StyleSheet.create({
  circleContainer: (colors, size) => ({
    width: size,
    height: size,
    backgroundColor: colors.GREEN_PRIMARY,
    borderRadius: size,
    justifyContent: 'center',
    alignItems: 'center',
  }),
});
