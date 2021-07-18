/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {autoBind, LOCAL_NOTIFICATION_CHANNEL_ID, logger} from '../utils';

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

  addNavigation(navigation, route) {
    this.navigation = navigation;
    this.route = route;
  }

  pushNotificationConfigure() {
    PushNotification.configure({
      requestPermissions: true,
      onNotification: notification => {
        console.log(this.route, notification);
        const {channelId, tag} = notification;
        switch (tag) {
          case 'newMessage':
            if (
              (this?.route?.params?._id || this?.route?.params?.chat?._id) ===
              notification
            ) {
              return notification.finish();
            } else {
              this.navigation?.navigate('Chat', {
                chatId: channelId,
                fromNotification: true,
              });
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
      },
    });
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
      messaging().setBackgroundMessageHandler(message => {
        console.log('message', message);
      });
    }
  }
}

export default new PushManager();
