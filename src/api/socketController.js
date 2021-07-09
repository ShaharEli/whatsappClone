import {apiHost} from '../bin';
import {getItem} from '../utils';
import {getAccessToken} from './auth';
import socketIOClient from 'socket.io-client';

export class SocketController {
  constructor({setChats, setNotifications}) {
    this.connect();
    this.setChats = setChats;
    this.setNotifications = setNotifications;
  }

  async initListeners() {
    this.socket.on('connect_error', this.onConnectionError);
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
}
