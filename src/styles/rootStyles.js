import {StyleSheet} from 'react-native';
import {AVATAR_SIZE, MAX_HEIGHT, MAX_WIDTH} from '../utils';
import COLOR from './themes/generalColors';
export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  width: (w, add = 0) => ({width: MAX_WIDTH * w + add}),
  maxWidth: maxWidth => ({maxWidth}),
  height: (h, add = 0) => ({height: MAX_HEIGHT * h + add}),
  maxHeight: maxHeight => ({maxHeight}),
  bg: ({BG}) => ({backgroundColor: BG}),
  font: ({font}) => ({color: font}),
  fontSize: fontSize => ({fontSize}),
  flexGrow: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 8,
  },
  errorText: {
    color: COLOR.RED,
  },
  mutedText: {
    color: COLOR.GREY_LIGHT,
  },
  strong: {
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: 13,
  },
  disabled: {
    opacity: 0.3,
  },
  scaledImg: {
    transform: [{scale: 0.5}],
  },

  shadowBox: {
    shadowColor: COLOR.GREY_LIGHT,
    borderRadius: 2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 1,
    shadowOpacity: 0.3,
    elevation: 1.5,
  },
  aligncenter: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  alignCenter: {
    alignItems: 'center',
  },
  alignItemStart: {
    alignItems: 'flex-start',
  },
  alignItemEnd: {
    alignItems: 'flex-end',
  },
  alignSelfEnd: {
    alignSelf: 'flex-end',
  },
  alignSelfStart: {
    alignSelf: 'flex-start',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  p0: {padding: 5},
  p1: {padding: 10},
  p2: {padding: 15},
  p3: {padding: 20},
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE,
  },
  customAvatar: size => ({width: size, height: size, borderRadius: size}),
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flex4: {
    flex: 4,
  },
  flex5: {
    flex: 5,
  },
  ps0: {
    paddingStart: 0,
  },
  ps1: {
    paddingStart: 1,
  },
  ps2: {
    paddingStart: 2,
  },
  ps3: {
    paddingStart: 3,
  },
  ps4: {
    paddingStart: 4,
  },
  ps5: {
    paddingStart: 5,
  },
  pe0: {
    paddingEnd: 0,
  },
  pe1: {
    paddingEnd: 1,
  },
  pe2: {
    paddingEnd: 2,
  },
  pe3: {
    paddingEnd: 3,
  },
  pe4: {
    paddingEnd: 4,
  },
  pe5: {
    paddingEnd: 5,
  },
  pt0: {
    paddingTop: 0,
  },
  pt1: {
    paddingTop: 2.5,
  },
  pt2: {
    paddingTop: 5,
  },
  pt3: {
    paddingTop: 10,
  },
  pt4: {
    paddingTop: 15,
  },
  pt5: {
    paddingTop: 20,
  },
  pb0: {
    paddingBottom: 0,
  },
  pb1: {
    paddingBottom: 2.5,
  },
  pb2: {
    paddingBottom: 5,
  },
  pb3: {
    paddingBottom: 10,
  },
  pb4: {
    paddingBottom: 15,
  },
  pb5: {
    paddingBottom: 20,
  },
  pb6: {
    paddingBottom: 25,
  },
  pb7: {
    paddingBottom: 30,
  },
  py1: {
    paddingVertical: 2.5,
  },
  py2: {
    paddingVertical: 5,
  },
  py3: {
    paddingVertical: 10,
  },
  py4: {
    paddingVertical: 15,
  },
  py5: {
    paddingVertical: 20,
  },
  px0: {
    paddingHorizontal: 0,
  },
  px1: {
    paddingHorizontal: 2.5,
  },
  px2: {
    paddingHorizontal: 5,
  },
  px3: {
    paddingHorizontal: 10,
  },
  px4: {
    paddingHorizontal: 15,
  },
  px5: {
    paddingHorizontal: 20,
  },
  mt1: {
    marginTop: 2.5,
  },
  mt2: {
    marginTop: 5,
  },
  mt3: {
    marginTop: 10,
  },
  mt4: {
    marginTop: 15,
  },
  mt5: {
    marginTop: 20,
  },
  mt6: {
    marginTop: 25,
  },
  mt7: {
    marginTop: 30,
  },
  mt9: {
    marginTop: 35,
  },
  mt10: {
    marginTop: 40,
  },
  mb1: {
    marginBottom: 2.5,
  },
  mb2: {
    marginBottom: 5,
  },
  mb3: {
    marginBottom: 10,
  },
  mb4: {
    marginBottom: 15,
  },
  mb5: {
    marginBottom: 20,
  },
  mb6: {
    marginTop: 25,
  },
  mb7: {
    marginTop: 30,
  },
  me1: {
    marginEnd: 2.5,
  },
  me2: {
    marginEnd: 5,
  },
  me3: {
    marginEnd: 10,
  },
  me4: {
    marginEnd: 15,
  },
  me5: {
    marginEnd: 20,
  },
  ms1: {
    marginStart: 2.5,
  },
  ms2: {
    marginStart: 5,
  },
  ms3: {
    marginStart: 10,
  },
  ms4: {
    marginStart: 15,
  },
  ms5: {
    marginStart: 20,
  },
  my1: {
    marginVertical: 2.5,
  },
  my2: {
    marginVertical: 5,
  },
  my3: {
    marginVertical: 10,
  },
  my4: {
    marginVertical: 15,
  },
  my5: {
    marginVertical: 20,
  },
  mx1: {
    marginHorizontal: 2.5,
  },
  mx2: {
    marginHorizontal: 5,
  },
  mx3: {
    marginHorizontal: 10,
  },
  mx4: {
    marginHorizontal: 15,
  },
  mx5: {
    marginHorizontal: 20,
  },
  hidden: {
    display: 'none',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  fontSizeSmall: {
    fontSize: 12,
  },
  fontSizeBody: {
    fontSize: 15,
  },
  fontSize16: {
    fontSize: 16,
  },
  textColor: color => ({
    color,
  }),
  backgroundColor: ({BG: backgroundColor}) => ({
    backgroundColor,
  }),
  flex: flex => ({
    flex,
  }),
  box: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
