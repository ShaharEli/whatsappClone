import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {useState} from 'react/cjs/react.development';
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
  const {colors, rootStyles} = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const {
    contacts: userContacts,
    contactsLoading,
    refetchContacts,
  } = useContacts();

  return (
    <ScreenWrapper>
      {contactsLoading ? (
        <View style={[rootStyles.flex1, rootStyles.box]}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          onRefresh={() => {
            refetchContacts(setRefreshing);
          }}
          refreshing={refreshing}
          data={[...CONTACTS_BASE_OPTIONS(colors, navigation), ...userContacts]}
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
