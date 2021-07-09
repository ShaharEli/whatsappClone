import React, {useEffect, useState} from 'react';
let timeout;
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
    if (chat?._id) socketController.emit('type', {typing, chatId: chat._id});
  }, [socketController, chat, typing]);

  useEffect(() => {
    // socketController.keepVar({chatId: chat?._id});
    console.log(chat?._id);
    return () => {
      if (chat?._id) {
        socketController.emit('type', {typing: false, chatId: chat?._id});
        clearTimeout(timeout);
      }
    };
  }, [chat]);

  return {
    input,
    onChangeText,
    typing,
  };
};
