import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTheme} from '../../providers/StyleProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Contact from '../../components/Contact';
import {useAuth} from '../../providers/AuthProvider';

export default function ParticipantsList({
  loadingParticipants,
  participants,
  setIsSearching,
  filteredParticipants,
  isSearching,
  setActiveParticipant,
  chat,
  noBackground,
}) {
  const {user} = useAuth();
  const {rootStyles, colors} = useTheme();
  return (
    <FlatList
      ListHeaderComponent={
        loadingParticipants || isSearching ? null : (
          <View>
            <View
              style={[
                rootStyles.flexRow,
                rootStyles.alignCenter,
                rootStyles.spaceBetween,
                rootStyles.p1,
                {backgroundColor: colors.LIGHT_BG},
              ]}>
              <Text style={[rootStyles.textColor(colors.INDICATOR)]}>
                Participants: {participants.length}
              </Text>
              <Ionicons
                onPress={() => setIsSearching(true)}
                name="search"
                color={colors.INACTIVE_TINT}
                size={20}
              />
            </View>
          </View>
        )
      }
      bounces={false}
      ListEmptyComponent={loadingParticipants ? <ActivityIndicator /> : null}
      data={filteredParticipants}
      keyExtractor={p => p._id}
      renderItem={({item}) => (
        <Contact
          {...item}
          bg={noBackground ? null : colors.LIGHT_BG}
          isAdmin={chat?.admins?.includes(item._id)}
          disabled={item._id === user._id}
          onPress={() => setActiveParticipant(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({});
