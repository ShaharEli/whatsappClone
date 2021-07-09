import React, {createContext, useEffect} from 'react';
import {AppState} from 'react-native';
import socketIOClient from 'socket.io-client';
import {getAccessToken} from '../api/auth';
import {apiHost} from '../bin';
import {getItem, logger} from '../utils';

export const RealTimeDataContext = createContext();

let socket;

const socketHandler = async () => {
  socket = socketIOClient(apiHost, {
    auth: {token: await getItem('accessToken')},
  });
  socket.on('connect_error', async err => {
    logger.error(err.message);
    const token = await getAccessToken();
    socket = socketIOClient(apiHost, {
      auth: {token},
    });
  });
};

export default function RealTimeDataProvider({children}) {
  useEffect(() => {
    socketHandler();
    AppState.addEventListener('change', state => {
      if (['inactive', 'background'].includes(state) && socket) {
        socket.disconnect();
        socket = null;
      }
      if (state === 'active' && !socket) {
        socketHandler();
      }
    });

    return () => {
      if (!socket) return;
      socket.disconnect();
      socket = null;
    };
  }, []);

  return (
    <RealTimeDataContext.Provider value={{socket}}>
      {children}
    </RealTimeDataContext.Provider>
  );
}

export const useRTD = () => {
  return {socket};
};
