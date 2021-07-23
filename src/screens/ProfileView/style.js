import {StyleSheet} from 'react-native';
import {isIphoneWithNotch, MAX_WIDTH} from '../../utils';
const IMAGE_HEIGHT = MAX_WIDTH / 2;

const BLOCK_HEIGHT = 50;
export default StyleSheet.create({
  backArrow: {
    marginLeft: 10,
    top: isIphoneWithNotch() ? 60 : 20,
    zIndex: 1010,
    position: 'absolute',
  },
  image: {
    width: IMAGE_HEIGHT * 2,
    height: IMAGE_HEIGHT,
    resizeMode: 'contain',
  },

  name: (rootStyles, colors) => ({
    ...rootStyles.font(colors),
    ...rootStyles.fontSize(20),
  }),
  nameContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    position: 'absolute',
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 20,
    zIndex: 1000,
  },
  block: colors => ({
    backgroundColor: colors.LIGHT_BG,
    padding: 10,
    height: BLOCK_HEIGHT,
    justifyContent: 'center',
  }),
  descColor: colors => ({
    color: colors.GREEN_PRIMARY,
  }),
});
