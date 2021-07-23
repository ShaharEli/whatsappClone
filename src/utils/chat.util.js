import {Platform} from 'react-native';
import {editChat} from '../api';
import {assets} from './assets.util';
import {pickRandomListValue} from './formatters.util';

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
    else {
      chatImage =
        type === 'group' ? assets.groupPlaceholder : assets.profilePlaceholder;
    }
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

export const sortChat = ({lastMessage}, {lastMessage: lastMessage2}) => {
  const date1 =
    lastMessage?.createdAt && new Date(lastMessage?.createdAt).valueOf();

  const date2 =
    lastMessage2?.createdAt && new Date(lastMessage2?.createdAt).valueOf();
  if (!date1) return 1;
  if (!date2) return 0;
  return date2 - date1;
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
      if (!lastMessage) return c;
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

export const getType = (setCurrentlyType, usersTyping, returnFalse) => {
  let res;
  setCurrentlyType(prev => {
    if (usersTyping.length === 0) {
      res = returnFalse ? false : {};
      return res;
    }
    if (usersTyping.length > 1) {
      res = pickRandomListValue(
        usersTyping.filter(currUser => currUser._id !== prev._id),
      );
      return res;
    } else {
      res = usersTyping[0];
      return res;
    }
  });
  return res;
};

export const getOtherParticipant = ({participants}, {_id}) =>
  participants.find(participant => participant._id !== _id);

export const isAdmin = (chat, userToCheck) => {
  if (!chat || chat?.type !== 'group' || !chat?.name || !chat?.participants)
    return false;
  return !!chat?.admins?.find(
    admin => admin?._id === userToCheck._id || admin === userToCheck._id,
  );
};

export const isMainAdmin = (chat, userToCheck) => {
  if (!chat || chat?.type !== 'group' || !chat?.name || !chat?.participants)
    return false;
  return chat?.mainAdmin === userToCheck._id;
};

export const updateChat = async (chat, setChats, payload, field) => {
  const newChat = await editChat(chat?._id, payload);
  if (newChat) {
    setChats(prev => {
      return prev.map(c => {
        if (c._id === newChat?._id) {
          return {
            ...c,
            [field]: newChat[field],
          };
        }
        return c;
      });
    });
    return newChat;
  }
};
