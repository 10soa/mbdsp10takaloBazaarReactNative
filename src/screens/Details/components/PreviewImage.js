import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import colors from '../../../constants/color';
import QRCodeGen from './QRCode';
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';
import {captureRef} from 'react-native-view-shot';

const PreviewImage = ({
  image,
  isOwner,
  style,
  idObject,
  objectName,
  removeObject,
  status,
  repostObject,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const qrCodeRef = useRef();
  const navigation = useNavigation();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const goEditPage = () => {
    if (idObject) {
      navigation.navigate('UpdateObject', {idObject: idObject});
    }
  };

  const saveQrToDisk = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permission de sauvegarde',
            message:
              "L'application a besoin de votre permission pour sauvegarder les QR codes",
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission refusée',
            'Vous devez accorder la permission pour sauvegarder le QR code',
          );
          return;
        }
      }
      const uri = await captureRef(qrCodeRef, {
        format: 'png',
        quality: 1.0,
      });

      const path = `${
        RNFS.PicturesDirectoryPath
      }/${objectName}_qr_${Date.now()}.png`;
      await RNFS.moveFile(uri, path);
      Alert.alert('Succès', `QR code sauvegardé dans ${path}`);
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la sauvegarde du QR code',
      );
    }
  };

  return (
    <View style={style}>
      <Image
        source={{
          uri: image,
        }}
        resizeMode="contain"
        style={styles.image}
      />
      {isOwner && (
        <View style={styles.isOwner}>
          <TouchableOpacity style={styles.remove} onPress={goEditPage}>
            <Image
              source={require('../../../assets/icons/Edit.png')}
              resizeMode="contain"
              style={{width: 30, height: 30, tintColor: colors.black}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.remove}
            onPress={status == 'Removed' ? repostObject : removeObject}>
            <Image
              source={
                status == 'Removed'
                  ? require('../../../assets/icons/Eye.png')
                  : require('../../../assets/icons/Hide.png')
              }
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
                tintColor: status == 'Removed' ? colors.secondary : colors.error,
              }}
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.buttons}>
        {status != 'Removed' && (
          <TouchableOpacity style={styles.remove} onPress={toggleModal}>
            <Image
              source={require('../../../assets/icons/Share1.png')}
              resizeMode="contain"
              style={{width: 30, height: 30, tintColor: colors.black}}
            />
          </TouchableOpacity>
        )}
        {!isOwner && (
          <TouchableOpacity style={styles.remove}>
            <Image
              source={require('../../../assets/icons/Unflag.png')}
              resizeMode="contain"
              style={{width: 30, height: 30, tintColor: colors.error}}
            />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View ref={qrCodeRef}>
              <QRCodeGen id={idObject} objectName={objectName} />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={saveQrToDisk}
                style={styles.saveButton}>
                <Image
                  source={require('../../../assets/icons/Save.png')}
                  resizeMode="contain"
                  style={{width: 20, height: 20, tintColor: '#fff'}}
                />
                <Text style={styles.saveButtonText}>Sauvegarder</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleModal}
                style={styles.closeButton}>
                <Image
                  source={require('../../../assets/icons/Close.png')}
                  resizeMode="contain"
                  style={{width: 15, height: 23, tintColor: '#fff'}}
                />
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  isOwner: {
    display: 'flex',
    flexDirection: 'row',
    gap: 7,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 7,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  saveButton: {
    marginTop: 20,
    padding: 10,
    flexDirection: 'row',
    gap: 5,
    backgroundColor: colors.secondary,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Asul',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  remove: {
    backgroundColor: colors.white,
    padding: 5,
    borderRadius: 10,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: Dimensions.get('screen').height * 0.4,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    flexDirection: 'row',
    gap: 5,
    marginLeft: 50,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Asul',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default PreviewImage;
