import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Contacts from 'react-native-contacts';
import {logger, setItem, withCache} from '../utils';
import {searchInContacts} from '../api/contacts';

const extractNumbers = contacts => {
  try {
    return contacts
      .filter(e => {
        const contactNumbers = e?.phoneNumbers;
        if (!contactNumbers) return false;
        return contactNumbers.some(contact => contact.label === 'mobile');
      })
      .reduce(
        (acc, curr) => [
          ...acc,
          {
            [curr?.givenName || '' + curr?.familyName || '']: curr.phoneNumbers
              .filter(number => number.label === 'mobile')
              .map(number => number.number),
          },
        ],
        [],
      );
  } catch (err) {
    return [];
  }
};

export const useContacts = () => {
  const [userContacts, setUserContacts] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [populatedContacts, setPopulatedContacts] = useState([]);
  const getContacts = () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'accept',
      })
        .then(() => Contacts.getAllWithoutPhotos())
        .then(contacts => {
          setUserContacts(extractNumbers(contacts));
        })
        .catch(err => {
          logger.warn(err);
          setLoadingContacts(false);
        });
    } else {
      Contacts.getAllWithoutPhotos()
        .then(contacts => {
          setUserContacts(extractNumbers(contacts));
        })
        .catch(err => {
          logger.warn(err);
          setLoadingContacts(false);
        });
    }
  };
  useEffect(() => getContacts(), []);

  useEffect(() => {
    (async () => {
      if (userContacts) {
        const contactsInUserContacts = await withCache('contacts', () =>
          searchInContacts(userContacts),
        );
        setPopulatedContacts(contactsInUserContacts);
        setLoadingContacts(false);
      }
    })();
  }, [userContacts]);

  return {
    contacts: populatedContacts,
    contactsLoading: loadingContacts,
    refetchContacts: async customLoadingState => {
      if (customLoadingState) customLoadingState(true);
      else setLoadingContacts(true);
      const contactsInUserContacts = await searchInContacts(userContacts);
      await setItem('contacts', {
        data: contactsInUserContacts,
        timeStamp: new Date().valueOf(),
      });
      setPopulatedContacts(contactsInUserContacts);
      if (customLoadingState) customLoadingState(false);
      else setLoadingContacts(false);
    },
  };
};
