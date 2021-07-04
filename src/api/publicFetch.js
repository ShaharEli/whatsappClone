import {apiHostWithVersion} from '../bin/config';
import {getItem} from '../utils/storage.util';

export async function publicFetch(path, method = 'GET', body, options) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
  };
  const fetchOptions = {
    method,
    mode: 'cors',
    cache: 'no-cache',
  };
  if (body) fetchOptions.body = body;

  if (options.headers) {
    options.headers.forEach(([x, y]) => {
      headers[x] = y;
      if (y === null) delete headers[x];
    });
  }
  fetchOptions.headers = new Headers(headers);

  const response = await fetch(apiHostWithVersion + path, fetchOptions);
  const data = await response.json();
  if (response.status === 200) {
    return data;
  }
  throw data;
}

export const getAccessTokenAndRetry = async () => {};
