import React, {useEffect, useState} from 'react';
let timeout;
let firstTyped = true;
export const useMessages = (chat, socketController) => {
  const [] = useState();
  const [input, setInput] = useState();
  const [typing, setTyping] = useState(false);

  const onChangeText = text => {
    setInput(text);
    setTyping(true);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setTyping(false);
    }, 3 * 1000);
  };

  const sendMsg = async msg => {};

  useEffect(() => {
    if (chat?._id) {
      socketController.emit('joinedChat', {chatId: chat._id});
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
    return () => {
      firstTyped = true;
      if (chat?._id) {
        socketController.emit('type', {typing: false, chatId: chat?._id});
        socketController.emit('leftChat', {chatId: chat._id});
        clearTimeout(timeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  return {
    input,
    onChangeText,
    typing,
  };
};
