export const getQueryString = obj =>
  '?' +
  obj
    .filter(([, val]) => {
      return !!val;
    })
    .map(([key, val]) => `${key}=${val}`)
    .join('&');
