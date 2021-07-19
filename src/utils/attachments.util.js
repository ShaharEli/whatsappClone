import ImagePicker from 'react-native-image-crop-picker';

export const attachments = (navigation, setMedia, setMsgType) => [
  {
    label: 'Gallery',
    icon: 'image',
    darkColor: '#fa12f1',
    lightColor: '#ff56f6',
    cb: () =>
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64: true,
      })
        .then(image => {
          setMedia(`data:${image.mime};base64,${image.data}`);
          setMsgType('image');
        })
        .catch(() => {}),
  },
  {
    label: 'Camera',
    icon: 'camera',
    darkColor: '#e32c70',
    lightColor: '#e84c70',
    cb: () =>
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64: true,
      })
        .then(image => {
          setMedia(`data:${image.mime};base64,${image.data}`);
          setMsgType('image');
        })
        .catch(() => {}),
  },
  {
    label: 'Location',
    icon: 'location-pin',
    lightColor: '#1c4ce8',
    darkColor: '#1c2ae8',
    cb: () => navigation.navigate('Location'),
  },
  {
    label: 'Contact',
    lightColor: '#4c4ce8',
    darkColor: '#4c2ae8',
    icon: 'user',
    cb: () => navigation.navigate('Contacts'), //TODO add params to collect contacts
  },
];
