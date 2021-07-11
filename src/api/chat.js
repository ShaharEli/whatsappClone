import Snackbar from 'react-native-snackbar';
import {getQueryString, logger} from '../utils';
import {getItem, setItem} from '../utils/storage.util';

import securedFetch from './privateFetch';
const BASE = '/chat';

export const getChatFromContact = async ({_id, type}) => {};

export const getMessages = async chatId => {
  try {
    const messages = await securedFetch(`${BASE}/messages/${chatId}`);
    return messages;
  } catch ({error}) {
    logger.error(error);
    return false;
  }
};

export const createChat = async (participants, type) => {
  try {
    const {newChat} = await securedFetch(`${BASE}/new`, 'POST', {
      participants,
      type,
    });
    return newChat;
  } catch ({error}) {
    logger.error(error);
    Snackbar.show({
      text: error,
      duration: Snackbar.LENGTH_SHORT,
    });
    return false;
  }
};

export const getAllChats = async () => {
  try {
    const {chats} = await securedFetch(`${BASE}/all-chats`);
    return chats;
  } catch ({error}) {
    logger.error(error);
    return false;
  }
};

export const sendMessage = async ({message, type, chatId, media}) => {
  try {
    const {newMessage, chat} = await securedFetch(
      `${BASE}/new-message`,
      'POST',
      {
        message,
        type,
        chatId,
        media,
      },
    );
    return {newMessage, chat};
  } catch ({error}) {
    logger.error(error);
    Snackbar.show({
      text: error,
      duration: Snackbar.LENGTH_SHORT,
    });
    return false;
  }
};
