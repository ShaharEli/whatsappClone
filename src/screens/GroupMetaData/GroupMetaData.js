import {TextField} from '@ubaids/react-native-material-textfield';
import React, {useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View, Image, Pressable} from 'react-native';
import EmojiKb from '../../components/EmojiKb';
import UnderlineTextField from '../../components/UnderlineTextField';
import {useTheme} from '../../providers/StyleProvider';
import {ScreenWrapper} from '../../styles/styleComponents';
import {assets, MAX_HEIGHT, MAX_WIDTH} from '../../utils';

export default function GroupMetaData({route}) {
  const selectedContacts = route?.params?.selectedContacts;
  const [image, setImage] = useState(null);
  const {rootStyles, colors} = useTheme();
  const emojiKeyboardRef = useRef();
  const [groupName, setGroupName] = useState('');
  const onChangeText = input => {
    console.log('dede');
    setGroupName(prev => (input?.code ? prev + input.code : input));
  };

  return (
    <ScreenWrapper>
      <View
        style={[
          rootStyles.width(1),
          rootStyles.py4,
          {backgroundColor: colors.LIGHT_BG, height: 120},
        ]}>
        <View
          style={[
            rootStyles.flexRow,
            rootStyles.alignCenter,
            rootStyles.spaceAround,
          ]}>
          <Pressable>
            <Image
              source={image ? image : assets.cameraPlaceholder}
              style={rootStyles.avatar}
            />
          </Pressable>
          <UnderlineTextField
            placeholder="Enter group name"
            onFocus={() => emojiKeyboardRef?.current?.(false)}
          />
          <EmojiKb
            cbHook={emojiKeyboardRef}
            kbStyle={styles.kb}
            onChangeText={onChangeText}
          />
        </View>
      </View>
      <FlatList
        data={selectedContacts}
        keyExtractor={({_id}) => _id}
        horizontal
        renderItem={({item: {avatar, firstName}}) => (
          <View>
            <Image source={avatar} style={rootStyles.avatar} />
            <Text></Text>
          </View>
        )}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  kb: {
    position: 'absolute',
    bottom: -300,
    left: MAX_WIDTH * 0.1 + 20,
  },
});
