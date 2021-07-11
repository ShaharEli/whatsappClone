import {assets} from './assets.util';

export const getNameAndImageFromChat = (
  {type, image, participants, name},
  userId,
) => {
  let chatName, chatImage, otherParticipant;
  if (type === 'private')
    otherParticipant = participants.filter(({_id}) => _id !== userId)[0];
  if (name) chatName = name;
  else {
    chatName = otherParticipant.firstName + ' ' + otherParticipant.lastName;
  }
  if (image) chatImage = {uri: image};
  else {
    if (otherParticipant?.avatar) chatImage = {uri: otherParticipant?.avatar};
    else chatImage = assets.profilePlaceholder;
  }
  return {chatImage, chatName};
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
