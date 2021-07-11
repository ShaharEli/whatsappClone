import React, {useEffect, useState} from 'react';
import {useCallback} from 'react';
import {getMessages, sendMessage} from '../api/chat';
import {useChats} from './useChats';
let timeout;
let firstTyped = true;
export const useMessages = (chat, socketController) => {
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [msgType, setMsgType] = useState('text');
  const [media, setMedia] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const {setChats, chats} = useChats();

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
    return message;
  }, [chat, msgType, input, socketController, media]);

  useEffect(() => {
    if (chat?._id) {
      socketController.joinChat(chat._id);
      socketController.subscribe(
        'newMessage',
        async ({message, chat: returnedChat}) => {
          console.log(message);
          if (chat._id === returnedChat._id) {
            setMessages(prev => [message, ...prev]);
          } else {
            //TODO notification
            const chatIndex = chats.findIndex(
              ({_id}) => _id === returnedChat._id,
            );
            if (chatIndex === -1) {
              console.log(2);
              setChats(prev => [...prev, {...returnedChat, unreadMessages: 1}]);
            } else {
              setChats(prev =>
                prev.map((chat, index) => {
                  if (index !== chatIndex) return chat;
                  const {unreadMessages = 0} = chat;
                  return {...chat, unreadMessages: unreadMessages + 1};
                }),
              );
            }
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
