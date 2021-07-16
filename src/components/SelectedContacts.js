import React, {useEffect, useMemo, useRef} from 'react';
import {StyleSheet, Text, View, Animated, Image} from 'react-native';
import Easing from 'react-native/Libraries/Animated/Easing';
import {useTheme} from '../providers/StyleProvider';
import ContactAddingBlock from './ContactAddingBlock';

export default function SelectedContacts({
  selectedContacts,
  isVisible,
  setSelectedContacts,
}) {
  const {colors, rootStyles} = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const maxHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(maxHeight, {
        toValue: 100,
        duration: 600,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(maxHeight, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);
  return (
    <Animated.FlatList
      horizontal
      contentContainerStyle={[rootStyles.alignCenter]}
      bounces={false}
      style={{
        ...styles.container(colors),
        maxHeight,
      }}
      data={selectedContacts}
      keyExtractor={({_id}) => _id}
      renderItem={({item}) => (
        <ContactAddingBlock
          {...item}
          setSelectedContacts={setSelectedContacts}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: (colors, rootStyles) => ({
    borderBottomWidth: 1,
    borderBottomColor: colors.HEADER,
  }),
});
