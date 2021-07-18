import {StackActions} from '@react-navigation/routers';
import {useHeaderHeight} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Animated,
  Image,
  BackHandler,
  Platform,
} from 'react-native';
import {createChat} from '../../api/chat';
import ChatInput from '../../components/ChatInput';
import DateBlock from '../../components/DateBlock';
import Loading from '../../components/Loading';
import MessageBlock from '../../components/MessageBlock';
import ScrollToBottomBubble from '../../components/ScrollToBottomBubble';
import {useMessages} from '../../hooks';
import {useAuth} from '../../providers/AuthProvider';
import {useData} from '../../providers/DataProvider';
import {useTheme} from '../../providers/StyleProvider';
import {
  assets,
  checkIfChatExists,
  getChatDataFormatted,
  getColors,
  isDifferentDay,
  MAX_HEIGHT,
} from '../../utils';

export default function Chat({route, navigation}) {
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participantsColors, setParticipantsColors] = useState({});
  const {chats, setChats, loadingChats, chatsError, socketController} =
    useData();
  const {user} = useAuth();
  const {colors, rootStyles, isDark} = useTheme();
  const scrollToEnd = () => {
    flatListRef?.current?.scrollToOffset({y: 0});
  };
  const {onChangeText, input, sendMsg, messages, isSending, loadingMsgs} =
    useMessages(chat, socketController, scrollToEnd, navigation);

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
      // TODO change according to route
    }

    setLoading(false);
  };
  const handleBackBtn = () => {
    route.params?.fromGroup
      ? navigation.dispatch(StackActions.popToTop())
      : navigation.goBack();
  };

  useEffect(() => {
    if (loadingChats || chatsError) return;
    fetchChat();
    if (Platform.OS === 'android')
      BackHandler.addEventListener('hardwareBackPress', handleBackBtn);

    return () => {
      if (Platform.OS === 'android')
        BackHandler.removeEventListener('hardwareBackPress', handleBackBtn);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingChats]);

  useEffect(() => {
    if (chat?.type === 'private') {
      const {participants} = chat;
      const {isActive, lastConnected} = getChatDataFormatted(
        {
          participants,
        },
        user._id,
        true,
      );
      navigation.setParams({
        isActive,
        lastConnected,
      });
    } else if (chat?.type === 'group') {
      (async () => {
        setParticipantsColors(await getColors(chat));
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

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
        ListFooterComponent={
          messages.length ? (
            <DateBlock value={messages?.[messages.length - 1]?.createdAt} />
          ) : null
        }
        scrollEventThrottle={16}
        contentContainerStyle={styles.flatListContainer}
        scrollIndicatorInsets={{right: 0}}
        ref={flatListRef}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: yProgress}}}],
          {
            useNativeDriver: true,
          },
        )}
        style={{maxHeight: MAX_HEIGHT - headerHeight - 80}} //TODO change to const
        bounces={false}
        data={messages}
        keyExtractor={item => item._id}
        renderItem={({item, index}) => (
          <>
            {!messages?.[index - 1] ||
              (isDifferentDay(
                item.createdAt,
                messages[index - 1].createdAt,
              ) && <DateBlock value={messages[index - 1]?.createdAt} />)}
            <MessageBlock
              {...item}
              chatType={chat?.type}
              participants={chat.participants}
              lastMessageFrom={messages?.[index + 1]?.by}
              participantsColors={participantsColors}
            />
          </>
        )}
        inverted
      />
      <ScrollToBottomBubble {...{yProgress, scrollToEnd}} />
      <ChatInput
        value={input}
        disabled={isSending}
        onChangeText={onChangeText}
        onSubmit={sendMsg}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flatListContainer: {paddingTop: 10, paddingBottom: 50},
});
