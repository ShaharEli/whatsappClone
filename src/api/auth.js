import {Platform} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {generateRSAKey, logger} from '../utils';
import {getItem, setItem} from '../utils/storage.util';
import {publicFetch} from './publicFetch';

const getRefreshOrThrow = async () => {
  const refreshToken = await getItem('refreshToken');
  if (!refreshToken) throw new Error('no refresh token found');
  return refreshToken;
};

export const logErrorToService = async (error, info) => {
  try {
    let prevUser = await getItem('currUser');
    if (prevUser) {
      prevUser = JSON.parse(prevUser);
    }
    const payload = {
      platform: Platform.OS,
      error,
      info,
      user: prevUser ? prevUser._id : null,
    };
    const {created} = await publicFetch('/auth/error', 'POST', payload);
    return created;
  } catch {
    return false;
  }
};

export const getAccessToken = async () => {
  const refreshToken = await getRefreshOrThrow();
  const {accessToken} = await publicFetch('/auth/get-token', 'POST', {
    refreshToken,
  });
  await setItem('accessToken', accessToken);
  return accessToken;
};

export const loginByPass = async (phone, password) => {
  try {
    const {user, accessToken, refreshToken} = await publicFetch(
      '/auth/login',
      'POST',
      {phone, password},
    );

    await setItem('accessToken', accessToken);
    await setItem('refreshToken', refreshToken);
    await setItem('currUser', user);
    const privateKey = await getItem(`privateKey@${user._id}`);
    return {...user, privateKey};
  } catch ({error}) {
    Snackbar.show({
      text: error,
      duration: Snackbar.LENGTH_SHORT,
    });
    // logger.warn(error); //TODO uncomment
    return false;
  }
};

export const register = async payload => {
  try {
    const [privateKey, publicKey] = generateRSAKey();
    const {user, accessToken, refreshToken} = await publicFetch(
      '/auth/register',
      'POST',
      {...payload, publicKey},
    );
    await setItem(`privateKey@${user._id}`, privateKey);
    await setItem('accessToken', accessToken);
    await setItem('refreshToken', refreshToken);
    await setItem('currUser', user);

    return {...user, privateKey};
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
    await setItem('currUser', user);
    const privateKey = await getItem(`privateKey@${user._id}`);
    return {...user, privateKey};
  } catch ({message}) {
    // logger.warn(message); //TODO uncomment
    return false;
  }
};
