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
