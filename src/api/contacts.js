import {logger} from '../utils';
import securedFetch from './privateFetch';
const BASE = '/contacts';

export const searchInContacts = async contacts => {
  try {
    const {foundContacts} = await securedFetch(
      `${BASE}/search-contacts`,
      'POST',
      {
        contacts,
      },
    );
    return foundContacts;
  } catch ({error}) {
    logger.error(error, 'her');
    return [];
  }
};
