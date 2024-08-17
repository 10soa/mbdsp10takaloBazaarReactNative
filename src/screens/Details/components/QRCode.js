import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import colors from '../../../constants/color';

const QRCodeGen = ({ id, objectName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{objectName}</Text>
      <QRCode
        value={id.toString()}
        size={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily : 'Asul-Bold',
    marginBottom: 20,
    textAlign : 'center',
    color: colors.darkGrey
  },
});

export default QRCodeGen;
