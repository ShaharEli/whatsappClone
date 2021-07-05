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
    logger.warn(message);
    return false;
  }
};
