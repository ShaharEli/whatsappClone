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
import {useAuth} from '../../providers/AuthProvider';
import {useData} from '../../providers/DataProvider';
import {useTheme} from '../../providers/StyleProvider';

const checkIfChatExists = (chats, {_id: ourId}, {_id: contactID}) => {
  for (let chat of chats) {
    if (chat.type === 'private') {
      if (
        chat.participants.reduce(
          (acc, curr) =>
            acc + ([ourId, contactID].find(elm => elm === curr) ? 1 : 0),
          0,
        ) === 2
      ) {
        return chat;
      }
    }
  }
  return false;
};

export default function Chat({route}) {
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const {chats, setChats} = useData();
  const {user} = useAuth();
  const {colors, rootStyles} = useTheme();

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
    fetchChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params]);

  if (loading) return <Loading />;

  return (
    <KeyboardAvoidingView
      behavior="height"
      enabled
      style={[rootStyles.bg(colors), rootStyles.flex1]}>
      <FlatList
        renderItem={({item}) => {
          console.log(item);
          return <Text style={{color: 'white'}}>{item}</Text>;
        }}
        data={[
          'd',
          'd',
          'df',
          'df',
          'df',
          'd',
          'd',
          'df',
          'df',
          'df',
          'd',
          'd',
          'df',
          'df',
          'df',
          'd',
          'd',
          'df',
          'df',
          'df',
          'd',
          'd',
          'df',
          'df',
          'df',
          'd',
          'd',
          'df',
          'df',
          'df',
        ]}
        keyExtractor={e => e + Math.random()}
        ListHeaderComponent={<ChatInput />}
        inverted
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
