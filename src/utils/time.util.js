import moment from 'moment';
export const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DAY_IN_CHAT = 'D in MMMM YYYY';
const DAY_IN_CHATS = 'D.M.YYYY';
const LAST_CONNECTED_START = 'last seen ';

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
export const dateToFromNowDaily = myDate =>
  moment(myDate).calendar(null, {
    lastDay: '[Yesterday] ',
    nextWeek: DAY_IN_CHATS,
    sameDay: 'HH:mm',
    nextDay: '[Tomorrow]',
    lastWeek: DAY_IN_CHATS,
    sameElse: DAY_IN_CHATS,
  });

export const dateToFromNowToChat = myDate =>
  moment(myDate).calendar(null, {
    lastDay: '[Yesterday] ',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: DAY_IN_CHAT,
    lastWeek: DAY_IN_CHAT,
    sameElse: DAY_IN_CHAT,
  });

export const isDifferentDay = (day1, day2) =>
  !moment(day1).isSame(moment(day2), 'day');

export const calcLastConnected = date =>
  LAST_CONNECTED_START +
  moment(date).calendar(null, {
    lastDay: '[Yesterday at] HH:mm',
    sameDay: '[Today at] HH:mm',
    nextDay: '[Yesterday at] HH:mm',
    nextWeek: 'MM dd, YYYY',
    lastWeek: 'MM dd, YYYY',
    sameElse: 'MM dd, YYYY',
  });
