import Snackbar from 'react-native-snackbar';
import {getQueryString, logger} from '../utils';
import {getItem, setItem} from '../utils/storage.util';

import securedFetch from './privateFetch';
const BASE = '/chat';

export const getChatFromContact = async ({_id, type}) => {};

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
    return [];
  }
};
