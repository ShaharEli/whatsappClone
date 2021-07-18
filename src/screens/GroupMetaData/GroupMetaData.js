import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import UnderlineTextField from '../../components/UnderlineTextField';
import {useTheme} from '../../providers/StyleProvider';
import {ScreenWrapper} from '../../styles/styleComponents';
import {assets, logger, MAX_WIDTH} from '../../utils';
import EmojiBoard from 'react-native-emoji-board';
import Entypo from 'react-native-vector-icons/Entypo';
import Snackbar from 'react-native-snackbar';
import ImageCropPicker from 'react-native-image-crop-picker';
import {createChat} from '../../api';
import {CommonActions} from '@react-navigation/native';
import {useData} from '../../providers/DataProvider';
import {useAuth} from '../../providers/AuthProvider';

export default function GroupMetaData({route, navigation}) {
  const selectedContacts = route?.params?.selectedContacts;
  const [image, setImage] = useState(null);
  const {rootStyles, colors} = useTheme();
  const [groupName, setGroupName] = useState('');
  const [ekbShown, setEkbShown] = useState(false);
  const {setChats} = useData();
  const {user} = useAuth();

  const addImage = () => {
    ImageCropPicker.openCamera({
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
      });
  };

  useEffect(() => ekbShown && Keyboard.dismiss(), [ekbShown]);

  const onChangeText = input => {
    setGroupName(prev => (input?.code ? prev + input.code : input));
  };
  const onSubmit = async () => {
    if (!groupName)
      return Snackbar.show({
        text: 'Please provide a name for the group',
      });
    const newChat = await createChat(
      selectedContacts.map(({_id}) => _id),
      'group',
      image,
      groupName,
      `${user.firstName} ${user.lastName}`,
    );
    if (newChat) {
      setChats(prev => [newChat, ...prev]);
      navigation.navigate('Chat', {
        chat: newChat,
        name: groupName,
        fromGroup: true,
        avatar: image ? {uri: image} : assets.groupPlaceholder,
      });
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={[
          rootStyles.width(1),
          rootStyles.py4,
          {backgroundColor: colors.LIGHT_BG, height: 140},
        ]}>
        <View
          style={[
            rootStyles.flexRow,
            rootStyles.alignCenter,
            rootStyles.spaceAround,
          ]}>
          <Pressable onPress={addImage}>
            <Image
              source={image ? {uri: image} : assets.cameraPlaceholder}
              style={rootStyles.avatar}
            />
          </Pressable>
          <UnderlineTextField
            placeholder="Enter group name"
            onFocus={() => setEkbShown(false)}
            value={groupName}
            onChangeText={onChangeText}
          />
          <TouchableOpacity
            onPress={() => setEkbShown(prev => !prev)}
            hitSlop={{x: 10, y: 10, z: 10}}>
            <Entypo
              name="emoji-happy"
              color={colors.SECONDARY_FONT}
              size={25}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={[
            rootStyles.textColor(colors.SECONDARY_FONT),
            rootStyles.ms3,
            rootStyles.alignSelfCenter,
            rootStyles.maxWidth(0.9 * MAX_WIDTH),
          ]}>
          Please add group name, optionally add group icon.
        </Text>
      </View>
      <TouchableOpacity
        onPress={onSubmit}
        style={[
          rootStyles.customAvatar(60),
          rootStyles.box,
          rootStyles.alignSelfEnd,
          {backgroundColor: colors.GREEN_PRIMARY, marginTop: -30},
        ]}>
        <Entypo name="check" size={30} color={colors.WHITE} />
      </TouchableOpacity>
      <Text
        style={[
          rootStyles.textColor(colors.SECONDARY_FONT),
          rootStyles.my4,
          rootStyles.ms4,
        ]}>
        participants: {selectedContacts.length}
      </Text>
      <FlatList
        data={selectedContacts}
        style={rootStyles.pb4}
        keyExtractor={({_id}) => _id}
        horizontal
        renderItem={({item: {avatar, firstName}}) => (
          <View style={rootStyles.ms4}>
            <Image source={avatar} style={rootStyles.avatar} />
            <Text
              style={[
                rootStyles.textColor(colors.SECONDARY_FONT),
                rootStyles.textAlignCenter,
              ]}>
              {firstName}
            </Text>
          </View>
        )}
      />
      <EmojiBoard
        containerStyle={styles.kb(rootStyles, ekbShown)}
        showBoard={ekbShown}
        onClick={onChangeText}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  kb: (rootStyles, ekbShown) => ({
    ...rootStyles.width(0.8, -40),
    marginBottom: 50,
    marginLeft: MAX_WIDTH * 0.1 + 20,
    ...(ekbShown ? {} : {width: 0, height: 0, opacity: 0}),
  }),
});
