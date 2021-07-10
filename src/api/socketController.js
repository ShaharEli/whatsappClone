import {apiHost} from '../bin';
import {getItem, autoBind} from '../utils';
import {getAccessToken} from './auth';
import socketIOClient from 'socket.io-client';

export class SocketController {
  constructor({setChats, setNotifications}) {
    autoBind(this);
    this.connect();
    this.setChats = setChats;
    this.setNotifications = setNotifications;
  }

  async initListeners() {
    this.socket.on('connect_error', this.onConnectionError);
    this.socket.on('type', this.onType);
  }

  emit(event, data = {}, cb = () => {}) {
    this.socket.emit(event, data, cb);
  }

  async connect(token) {
    this.socket = socketIOClient(apiHost, {
      auth: {token: token ? token : await getItem('accessToken')},
    });
    this.initListeners();
  }

  async disconnect() {
    await this.socket.disconnect();
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
        const userThatTypes = chat.participants.find(
          user => user._id === userId,
        );
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
