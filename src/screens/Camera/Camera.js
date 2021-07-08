import {useIsFocused} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  ImageBackground,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useTheme} from '../../providers/StyleProvider';
import {logger} from '../../utils';

export default function Camera({navigation}) {
  const navigateToChat = () => navigation.navigate('Chats');
  const {rootStyles} = useTheme();
  const isFocused = useIsFocused();
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (isFocused && !image) {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64: true,
      })
        .then(image => {
          setImage(`data:${image.mime};base64,${image.data}`);
        })
        .catch(({message}) => {
          logger.warn(message);
          navigateToChat();
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, image]);
  if (!image) return <View />;
  return (
    <ImageBackground
      source={{uri: image}}
      style={rootStyles.flex1}></ImageBackground>
  );
}

const styles = StyleSheet.create({});
