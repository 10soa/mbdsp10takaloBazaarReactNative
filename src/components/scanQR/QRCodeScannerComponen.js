import React, { useEffect } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import colors from '../../constants/color';

const requestCameraPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permission de la caméra',
          message:
            "L'application a besoin d'accéder à votre caméra pour scanner les QR codes",
          buttonNeutral: 'Plus tard',
          buttonNegative: 'Annuler',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const QRCodeScannerComponent = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkPermission = async () => {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        navigation.goBack();
      }
    };

    checkPermission();
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: scale(28),
          zIndex: 1000,
          padding: 10,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onPress={() => navigation.goBack()}>
        <Text
          style={{
            color: '#fff',
            fontFamily: 'Asul',
            fontSize: scale(15),
            textAlign: 'center',
          }}>
          Retour
        </Text>
      </TouchableOpacity>
      <View
        style={{
          zIndex: 1000,
          padding: scale(20),
          backgroundColor: colors.darkGrey,
        }}>
        <Text
          style={{
            color: '#fff',
            fontFamily: 'Asul',
            fontSize: scale(15),
            textAlign: 'center',
          }}>
          Scanner un code QR provenant de l'application mobile TakaloBazaar'ô
        </Text>
      </View>

      <QRCodeScanner
        onRead={e => {
          navigation.navigate('Details', {
            objectId: e.data,
          });
        }}
        reactivate={true}
        topContent={<Text>Scanner un QR Code</Text>}
        bottomContent={<Text>Placez le QR Code dans la zone de scan</Text>}
        showMarker={true}
        cameraStyle={{ height: '100%' }}
        markerStyle={{ borderColor: '#fff', borderRadius: 50 }}
      />
    </SafeAreaView>
  );
};

export default QRCodeScannerComponent;
