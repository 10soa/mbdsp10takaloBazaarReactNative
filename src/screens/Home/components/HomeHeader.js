import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../constants/color';
import { scale } from 'react-native-size-matters';

const HomeHeader = ({ navigation, style }) => {
  const navigate = useNavigation();

  const goScanQR = async () => {
    navigate.navigate("QRCodeScannerComponent");
  };

  return (
    <View style={[Styles.container, style]}>
      <View>
        <Image
          source={require('../../../assets/img/logo-no-background.png')}
          resizeMode="contain"
        />
      </View>
      <View style={Styles.rightContainer}>
        <TouchableOpacity onPress={goScanQR}>
          <Image
            source={require('../../../assets/icons/qrcode.png')}
            resizeMode="contain"
            style={[Styles.iconScan, { tintColor: colors.textPrimary }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(15),
    paddingHorizontal: scale(15),
    justifyContent: 'space-between',
    height: scale(60),
    backgroundColor: colors.white,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconScan: {
    width: scale(25),
    height: scale(25),
    marginLeft: scale(15),
  },
  iconNotif: {
    width: scale(25),
    height: scale(25),
    marginLeft: scale(15),
  },
});

export default HomeHeader;
