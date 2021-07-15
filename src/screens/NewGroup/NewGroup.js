import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Contact from '../../components/Contact';
import SelectedContacts from '../../components/SelectedContacts';
import {useContacts} from '../../hooks';
import {useTheme} from '../../providers/StyleProvider';
import {ScreenWrapper} from '../../styles/styleComponents';

export default function NewGroup({navigation, route}) {
  const {contacts, contactsLoading, refetchContacts} = useContacts();
  const {rootStyles, colors} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const onContactPressed = (selected, contact) => {
    navigation.setParams({
      selectedContactsNum: selected
        ? selectedContacts.length + 1
        : selectedContacts.length - 1,
    });
    setSelectedContacts(prev => {
      if (selected) return [...prev, contact];
      return prev.filter(({_id}) => _id !== contact._id);
    });
  };
  const searching = route?.params?.searching;
  const searchValue = route?.params?.searchValue;

  useEffect(() => {
    if (!contactsLoading) navigation.setParams({contactsNum: contacts.length});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts, contactsLoading]);

  return (
    <ScreenWrapper>
      {contactsLoading ? (
        <View style={[rootStyles.flex1, rootStyles.box]}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <SelectedContacts />
          <FlatList
            onRefresh={() => {
              refetchContacts(setRefreshing);
            }}
            refreshing={refreshing}
            data={
              searching && searchValue
                ? contacts.filter(({firstName, lastName, phone}) =>
                    [firstName, lastName, phone].some(field =>
                      field.toLowerCase().includes(searchValue.toLowerCase()),
                    ),
                  )
                : contacts
            }
            keyExtractor={({_id}) => _id}
            renderItem={({item: contact}) => (
              <Contact
                {...contact}
                navigation={navigation}
                selected={selectedContacts.find(({_id}) => _id === contact._id)}
                onPress={onContactPressed}
              />
            )}
          />
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({});
