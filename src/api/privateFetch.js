import {apiHostWithVersion} from '../bin/index';
import {getItem} from '../utils/storage.util';
import {getAccessTokenAndRetry} from './publicFetch';

export default async function securedFetch(
  path,
  method = 'GET',
  body,
  options,
) {
  const accessToken = await getItem('accessToken');
  if (!accessToken) throw new Error('No Session Active');
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json; charset=utf-8',
  };
  const fetchOptions = {
    method,
    mode: 'cors',
    cache: 'no-cache',
  };
  if (body) fetchOptions.body = JSON.stringify(body);
  if (options?.headers) {
    options.headers.forEach(([x, y]) => {
      headers[x] = y;
      if (y === null) delete headers[x];
    });
  }
  fetchOptions.headers = new Headers(headers);
  const response = await fetch(apiHostWithVersion + path, fetchOptions);
  const data = await response.json();

  switch (response.status) {
    case 200:
      return data;
    case 403:
      console.log('path', path);
      return await getAccessTokenAndRetry(path, method, body, options);
    default:
      throw data;
  }
}
