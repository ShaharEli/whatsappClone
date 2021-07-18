/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {logger} from '../utils';

class PushManager {
  pushToken = null;

  constructor() {
    if (Platform.OS !== 'android') return;
    messaging()
      .getToken()
      .then(token => {
        this.pushToken = token;
      })
      .catch(({message}) => {
        logger.warn(message);
      });
    this.initBg();
  }

  async getPushToken() {
    if (this.pushToken === null) this.pushToken = await messaging().getToken();
    return this.pushToken;
  }

  async initBg() {
    const enabled = await messaging().requestPermission();
    messaging().onMessage(d => console.log(d));
    if (enabled) {
      messaging().setBackgroundMessageHandler(message => {
        console.log('message', message);
      });
    }
  }
}

export default new PushManager();
