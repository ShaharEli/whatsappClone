import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../providers/StyleProvider';

function SeenIndicator({seenBy, isFromMe, participants}) {
  const isSeen = useMemo(
    () =>
      !!participants &&
      !!seenBy &&
      [seenBy, participants].filter(v => Array.isArray(v)).length === 2 &&
      seenBy.filter(v => !!v).length === participants.length,
    [seenBy, participants],
  );

  const {rootStyles, colors} = useTheme();

  if (!isFromMe) return null;

  return (
    <View style={[rootStyles.flexRow, rootStyles.alignCenter, rootStyles.ms2]}>
      <Ionicons
        name="checkmark-done-outline"
        size={18}
        color={isSeen ? colors.SEEN : colors.GREY_LIGHT}
      />
    </View>
  );
}
export default React.memo(SeenIndicator);
const styles = StyleSheet.create({});
