/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Contact from '../../components/Contact';
import FloatingBtn from '../../components/FloatingBtn';
import SelectedContacts from '../../components/SelectedContacts';
import {useContacts} from '../../hooks';
import {useTheme} from '../../providers/StyleProvider';
import {ScreenWrapper} from '../../styles/styleComponents';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Snackbar from 'react-native-snackbar';

export default function NewGroup({navigation, route}) {
  const {contacts, contactsLoading, refetchContacts} = useContacts();
  const {rootStyles, colors} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  useEffect(() => {
    navigation.setParams({
      selectedContactsNum: selectedContacts.length,
    });
  }, [selectedContacts]);

  const onContactPressed = (selected, contact) => {
    setSelectedContacts(prev => {
      if (selected) return [...prev, contact];
      return prev.filter(({_id}) => _id !== contact._id);
    });
  };

  const navigateToNextStep = async () => {
    if (!selectedContacts.length) {
      return Snackbar.show({
        text: 'At least one contact need to be selected',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
    navigation.navigate('GroupMetaData', {
      selectedContacts,
    });
  };

  const searching = route?.params?.searching;
  const searchValue = route?.params?.searchValue;

  useEffect(() => {
    if (!contactsLoading) navigation.setParams({contactsNum: contacts.length});
  }, [contacts, contactsLoading]);

  return (
    <ScreenWrapper>
      {contactsLoading ? (
        <View style={[rootStyles.flex1, rootStyles.box]}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <SelectedContacts
            {...{
              selectedContacts,
              isVisible: !!selectedContacts.length,
              setSelectedContacts,
            }}
          />
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
      <FloatingBtn onPress={navigateToNextStep}>
        <MaterialCommunityIcons
          name="arrow-left"
          color={colors.SECONDARY_FONT}
          size={35}
        />
      </FloatingBtn>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({});
