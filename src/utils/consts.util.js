import {Dimensions, Platform} from 'react-native';

export const {height: MAX_HEIGHT, width: MAX_WIDTH} = Dimensions.get('window');
export function isIphoneWithNotch() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926)
  );
}
export const SETTINGS_MENU_SIZE = 150;

export const FLOATING_BTN_SIZE = 70;

export const LOGS_TO_IGNORE = [
  'Require cycle: node_modules/react-native/Libraries/Network/fetch.js',
  'If you want to use Reanimated 2 ',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks',
];

export const CHAT_OPTIONS = [
  {
    label: 'New group',
    route: 'NewGroup',
  },
  {
    label: 'New broadcast',
    route: 'Broadcast',
  },
  {
    label: 'Starred messages',
    route: 'FavoriteMsgs',
  },
  {
    label: 'Settings',
    route: 'Settings',
  },
];

export const CONTACTS_OPTIONS = refresh => [
  {
    label: 'Invite friends',
    onPress: () => {},
  },
  {
    label: 'Contacts',
    onPress: () => {},
  },
  {
    label: 'Refresh',
    onPress: refresh,
  },
  {
    label: 'Help',
    onPress: () => {},
  },
];

export const AVATAR_SIZE = 50;
