import {apiHost} from '../bin';
import {getItem, autoBind} from '../utils';
import {getAccessToken} from './auth';
import socketIOClient from 'socket.io-client';
import PushManager from './PushManager';
import {Platform} from 'react-native';

export class SocketController {
  constructor({setChats, setNotifications}) {
    autoBind(this);
    this.connect();
    this.currentChat = null;
    this.setChats = setChats;
    this.setNotifications = setNotifications;
    this.isReady = false;
  }

  async initListeners() {
    if (!this.socket) return;
    this.socket.on('connect_error', this.onConnectionError);
    this.socket.on('type', this.onType);
    // this.socket.on('chatChanged', this.onChatChanged);
  }

  // onChatChanged(chat) {
  //   this.setChats(prev => prev.map(c => (c._id === chat?._id ? chat : c)));
  //   this.setNotifications(prev => ({...prev, chatEdited: chat}));
  // }

  subscribe(event, cb) {
    if (!this.socket) return;
    this.unsubscribe(event);
    this.socket.on(event, cb);
  }

  unsubscribe(event) {
    if (!this.socket) return;
    if (Array.isArray(event)) event.forEach(e => this.socket.off(e));
    else this.socket.off(event);
  }

  emit(event, data = {}, cb = () => {}) {
    if (!this.socket) return;
    this.socket.emit(event, data, cb);
  }

  joinChat(chatId, participants) {
    this.currentChat = chatId;
    this.emit('joinedChat', {chatId, participants});
  }

  leaveChat() {
    this.emit('leftChat', {chatId: this.currentChat});
    this.currentChat = null;
  }

  async connect(token) {
    this.socket = socketIOClient(apiHost, {
      auth: {
        token: token ? token : await getItem('accessToken'),
        firebaseToken:
          Platform.OS === 'android' ? await PushManager.getPushToken() : null,
      },
    });
    this.isReady = true;
    this.initListeners();
  }

  disconnect() {
    if (this.currentChat) {
      this.leaveChat();
    }
    this.socket.disconnect();
    this.socket = null;
  }

  async onConnectionError(err) {
    if (err.message === 'not authorized') {
      const token = await getAccessToken();
      this.connect(token);
    } else {
      await new Promise(resolve =>
        setTimeout(async () => {
          await this.connect();
          resolve();
        }, 60 * 1000),
      );
    }
  }

  onType({chatId, userId, isTyping}) {
    if (!chatId || !userId) return;
    this.setChats(prev =>
      prev.map(chat => {
        if (chat._id !== chatId) return chat;
        const updatedChat = {...chat};
        const userThatTypes = {
          ...chat.participants.find(user => user._id === userId),
        };
        delete userThatTypes.avatar;
        if (Array.isArray(updatedChat?.usersTyping)) {
          const typingUserIndex = updatedChat.usersTyping.findIndex(
            user => user._id === userId,
          );
          if (isTyping) {
            if (typingUserIndex === -1) {
              updatedChat.usersTyping.push(userThatTypes);
            }
          } else {
            if (typingUserIndex > -1) {
              updatedChat.usersTyping.splice(typingUserIndex, 1);
            }
          }
        } else {
          if (isTyping) {
            updatedChat.usersTyping = [userThatTypes];
          }
        }
        return updatedChat;
      }),
    );
  }
}
