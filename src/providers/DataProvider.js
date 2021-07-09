import React, {createContext, useEffect, useContext} from 'react';
import {AppState} from 'react-native';
import {SocketController} from '../api/socketController';
import {useChats} from '../hooks';
import {getItem, logger} from '../utils';

export const DataContext = createContext();

const socketManager = new SocketController();

export default function DataProvider({children}) {
  const {loadingChats, refetchChats, chats, setChats} = useChats();

  useEffect(() => {
    AppState.addEventListener('change', state => {
      if (['inactive', 'background'].includes(state) && socketManager.socket) {
        socketManager.disconnect();
      }
      if (state === 'active' && !socketManager.socket) {
        socketManager.connect();
      }
    });

    return () => {
      if (!socketManager.socket) return;
      socketManager.disconnect();
    };
  }, []);

  return (
    <DataContext.Provider
      value={{socketManager, chats, refetchChats, loadingChats, setChats}}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const {socketManager, chats, refetchChats, loadingChats, setChats} =
    useContext(DataContext);
  return {socketManager, chats, refetchChats, loadingChats, setChats};
};
