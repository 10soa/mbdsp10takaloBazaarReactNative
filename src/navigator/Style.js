import {StyleSheet} from 'react-native';
import colors from '../constants/color';
export const style = StyleSheet.create({
  navigator: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 15,
    backgroundColor: colors.white,
    elevation: 0,
    height: 50,
  },
  navImage: {
    width: 27,
    height: 27,
  },
  navView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonContainer: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 3,
  },
  centerIcon: {
    width: 27,
    height: 27,
  },
});
