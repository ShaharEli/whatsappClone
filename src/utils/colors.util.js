import {getItem, setItem} from './storage.util';

const getRandomColor = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const generateColor = chat => {
  let color;
  while (true) {
    color = getRandomColor();
    const isColorUsed =
      Object.keys(chat)
        .map(key => chat[key])
        .findIndex(usedColor => color === usedColor) !== -1;
    if (!isColorUsed) return color;
  }
};

export const getColors = async ({participants, _id}) => {
  const key = `colors@${_id}`;
  let prevColors = await getItem(key);
  if (prevColors) {
    prevColors = JSON.parse(prevColors);
  } else {
    prevColors = {};
  }
  const keys = Object.keys(prevColors);
  let changed = false;
  if (keys.length !== participants.length) {
    participants.forEach(p => {
      const id = p?._id ? p._id : p;
      if (prevColors[id]) return;
      else {
        changed = true;
        const newColor = generateColor(prevColors);
        prevColors[id] = newColor;
      }
    });
  }
  if (changed) setItem(key, prevColors);
  return prevColors;
};
