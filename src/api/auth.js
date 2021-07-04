import {getItem} from '../utils/storage.util';

export const getAccessToken = async () => {
  const refreshToken = await getItem('refreshToken');
  if (!refreshToken) throw new Error('no refresh token found'); //TODO: signout
};
