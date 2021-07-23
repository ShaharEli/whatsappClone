import React, {createContext, useEffect, useContext, useState} from 'react';
import {AppState} from 'react-native';
import {SocketController} from '../api/socketController';
import {useChats} from '../hooks';

export const DataContext = createContext();
let socketController;
export default function DataProvider({children}) {
  const {loadingChats, refetchChats, chats, setChats, chatError} = useChats();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socketController = new SocketController({
      setChats,
      setNotifications,
    });

    AppState.addEventListener('change', state => {
      if (
        ['inactive', 'background'].includes(state) &&
        socketController.socket
      ) {
        socketController.disconnect();
      }
      if (state === 'active' && !socketController.socket) {
        socketController.connect();
      }
    });

    return () => {
      if (!socketController.socket) return;
      socketController.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DataContext.Provider
      value={{
        socketController,
        notifications,
        setNotifications,
        chats,
        refetchChats,
        loadingChats,
        setChats,
        chatError,
      }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const {
    socketController,
    notifications,
    setNotifications,
    chats,
    refetchChats,
    loadingChats,
    setChats,
    chatError,
  } = useContext(DataContext);
  return {
    socketController,
    notifications,
    setNotifications,
    chats,
    refetchChats,
    loadingChats,
    chatError,
    setChats,
  };
};
