import AsyncStorage from '@react-native-async-storage/async-storage';
import {setItem, getItem} from './storage.util';
import {DAY_IN_MS} from './time.util';
export const withCache = async (val, cb, time = DAY_IN_MS) => {
  try {
    const AsyncStorageKeys = await AsyncStorage.getAllKeys();
    if (!AsyncStorageKeys.includes(val)) {
      const result = await cb();
      await setItem(val, {data: result, timeStamp: new Date().valueOf()});
      return result;
    }
    const {data, timeStamp} = await getItem(val);
    const timediff = new Date().valueOf() - timeStamp;
    if (timediff > time) {
      const result = await cb();
      await setItem(val, {data: result, timeStamp: new Date().valueOf()});
      return result;
    } else {
      setTimeout(async () => {
        const result = await cb();
        await setItem(val, {data: result, timeStamp: new Date().valueOf()});
      }, time - timediff);
      return data;
    }
  } catch (e) {
    const result = await cb();
    await setItem(val, {data: result, timeStamp: new Date().valueOf()});
    return result;
  }
};
