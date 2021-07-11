import moment from 'moment';
export const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
export const dateToFromNowDaily = myDate =>
  moment(myDate).calendar(null, {
    lastDay: '[Yesterday] ',
    nextWeek: 'D.M.YYYY',
    sameDay: 'hh:mm',
    nextDay: '[Tomorrow]',
    lastWeek: 'D.M.YYYY',
    sameElse: 'D.M.YYYY',
  });
