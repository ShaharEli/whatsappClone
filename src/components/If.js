import React from 'react';
import {Text} from 'react-native';
import {useTheme} from '../providers/StyleProvider';

export default function If({cond, children, message, onPress = () => {}}) {
  const {rootStyles, colors} = useTheme();
  if (!cond) {
    if (message) {
      return (
        <Text
          onPress={onPress}
          style={[rootStyles.alignSelfCenter, rootStyles.font(colors)]}>
          {message}
        </Text>
      );
    }
    return null;
  }

  return <>{children}</>;
}
