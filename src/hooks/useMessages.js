import React, {useEffect, useState, useCallback} from 'react';
import {Platform} from 'react-native';
import {getMessages, getUserActiveState, sendMessage} from '../api/chat';
import {useAuth} from '../providers/AuthProvider';
import {useData} from '../providers/DataProvider';
import {
  changeConnectedState,
  getOtherParticipant,
  getType,
  handleNewMessage,
  handleSeen,
  rsa,
  splitterForRSA,
} from '../utils';

let timeout;
let firstTyped = true;
const isUserInTheChat = (user, {participants}) =>
  participants.find(({_id}) => _id === user);

export const useMessages = (
  chat,
  socketController,
  scrollToEnd,
  navigation,
) => {
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [msgType, setMsgType] = useState('text');
  const [media, setMedia] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentlyType, setCurrentlyType] = useState(false);
  const [noMoreMessages, setNoMoreMessages] = useState(false);

  const {user} = useAuth();
  const [loading, setLoading] = useState(false);

  const {setChats, chats} = useData();

  const fetchMessages = useCallback(
    async from => {
      let addTheMessages = true;
      if (loading || noMoreMessages) return;
      if (!from) {
        from = new Date().toISOString();
        addTheMessages = false;
      }
      setLoading(true);
      const messages = await getMessages(chat._id, chat.type === 'group', from);
      if (!messages?.length) setNoMoreMessages(true);
      if (!messages) setError(true);
      else {
        if (addTheMessages)
          setMessages(prev => [
            ...prev,
            ...messages.filter(
              ({_id}) => !prev.find(({_id: exitsingId}) => exitsingId === _id),
            ),
          ]);
        else setMessages(messages);
      }
      setLoading(false);
    },
    [chat, loading, noMoreMessages],
  );

  const onChangeText = useCallback(text => {
    if (text?.code) setInput(prev => prev + text.code);
    else setInput(text);
    setTyping(true);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setTyping(false);
    }, 1.5 * 1000);
  }, []);

  useEffect(() => {
    const currChat = chats.find(({_id}) => _id === chat?._id);
    if (!currChat) return;
    const {usersTyping = []} = currChat;
    let typeInterval;
    if (chat?.type === 'private') {
      if (usersTyping.length) {
        navigation.setParams({userTyping: true});
      } else {
        navigation.setParams({userTyping: false});
      }
    } else {
      typeInterval = setInterval(() => {
        navigation.setParams({
          usersTyping: getType(setCurrentlyType, usersTyping, true),
        });
      }, 1000);
    }

    return () => typeInterval && clearInterval(typeInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, chats]);

  const sendMsg = useCallback(async () => {
    const chatId = chat?._id;
    if (!chatId) return;
    setIsSending(true);
    // let encryptedMessage = input;
    // let encryptedMedia = media;
    // if (chat.type === 'private') {
    //   //e2e encryption available only in private chats to prevent duplicates
    //   console.log(Object.keys(getOtherParticipant(chat, user)));
    //   rsa.setPublicString(getOtherParticipant(chat, user).publicKey);
    //   if (encryptedMessage) {
    //     const text = splitterForRSA(encryptedMessage);
    //     encryptedMessage = text.map(chunk => rsa.encrypt(chunk));
    //   }
    //   if (encryptedMedia) {
    //     const newMedia = splitterForRSA(encryptedMedia);
    //     encryptedMessage = newMedia.map(chunk => rsa.encrypt(chunk));
    //   }
    // }
    const message = await sendMessage(
      {
        chatId,
        type: msgType,
        media,
        message,
      },
      socketController,
    );
    setIsSending(false);
    if (!message) return;
    setInput('');
    setMedia(null);
    scrollToEnd();
    return message;
  }, [chat, msgType, input, socketController, media, scrollToEnd]);

  useEffect(() => {
    if (chat?._id) {
      socketController.joinChat(
        chat._id,
        chat.participants.map(({socketId}) => socketId),
      );
      setChats(prev => {
        const chatIndex = prev.findIndex(({_id}) => _id === chat._id);
        return prev.map((chat, index) =>
          index === chatIndex ? {...chat, unreadMessages: 0} : chat,
        );
      });
      socketController.unsubscribe(['newMessage', 'seen']);
      //
      if (chat.type === 'private') {
        (async () => {
          const {_id: otherUserId} = chat.participants.find(
            ({_id}) => _id !== user._id,
          );
          const userOnlineState = await getUserActiveState(otherUserId);
          if (userOnlineState) {
            navigation.setParams(userOnlineState);
            changeConnectedState(
              setChats,
              chat._id,
              otherUserId,
              userOnlineState.isActive ? null : userOnlineState.lastConnected,
            );
          }
        })();

        socketController.subscribe('seen', ({userId, chatId}) =>
          handleSeen({userId, chatId}, setChats, user, chat, setMessages),
        );
        socketController.subscribe('socketConnected', ({user}) => {
          if (isUserInTheChat(user, chat)) {
            navigation.setParams({isActive: true});
          }
          changeConnectedState(setChats, chat._id, user);
        });
        socketController.subscribe(
          'socketDisconnected',
          ({user, lastConnected}) => {
            if (isUserInTheChat(user, chat)) {
              navigation.setParams({isActive: false, lastConnected});
            }
            changeConnectedState(setChats, chat._id, user, lastConnected);
          },
        );
      }
      socketController.subscribe(
        'newMessage',
        ({message, chat: returnedChat}) =>
          handleNewMessage(
            {message, returnedChat},
            chats,
            chat,
            setMessages,
            socketController,
            setChats,
            user,
          ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  useEffect(() => {
    if (chat?._id) {
      if (!firstTyped)
        socketController.emit('type', {typing, chatId: chat._id});
      else firstTyped = false;
    }
  }, [socketController, chat, typing]);

  useEffect(() => {
    if (chat?._id) {
      fetchMessages();
    }
    return () => {
      firstTyped = true;
      if (chat?._id) {
        socketController.emit('type', {typing: false, chatId: chat?._id});
        socketController.leaveChat();
        socketController.unsubscribe([
          //   'newMessage',
          'socketDisconnected',
          'socketConnected',
          //   'seen',
        ]);

        clearTimeout(timeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  return {
    input,
    onChangeText,
    typing,
    setMsgType,
    setMedia,
    sendMsg,
    refetchMessages: fetchMessages,
    loadingMsgs: loading,
    errorMsgs: error,
    messages,
    isSending,
    media,
    msgType,
  };
};
