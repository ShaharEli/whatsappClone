import React, {useEffect, useState} from 'react';
import {useCallback} from 'react';
import {getMessages, sendMessage} from '../api/chat';
import {useData} from '../providers/DataProvider';
let timeout;
let firstTyped = true;
export const useMessages = (chat, socketController, scrollToEnd) => {
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [msgType, setMsgType] = useState('text');
  const [media, setMedia] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const {setChats, chats} = useData();

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const messages = await getMessages(chat._id);
    if (!messages) setError(true);
    else setMessages(messages);
    setLoading(false);
  }, [chat]);

  const onChangeText = useCallback(text => {
    setInput(text);
    setTyping(true);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setTyping(false);
    }, 1.5 * 1000);
  }, []);

  const sendMsg = useCallback(async () => {
    const chatId = chat?._id;
    if (!chatId) return;
    const message = await sendMessage(
      {
        chatId,
        type: msgType,
        media,
        message: input,
      },
      socketController,
    );
    if (!message) return;
    setInput('');
    setMedia(null);
    scrollToEnd();
    return message;
  }, [chat, msgType, input, socketController, media, scrollToEnd]);

  useEffect(() => {
    if (chat?._id) {
      socketController.joinChat(chat._id);
      setChats(prev => {
        const chatIndex = prev.findIndex(({_id}) => _id === chat._id);
        return prev.map((chat, index) =>
          index === chatIndex ? {...chat, unreadMessages: 0} : chat,
        );
      });
      socketController.unsubscribe('newMessage');
      socketController.subscribe(
        'newMessage',
        ({message, chat: returnedChat}) => {
          const chatIndex = chats.findIndex(
            ({_id}) => _id === returnedChat._id,
          );
          const inTheSameChat = chat._id === returnedChat._id;
          if (inTheSameChat) {
            setMessages(prev => [message, ...prev]);
          }
          //TODO notification
          if (chatIndex === -1) {
            setChats(prev => [
              ...prev,
              {...returnedChat, unreadMessages: 1, lastMessage: message},
            ]);
          } else {
            setChats(prev =>
              prev.map((chat, index) => {
                if (index !== chatIndex) return chat;
                const {unreadMessages = 0} = chat;
                return {
                  ...chat,
                  unreadMessages: inTheSameChat
                    ? unreadMessages
                    : unreadMessages + 1,
                  lastMessage: message,
                };
              }),
            );
          }
        },
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
        socketController.unsubscribe('newMessage');
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
  };
};
