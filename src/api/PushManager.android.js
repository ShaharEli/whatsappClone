/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

import messaging from '@react-native-firebase/messaging';
import {AppState, Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {
  autoBind,
  LOCAL_NOTIFICATION_CHANNEL_ID,
  logger,
  navigate,
  getRouteName,
  navigationRef,
  delay,
} from '../utils';
class PushManager {
  pushToken = null;

  constructor() {
    autoBind(this);
    if (Platform.OS !== 'android') return;
    messaging()
      .getToken()
      .then(token => {
        this.pushToken = token;
      })
      .catch(({message}) => {
        logger.warn(message);
      });
    this.pushNotificationConfigure();
    this.initBg();
    this.initLocalChannels();
  }

  pushNotificationConfigure() {
    PushNotification.configure({
      requestPermissions: true,
      onNotification: notification => this.onNotification(notification),
    });
  }
  async onNotification(notification, fromFireBase) {
    let channelId, tag;
    if (fromFireBase) {
      channelId = notification.data.chatId;
      tag = notification.data.type;
    } else {
      channelId = notification.channelId;
      tag = notification.tag;
    }
    switch (tag) {
      case 'newMessage':
        if (
          (navigationRef.current?.params?._id ||
            navigationRef.current?.params?.chat?._id) === notification
        ) {
          return fromFireBase ? null : notification.finish();
        } else {
          AppState.addEventListener('change', state =>
            this.navigateAndRemoveListener(state, 'Chat', {
              chatId: channelId,
              fromNotification: true,
            }),
          );
          if (fromFireBase) return;
          PushNotification.getDeliveredNotifications(notifications => {
            PushNotification.removeDeliveredNotifications(
              notifications
                .filter(notification => notification.group === channelId)
                .map(({identifier}) => identifier),
            );
          });
          return notification.finish();
        }
    }
  }

  async navigateAndRemoveListener(state, to, params) {
    if (state === 'active') {
      if (!navigationRef.current) {
        await delay(1000);
        return this.navigateAndRemoveListener(state, to, params);
      }
      navigate(to, params);
      AppState.removeEventListener('change', this.navigateAndRemoveListener);
    }
  }

  initLocalChannels() {
    PushNotification.createChannel({
      playSound: true,
      channelId: LOCAL_NOTIFICATION_CHANNEL_ID,
      channelName: 'Local notification channel',
    });
  }

  createChannel(id) {
    PushNotification.createChannel({
      playSound: true,
      channelId: id,
      channelName: id,
    });
  }

  async showLocalNotification({message, title, channelId, tag}) {
    try {
      PushNotification.localNotification({
        channelId,
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
        message, // (required)
        visibility: 'public',
        priority: 'max',
        title,
        when: true,
        tag,
        group: channelId,
      });
    } catch (e) {
      logger.error(e);
    }
  }
  async getPushToken() {
    if (this.pushToken === null) this.pushToken = await messaging().getToken();
    return this.pushToken;
  }

  async initBg() {
    const enabled = await messaging().requestPermission();
    messaging().onNotificationOpenedApp(n => logger.warn(n));
    messaging().onMessage(({notification: {title, body: message}, data}) => {
      switch (data.type) {
        case 'newMessage':
          const {chatId} = data;
          this.createChannel(chatId);
          this.showLocalNotification({
            title,
            message,
            channelId: chatId,
            tag: 'newMessage',
          });
          return;
      }
    });
    if (enabled) {
      messaging().setBackgroundMessageHandler(async message =>
        this.onNotification(message, true),
      );
    }
  }
}

export default new PushManager();
