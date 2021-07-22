import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../providers/StyleProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import UnderlineTextField from './UnderlineTextField';

export default function Searchbar({
  setSearchVal = () => {},
  setIsSearching = () => {},
  setFilteredArr = () => {},
  fullArr,
  searchVal,
}) {
  const {rootStyles, colors} = useTheme();
  return (
    <View
      style={[
        rootStyles.flexRow,
        rootStyles.alignCenter,
        {backgroundColor: colors.LIGHT_BG},
      ]}>
      {!!searchVal ? (
        <Feather
          name="x"
          color={colors.INACTIVE_TINT}
          size={30}
          onPress={() => {
            setSearchVal('');
            setFilteredArr(fullArr);
          }}
          style={{...rootStyles.mx3}}
        />
      ) : (
        <Ionicons
          name="arrow-back"
          color={colors.INACTIVE_TINT}
          size={30}
          onPress={() => {
            setSearchVal('');
            setIsSearching(false);
          }}
          style={{...rootStyles.mx3}}
        />
      )}
      <UnderlineTextField
        addedStyle={{marginTop: -20}}
        placeholder="search..."
        onChangeText={e => {
          if (!e) {
            return setFilteredArr(fullArr);
          }
          setFilteredArr(
            fullArr.filter(
              (
                {firstName, lastName}, //TODO make more generic
              ) =>
                firstName
                  .toLowerCase()
                  .includes(
                    e.toLowerCase() ||
                      lastName.toLowerCase().includes(e.toLowerCase()),
                  ),
            ),
          );
          setSearchVal(e);
        }}
        value={searchVal}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
