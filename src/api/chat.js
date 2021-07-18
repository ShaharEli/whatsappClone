import Snackbar from 'react-native-snackbar';
import {getQueryString, logger} from '../utils';
import {getItem, setItem} from '../utils/storage.util';

import securedFetch from './privateFetch';
const BASE = '/chat';

export const getMessages = async (chatId, isGroup = false) => {
  try {
    const messages = await securedFetch(
      `${BASE}/messages?chatId=${chatId}&isGroup=${isGroup}`,
    );
    return messages;
  } catch ({error}) {
    logger.error(error);
    return false;
  }
};

export const createChat = async (
  participants,
  type,
  image,
  name,
  userFullName,
) => {
  try {
    const {newChat} = await securedFetch(`${BASE}/new`, 'POST', {
      participants,
      type,
      image,
      name,
      userFullName,
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
    const {chats, unreadMessages} = await securedFetch(`${BASE}/all-chats`);
    return chats.map((c, i) => ({...c, unreadMessages: unreadMessages[i]}));
  } catch ({error}) {
    logger.error(error);
    return false;
  }
};

export const getUserActiveState = async userId => {
  try {
    const {isActive, lastConnected} = await securedFetch(
      `${BASE}/get-user-active-state/${userId}`,
    );
    return {isActive, lastConnected};
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
