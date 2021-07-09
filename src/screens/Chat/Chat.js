import {useHeaderHeight} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {createChat} from '../../api/chat';
import ChatInput from '../../components/ChatInput';
import Loading from '../../components/Loading';
import {useMessages} from '../../hooks';
import {useAuth} from '../../providers/AuthProvider';
import {useData} from '../../providers/DataProvider';
import {useTheme} from '../../providers/StyleProvider';

const checkIfChatExists = (chats, {_id: ourId}, {_id: contactID}) => {
  for (let chat of chats) {
    if (chat.type === 'private') {
      if (
        chat.participants.reduce(
          (acc, curr) =>
            acc +
            ([ourId, contactID].find(elm => elm === curr || elm === curr?._id)
              ? 1
              : 0),
          0,
        ) === 2
      ) {
        return chat;
      }
    }
  }
  return false;
};

let timeout;

export default function Chat({route}) {
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const {chats, setChats, loadingChats, chatsError, socketController} =
    useData();
  const {user} = useAuth();
  const {colors, rootStyles} = useTheme();
  const {onChangeText, input} = useMessages(chat, socketController);
  const onSubmit = async () => {};

  const fetchChat = async () => {
    if (route.params?.fromContacts && route.params?._id) {
      const chatExits = checkIfChatExists(chats, user, route.params);
      if (chatExits) setChat(chatExits);
      else {
        const newChat = await createChat([route.params._id], 'private');
        if (newChat) {
          setChats(prev => [newChat, ...prev]);
          setChat(newChat);
        }
      }
    } else {
      // toDO change according to route
    }
    setLoading(false);
  };
  useEffect(() => {
    if (loadingChats || chatsError) return;
    fetchChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params, loadingChats]);
  const headerHeight = useHeaderHeight();

  if (loading) return <Loading />;

  return (
    <KeyboardAvoidingView
      behavior="height"
      enabled
      keyboardVerticalOffset={headerHeight}
      style={[rootStyles.bg(colors), rootStyles.flex1]}>
      <FlatList
        ListHeaderComponent={
          <ChatInput
            value={input}
            onChangeText={onChangeText}
            onSubmit={onSubmit}
          />
        }
        inverted
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
