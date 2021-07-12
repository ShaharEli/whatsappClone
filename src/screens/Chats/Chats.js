import React, {useEffect} from 'react';
import {FlatList, Platform, StyleSheet, Text} from 'react-native';
import FloatingBtn from '../../components/FloatingBtn';
import {useTheme} from '../../providers/StyleProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Divider, ScreenWrapper} from '../../styles/styleComponents';
import {useData} from '../../providers/DataProvider';
import ChatBlock from '../../components/ChatBlock';
import {MAX_WIDTH} from '../../utils';
import {useIsFocused} from '@react-navigation/core';

export default function Chats({navigation}) {
  const {colors, rootStyles} = useTheme();
  const {chats, loadingChats, refetchChats, socketController, setChats} =
    useData();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && socketController?.isReady) {
      socketController.subscribe(
        'newMessage',
        ({message, chat: returnedChat}) => {
          setChats(prev => {
            console.log(prev.length);
            const chatIndex = prev.findIndex(
              ({_id}) => _id === returnedChat._id,
            );
            if (chatIndex === -1) {
              return [
                ...prev,
                {...returnedChat, unreadMessages: 1, lastMessage: message},
              ];
            } else {
              return prev.map((chat, index) => {
                if (index !== chatIndex) return chat;
                const {unreadMessages = 0} = chat;
                return {
                  ...chat,
                  unreadMessages: unreadMessages + 1,
                  lastMessage: message,
                };
              });
            }
          });
        },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, socketController?.isReady]);

  return (
    <ScreenWrapper>
      <FlatList
        refreshing={loadingChats}
        onRefresh={refetchChats}
        data={chats.filter(chat => !!chat.lastMessage)}
        renderItem={({item}) => (
          <ChatBlock chat={item} navigation={navigation} />
        )}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => (
          <Divider bg={colors.GREY} h={1} w={MAX_WIDTH * 0.9} />
        )}
        ListEmptyComponent={
          !loadingChats && (
            <Text
              style={[
                rootStyles.textColor(colors.font),
                rootStyles.fontSize16,
                rootStyles.alignSelfCenter,
                rootStyles.mt10,
              ]}>
              No chats found
            </Text>
          )
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
