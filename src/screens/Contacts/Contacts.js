import React, {useEffect} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {useState} from 'react/cjs/react.development';
// import {getContacts} from '../../api/contacts';
import {useAuth} from '../../providers/AuthProvider';
import {CircleWrapper, ScreenWrapper} from '../../styles/styleComponents';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../providers/StyleProvider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Contact from '../../components/Contact';
import {useContacts} from '../../hooks';

const CONTACTS_BASE_OPTIONS = (colors, navigation) => [
  {
    id: 'new-group',
    label: 'New group',
    icon: (
      <CircleWrapper>
        <MaterialIcons name="group" color={colors.SECONDARY_FONT} size={30} />
      </CircleWrapper>
    ),
    onPress: () => navigation.navigate('NewGroup'),
  },
  {
    id: 'new-contact',
    label: 'New contact',
    icon: (
      <CircleWrapper>
        <AntDesign name="user" color={colors.SECONDARY_FONT} size={30} />
      </CircleWrapper>
    ),
    onPress: () => alert('implention needed'), //TODO implement
  },
];

export default function Contacts({route, navigation}) {
  const {user} = useAuth();
  const {colors, rootStyles} = useTheme();
  const [contacts, setContacts] = useState(
    CONTACTS_BASE_OPTIONS(colors, navigation),
  );

  //   useEffect(() => {
  //     (async () => {
  //       const userContacts = await getContacts(user);
  //       setContacts(prev => [...prev, ...userContacts]);
  //     })();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [user]);

  const {contacts: userContacts, contactsLoading} = useContacts(user);

  return (
    <ScreenWrapper>
      {contactsLoading ? (
        <View style={rootStyles.box}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={[...contacts, ...userContacts]}
          keyExtractor={contact => (contact?.id ? contact.id : contact._id)}
          renderItem={({item: contact}) => (
            <Contact {...contact} navigation={navigation} />
          )}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({});
