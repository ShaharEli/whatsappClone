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
import If from './If';
import Searchbar from './Searchbar';
import {useMemo} from 'react';

function ParticipantsController({navigation, route, newGroup, newStep}) {
  const {contacts, contactsLoading, refetchContacts} = useContacts();
  const {rootStyles, colors} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  useEffect(() => {
    if (newGroup) {
      navigation.setParams({
        selectedContactsNum: selectedContacts.length,
      });
    }
  }, [selectedContacts]);

  const onContactPressed = (selected, contact) => {
    setSelectedContacts(prev => {
      if (selected) return [...prev, contact];
      return prev.filter(({_id}) => _id !== contact._id);
    });
  };

  const navigateToNextStep = async () => {
    if (!newGroup && newStep) {
      return newStep(selectedContacts);
    }
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
  const filterData = ({firstName, lastName, phone}, searchValue) =>
    [firstName, lastName, phone].some(field =>
      field.toLowerCase().includes(searchValue.toLowerCase()),
    );
  const searching = route?.params?.searching;
  const searchValue = route?.params?.searchValue;

  const data = useMemo(() => {
    if (newGroup) {
      if (searching && searchValue) {
        return contacts.filter(({firstName, lastName, phone}) =>
          filterData({firstName, lastName, phone}, searchValue),
        );
      } else {
        return contacts;
      }
    }
    if (isSearching && searchVal) {
      return contacts.filter(({firstName, lastName, phone}) =>
        filterData({firstName, lastName, phone}, searchVal),
      );
    }
    return contacts;
  }, [contacts, searchValue, searching, searchVal, isSearching, newGroup]);

  const [isSearching, setIsSearching] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    if (!contactsLoading) navigation.setParams({contactsNum: contacts.length});
  }, [contacts, contactsLoading]);

  return (
    <ScreenWrapper>
      {contactsLoading ? (
        <View style={[rootStyles.flex1, rootStyles.box]}>
          <ActivityIndicator color={colors.BLUE} />
        </View>
      ) : (
        <>
          <If cond={!newGroup}>
            <Searchbar
              setSearchVal={setSearchVal}
              setIsSearching={setIsSearching}
              fullArr={contacts}
              searchVal={searchVal}
            />
          </If>
          <SelectedContacts
            {...{
              selectedContacts,
              isVisible: !!selectedContacts.length,
              setSelectedContacts,
            }}
          />
          <FlatList
            ListEmptyComponent={
              <Text
                style={[
                  rootStyles.font(colors),
                  rootStyles.textAlignCenter,
                  rootStyles.alignCenter,
                  rootStyles.mt4,
                ]}>
                No contacts found
              </Text>
            }
            onRefresh={() => {
              refetchContacts(setRefreshing);
            }}
            refreshing={refreshing}
            data={data}
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

export default React.memo(ParticipantsController);
