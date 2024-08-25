import React, { useEffect } from 'react';
import { View, Text, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
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
    <View style={{ flex: 1 }}>
    <TouchableOpacity
      style={{
        position: 'absolute',
        top: 40, // Adjust the position as needed
        left: 20,
        zIndex: 1000, // Ensure the button is above the scanner
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        borderRadius: 5,
      }}
      onPress={() => navigation.goBack()}
    >
      <Text style={{ color: '#fff' }}>Retour</Text>
    </TouchableOpacity>

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
      cameraStyle={{ height: '100%' }}
      markerStyle={{ borderColor: '#fff', borderRadius: 50 }}
    />
  </View>
  );
};

export default QRCodeScannerComponent;
