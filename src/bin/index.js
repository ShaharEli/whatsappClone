import {Platform} from 'react-native';
export const isDev = true;
export const apiHost =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
export const apiHostWithVersion = apiHost + '/api/v1';
