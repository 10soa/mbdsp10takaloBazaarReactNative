import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../constants/color';

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
        <Image
          source={require('../../../assets/icons/Notification.png')}
          resizeMode="contain"
          style={[Styles.iconNotif, { tintColor: colors.textPrimary }]}
        />
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 60,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconScan: {
    width: 25,
    height: 25,
    marginLeft: 15,
  },
  iconNotif: {
    width: 25,
    height: 25,
    marginLeft: 15,
  },
});

export default HomeHeader;
