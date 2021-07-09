import React, {useState} from 'react';
import {FlatList, StyleSheet, View, Text} from 'react-native';
import FloatingBtn from '../../components/FloatingBtn';
import {useTheme} from '../../providers/StyleProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScreenWrapper} from '../../styles/styleComponents';
import {useData} from '../../providers/DataProvider';

export default function Chats({navigation}) {
  const {colors, rootStyles} = useTheme();
  const {chats, loadingChats, refetchChats} = useData();
  const [refreshing, setRefreshing] = useState();

  return (
    <ScreenWrapper>
      <FlatList
        refreshing={loadingChats}
        onRefresh={refetchChats}
        ListEmptyComponent={
          <Text
            style={[
              rootStyles.textColor(colors.font),
              rootStyles.fontSize16,
              rootStyles.alignSelfCenter,
              rootStyles.mt10,
            ]}>
            No messages found
          </Text>
        }
      />
      <FloatingBtn onPress={() => navigation.navigate('Contacts')}>
        <MaterialCommunityIcons
          name="message-reply-text"
          color={colors.SECONDARY_FONT}
          size={35}
        />
      </FloatingBtn>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({});
