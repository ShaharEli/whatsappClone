import RSAKey from 'react-native-rsa';

export const rsa = new RSAKey();
export const generateRSAKey = () => {
  const bits = 1024;
  const exponent = '10001'; // must be a string
  rsa.generate(bits, exponent);
  const privateKey = rsa.getPrivateString();
  const publicKey = rsa.getPublicString();
  return [privateKey, publicKey];
};

// this whole mess is because RSA can only encrypt strings less than 117 characters long
export const splitterForRSA = message => {
  const messageChunks = [];
  let tracker = 0;
  while (tracker < message.length) {
    messageChunks.push(message.slice(tracker, tracker + 117));
    tracker += 117;
  }
  return messageChunks;
};
