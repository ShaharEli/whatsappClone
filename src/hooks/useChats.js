import React, {useEffect, useState} from 'react';
import {getAllChats} from '../api/chat';

// add save chats to local storage to use without network
export const useChats = () => {
  const [loadingChats, setLoadingChats] = useState(true);
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(false);

  const fetchChats = async () => {
    setLoadingChats(true);
    const usersChats = await getAllChats();
    if (!usersChats) setError(true);
    else setChats(usersChats);
    setLoadingChats(false);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return {
    chats,
    loadingChats,
    refetchChats: fetchChats,
    setChats,
    chatError: error,
  };
};
