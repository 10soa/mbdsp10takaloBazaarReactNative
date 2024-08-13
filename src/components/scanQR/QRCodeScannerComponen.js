import React, { useEffect } from 'react';
import { View, Text, PermissionsAndroid, Platform } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useNavigation } from '@react-navigation/native';

const requestCameraPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permission de la caméra',
          message: 'L\'application a besoin d\'accéder à votre caméra pour scanner les QR codes',
          buttonNeutral: 'Plus tard',
          buttonNegative: 'Annuler',
          buttonPositive: 'OK',
        }
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
    <QRCodeScanner
      onRead={(e) => {
        navigation.navigate('Details', {
            objectId: e.data,
        });
      }}
      reactivate={true}
      topContent={<Text>Scanner un QR Code</Text>}
      bottomContent={<Text>Placez le QR Code dans la zone de scan</Text>}
      showMarker={true}
      cameraStyle={{ 
        height: '100%',
      }}
      markerStyle={{ borderColor: '#fff', borderRadius: 50}}
    />
  );
};

export default QRCodeScannerComponent;
