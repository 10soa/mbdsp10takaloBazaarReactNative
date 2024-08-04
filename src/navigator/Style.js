import {StyleSheet} from 'react-native';
import colors from '../constants/color';
export const style = StyleSheet.create({
  navigator: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 0,
    height: 60,
  },
  navImage: {
    width: 30,
    height: 30,
  },
  searchImage: {
    width: 33,
    height: 33,
  },
  navView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonContainer: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
  },
  centerIcon: {
    width: 30,
    height: 30,
  },
});
