import {useHeaderHeight} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Animated,
  Image,
} from 'react-native';
import {createChat} from '../../api/chat';
import ChatInput from '../../components/ChatInput';
import Loading from '../../components/Loading';
import MessageBlock from '../../components/MessageBlock';
import {useMessages} from '../../hooks';
import {useAuth} from '../../providers/AuthProvider';
import {useData} from '../../providers/DataProvider';
import {useTheme} from '../../providers/StyleProvider';
import {assets, checkIfChatExists} from '../../utils';

export default function Chat({route}) {
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const {chats, setChats, loadingChats, chatsError, socketController} =
    useData();
  const {user} = useAuth();
  const {colors, rootStyles, isDark} = useTheme();
  const scrollToEnd = () => {
    flatListRef?.current?.scrollToOffset({y: 0});
  };
  const {onChangeText, input, sendMsg, messages} = useMessages(
    chat,
    socketController,
    scrollToEnd,
  );

  const flatListRef = useRef();
  const yProgress = useRef(new Animated.Value(0)).current;

  const fetchChat = async () => {
    const fromRouteChat = route.params?.chat;
    if (fromRouteChat) setChat(fromRouteChat);
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
      <Image
        source={isDark ? assets.chatDarkBg : assets.chatLightBg}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.FlatList
        keyboardShouldPersistTaps="handled"
        scrollIndicatorInsets={{left: 0}}
        ref={flatListRef}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: yProgress}}}],
          {
            useNativeDriver: true,
          },
        )}
        bounces={false}
        data={messages}
        keyExtractor={item => item._id}
        renderItem={({item, index}) => (
          <MessageBlock {...item} lastMessageFrom={messages?.[index + 1]?.by} />
        )}
        stickyHeaderIndices={[0]}
        invertStickyHeaders={false}
        ListHeaderComponent={
          <ChatInput
            value={input}
            onChangeText={onChangeText}
            onSubmit={sendMsg}
          />
        }
        inverted
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
