import Snackbar from 'react-native-snackbar';
import {getQueryString, logger} from '../utils';
import {getItem, setItem} from '../utils/storage.util';

import securedFetch from './privateFetch';
const BASE = '/chat';

export const getChat = async ({id, type}) => {};

export const getAllChats = async () => {
  try {
    const {chats} = await securedFetch(`${BASE}/all-chats`);
    return chats;
  } catch ({error}) {
    logger.error(error);
    return [];
  }
};
