import React from 'react';
import {View, Image} from 'react-native';
import {useTheme} from '../providers/StyleProvider';
import {assets} from '../utils';

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
