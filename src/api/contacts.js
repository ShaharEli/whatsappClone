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
    const filteredContacts = [];
    foundContacts.forEach(contact => {
      if (!filteredContacts.find(c => c._id === contact._id)) {
        filteredContacts.push(contact);
      }
    });
    return filteredContacts;
  } catch ({error}) {
    logger.error(error, 'her');
    return [];
  }
};
