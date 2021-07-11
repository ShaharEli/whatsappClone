export const varToString = varible => Object.keys(varible)[0];

export const pickRandomListValue = list =>
  list[Math.floor(Math.random() * list.length)];
