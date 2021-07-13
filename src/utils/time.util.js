import moment from 'moment';
export const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
export const dateToFromNowDaily = myDate =>
  moment(myDate).calendar(null, {
    lastDay: '[Yesterday] ',
    nextWeek: 'D.M.YYYY',
    sameDay: 'HH:mm',
    nextDay: '[Tomorrow]',
    lastWeek: 'D.M.YYYY',
    sameElse: 'D.M.YYYY',
  });

export const dateToFromNowToChat = myDate =>
  moment(myDate).calendar(null, {
    lastDay: '[Yesterday] ',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'd in MMMM YYYY',
    lastWeek: 'd in MMMM YYYY',
    sameElse: 'd in MMMM YYYY',
  });

export const isDifferentDay = (day1, day2) =>
  !moment(day1).isSame(moment(day2), 'day');
