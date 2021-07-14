import {Platform} from 'react-native';
import {assets} from './assets.util';

export const getChatDataFormatted = (
  {type, image, participants, name},
  userId,
  returnJustActiveState,
) => {
  let chatName, chatImage, otherParticipant, isActive, lastConnected;
  if (type === 'private' || returnJustActiveState) {
    otherParticipant = participants.filter(({_id}) => _id !== userId)[0];
    isActive = otherParticipant.isActive;
    lastConnected = otherParticipant.lastConnected;
  }
  if (returnJustActiveState)
    return {
      isActive,
      lastConnected,
    };
  if (name) chatName = name;
  else {
    chatName = otherParticipant.firstName + ' ' + otherParticipant.lastName;
  }
  if (image) chatImage = {uri: image};
  else {
    if (otherParticipant?.avatar) chatImage = {uri: otherParticipant?.avatar};
    else chatImage = assets.profilePlaceholder;
  }
  return {chatImage, chatName, isActive, lastConnected};
};

export const checkIfChatExists = (chats, {_id: ourId}, {_id: contactID}) => {
  for (let chat of chats) {
    if (chat.type === 'private') {
      if (
        chat.participants.reduce(
          (acc, curr) =>
            acc +
            ([ourId, contactID].find(elm => elm === curr || elm === curr?._id)
              ? 1
              : 0),
          0,
        ) === 2
      ) {
        return chat;
      }
    }
  }
  return false;
};

export const changeConnectedState = (setChats, chatID, user, lastConnected) => {
  setChats(prev => {
    const chatIndex = prev.findIndex(({_id}) => _id === chatID);
    return prev.map((chat, index) =>
      index === chatIndex
        ? {
            ...chat,
            participants: chat.participants.map(p =>
              p._id === user
                ? {
                    ...p,
                    lastConnected: lastConnected
                      ? lastConnected
                      : p.lastConnected,
                    isActive: !lastConnected,
                  }
                : p,
            ),
          }
        : chat,
    );
  });
};

export const handleSeen = (
  {userId, chatId},
  setChats,
  user,
  chat,
  setMessages,
) => {
  if (setMessages) {
    const inTheSameChat = chat?._id === chatId;
    if (inTheSameChat) {
      setMessages(prev =>
        prev.map(m => {
          return {
            ...m,
            seenBy: [...new Set([...m.seenBy, userId, user?._id])],
          };
        }),
      );
    }
  }
  setChats(prev => {
    const chatIndex = prev.findIndex(({_id}) => _id === chatId);
    if (chatIndex === -1) return prev;
    return prev.map((c, i) => {
      if (i !== chatIndex) return c;
      const {lastMessage} = c;
      if (!(lastMessage?.by || lastMessage?.by?._id) === user._id) return c;
      return {
        ...c,
        lastMessage: {
          ...c.lastMessage,
          seenBy: [...new Set([...c.lastMessage.seenBy, userId, user?._id])],
        },
      };
    });
  });
};

export const handleNewMessage = (
  {message, returnedChat},
  chats,
  chat,
  setMessages,
  socketController,
  setChats,
  user,
) => {
  const chatIndex = chats.findIndex(({_id}) => _id === returnedChat._id);
  const inTheSameChat = chat._id === returnedChat._id;
  if (inTheSameChat) {
    setMessages(prev => [message, ...prev]);
    socketController.emit('seen', {
      chatId: returnedChat._id,
      participants: returnedChat.participants.map(({socketId}) => socketId),
    });
  }
  //TODO notification
  if (chatIndex === -1) {
    setChats(prev => [
      ...prev,
      {...returnedChat, unreadMessages: 1, lastMessage: message},
    ]);
  } else {
    setChats(prev =>
      prev.map((chat, index) => {
        if (index !== chatIndex) return chat;
        const {unreadMessages = 0} = chat;
        return {
          ...chat,
          unreadMessages: inTheSameChat ? unreadMessages : unreadMessages + 1,
          lastMessage: inTheSameChat
            ? {...message, seenBy: [...message.seenBy, user._id]}
            : message,
        };
      }),
    );
  }
};

export const handleNewMessageInChats = ({message, returnedChat}, setChats) => {
  setChats(prev => {
    const chatIndex = prev.findIndex(({_id}) => _id === returnedChat._id);
    if (chatIndex === -1) {
      return [
        ...prev,
        {...returnedChat, unreadMessages: 1, lastMessage: message},
      ];
    } else {
      return prev.map((chat, index) => {
        if (index !== chatIndex) return chat;
        const {unreadMessages = 0} = chat;
        return {
          ...chat,
          unreadMessages: unreadMessages + 1,
          lastMessage: message,
        };
      });
    }
  });
};
