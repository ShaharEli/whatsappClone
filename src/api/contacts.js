import {logger, setItem} from '../utils';
import securedFetch from './privateFetch';
const BASE = '/contacts';

// export const getContacts = async ({contacts}) => {
//   try {
//     const {contacts: userContacts} = await securedFetch(
//       `${BASE}/get-contacts`,
//       'POST',
//       {
//         contacts,
//       },
//     );
//     await setItem('contacts', userContacts);
//     return userContacts;
//   } catch ({error}) {
//     logger.error(error);
//     return [];
//   }
// };

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
