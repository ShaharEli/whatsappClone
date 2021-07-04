import AsyncStorage from '@react-native-async-storage/async-storage';
import {logger} from './logger.util';

export const getItem = async k => {
  try {
    return await AsyncStorage.getItem(k);
  } catch {
    return null;
  }
};

export const setItem = async (k, v) => {
  try {
    return await AsyncStorage.setItem(
      k,
      typeof v === 'object' ? JSON.stringify(v) : v,
    );
  } catch {
    return null;
  }
};

export const setUserTheme = async theme => {
  try {
    return await setItem('theme', theme);
  } catch ({message}) {
    logger.error(message);
  }
};

export const getUserTheme = async () => {
  try {
    const value = await getItem('theme');
    if (value === 'dark' || value === 'light') {
      return value;
    }
    return null;
  } catch ({message}) {
    return null;
  }
};

export const setItemWithExpiry = async (key, value, ttl = 604800000) => {
  const item = {
    value,
    expiry: Date.now() + ttl,
  };
  return await setItem(key, JSON.stringify(item));
};
