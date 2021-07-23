import {Platform} from 'react-native';
export const isDev = true;
// run adb reverse tcp:8080 tcp:8080 to migrate api to android without 10.0.2.2
export const apiHost =
  // Platform.OS ===
  // 'android' ? 'http://10.0.2.2:8080' :
  'http://localhost:8080';
export const apiHostWithVersion = apiHost + '/api/v1';
const blueWarn = msg => console.log('\x1b[36m', msg, '\x1b[0m');

console.error = data => {
  if (typeof data === 'string' && data.startsWith('VirtualizedLists should'))
    return;
  blueWarn(data);
};
