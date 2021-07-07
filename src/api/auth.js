import Snackbar from 'react-native-snackbar';
import {logger} from '../utils';
import {getItem, setItem} from '../utils/storage.util';
import {publicFetch} from './publicFetch';

const getRefreshOrThrow = async () => {
  const refreshToken = await getItem('refreshToken');
  if (!refreshToken) throw new Error('no refresh token found');
  return refreshToken;
};

export const getAccessToken = async () => {
  const refreshToken = await getRefreshOrThrow();
  return await publicFetch('/auth/get-token', 'POST', {refreshToken});
};

export const loginByPass = async (phone, password) => {
  //GET TOKENS!!
  try {
    return await publicFetch('/auth/login', 'POST', {phone, password});
  } catch ({error}) {
    Snackbar.show({
      text: error,
      duration: Snackbar.LENGTH_SHORT,
    });
    logger.error(error);
    return false;
  }
};

export const register = async payload => {
  try {
    const {user, accessToken, refreshToken} = await publicFetch(
      '/auth/register',
      'POST',
      payload,
    );
    await setItem('accessToken', accessToken);
    await setItem('refreshToken', refreshToken);
    return user;
  } catch ({error}) {
    Snackbar.show({
      text: error,
      duration: Snackbar.LENGTH_SHORT,
    });
    logger.error(error);
    return false;
  }
};

export const loginWithToken = async () => {
  try {
    const refreshToken = await getRefreshOrThrow();
    const {accessToken, user} = await publicFetch(
      '/auth/login-with-token',
      'POST',
      {refreshToken},
    );
    await setItem('accessToken', accessToken);
    return user;
  } catch ({message}) {
    // logger.warn(message); //TODO uncomment
    return false;
  }
};
