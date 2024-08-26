import React, { useState, useRef, useEffect } from 'react';
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
  TextInput,
  ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../../../constants/color';
import QRCodeGen from './QRCode';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';
import {
  reportObject,
  fetchReportReasons,
} from '../../../service/ObjectService';
import { PERMISSIONS } from 'react-native-permissions';
import { scale } from 'react-native-size-matters';

const PreviewImage = ({
  image,
  isOwner,
  style,
  idObject,
  objectName,
  removeObject,
  status,
  repostObject,
  isAuthenticated,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [reasonError, setReasonError] = useState(false);
  const qrCodeRef = useRef();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadReasons = async () => {
      try {
        setOpen(false);
        const fetchedReasons = await fetchReportReasons();
        const dropdownData = fetchedReasons.typeReports.map(item => ({
          label: item.name,
          value: item.name,
        }));
        setReasons(dropdownData);
      } catch (error) {
        console.log(
          'Erreur',
          'Impossible de récupérer les raisons de signalement.',
          error,
        );
      }
    };

    loadReasons();
  }, []);

  const resetReportForm = () => {
    setSelectedReason('');
    setCustomReason('');
    setReasonError(false);
  };

  const objectReport = () => {
    if (!isAuthenticated) {
      navigation.navigate('User', {
        text: 'Vous devez être connecté pour signaler un objet.',
      });
    } else {
      resetReportForm();
      setReportModalVisible(true);
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const goEditPage = () => {
    if (idObject) {
      navigation.navigate('UpdateObject', { idObject: idObject });
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
      } else if (Platform.OS === 'ios') {
        const status = await check(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
        console.log('status', status);

        if (status !== RESULTS.GRANTED) {
          const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
          if (result !== RESULTS.GRANTED) {
            Alert.alert(
              'Permission refusée',
              'Vous devez accorder la permission pour sauvegarder le QR code',
            );
            return;
          }
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

  const submitReport = async () => {
    if (
      !selectedReason ||
      (selectedReason === 'Autre' && customReason.trim() === '')
    ) {
      setReasonError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    const reason = customReason || selectedReason;
    try {
      await reportObject(idObject, reason, navigation);
      setLoading(false);
      setReportModalVisible(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Erreur', 'Une erreur est survenue lors du signalement');
    }
  };

  return (
    <View>
      <View
        style={{
          backgroundColor: colors.grey,
          borderRadius: scale(8),
          padding: scale(5),
        }}>
        <Image
          source={{ uri: image }}
          resizeMode="contain"
          style={styles.image}
        />
      </View>
      {isOwner && (
        <View style={styles.isOwner}>
          <TouchableOpacity style={styles.remove} onPress={goEditPage}>
            <Image
              source={require('../../../assets/icons/Edit.png')}
              resizeMode="contain"
              style={{ width: 30, height: 30, tintColor: colors.black }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.remove}
            onPress={status == 'Removed' ? repostObject : removeObject}>
            <Image
              source={
                status == 'Removed'
                  ? require('../../../assets/icons/Hide.png')
                  : require('../../../assets/icons/Eye.png')
              }
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
                tintColor:
                  status == 'Removed' ? colors.error : colors.secondary,
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
              style={{ width: 30, height: 30, tintColor: colors.black }}
            />
          </TouchableOpacity>
        )}
        {!isOwner && (
          <TouchableOpacity style={styles.remove} onPress={objectReport}>
            <Image
              source={require('../../../assets/icons/Unflag.png')}
              resizeMode="contain"
              style={{ width: 30, height: 30, tintColor: colors.error }}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Modale pour le signalement d'un objet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Signaler un objet</Text>
            <DropDownPicker
              open={open}
              value={selectedReason}
              items={reasons}
              setOpen={setOpen}
              setValue={callback => {
                const selectedValue = callback();
                setSelectedReason(selectedValue);
                setReasonError(false);
              }}
              dropDownDirection="TOP"
              placeholder="Sélectionnez une raison"
              style={[styles.picker]}
              dropDownContainerStyle={[styles.picker]}
              textStyle={{
                fontFamily: 'Asul',
                fontSize: 17,
                color: colors.darkGrey,
              }}
            />
            {reasonError && !selectedReason && (
              <Text style={styles.errorText}>
                Veuillez sélectionner une raison.
              </Text>
            )}
            {selectedReason === 'Autre' && (
              <TextInput
                style={[
                  styles.textArea,
                  reasonError && { borderColor: 'red', borderWidth: 1 },
                ]}
                placeholderTextColor={colors.textPrimary}
                placeholder="Entrez une raison"
                value={customReason}
                onChangeText={text => {
                  setCustomReason(text);
                  setReasonError(false);
                }}
                editable={!loading}
                multiline={true}
                numberOfLines={4}
              />
            )}
            {reasonError &&
              selectedReason === 'Autre' &&
              customReason.trim() === '' && (
                <Text style={styles.errorText}>
                  Veuillez entrer une raison.
                </Text>
              )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  resetReportForm();
                  setReportModalVisible(false);
                }}
                style={[styles.cancelButton, { marginRight: 30 }]}>
                <Image
                  source={require('../../../assets/icons/Close.png')}
                  resizeMode="contain"
                  style={{ width: 20, height: 20, tintColor: '#fff' }}
                />
                <Text style={styles.saveButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitReport}
                style={[styles.saveButton, { marginLeft: 30 }]}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Image
                    source={require('../../../assets/icons/Sent.png')}
                    resizeMode="contain"
                    style={{ width: 20, height: 20, tintColor: '#fff' }}
                  />
                )}
                <Text style={styles.saveButtonText}>
                  {loading ? 'Envoi...' : 'Envoyer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modale pour afficher et sauvegarder le QR code */}
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
                  style={{ width: 20, height: 20, tintColor: '#fff' }}
                />
                <Text style={styles.saveButtonText}>Sauvegarder</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleModal}
                style={styles.closeButton}>
                <Image
                  source={require('../../../assets/icons/Close.png')}
                  resizeMode="contain"
                  style={{ width: 15, height: 23, tintColor: '#fff' }}
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
    bottom: scale(5),
    left: 0,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 7,
    marginVertical: scale(5),
    justifyContent: 'flex-end'
    // position: 'absolute',
    // bottom: 0,
    // right: 0,
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
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Asul-Bold',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    fontFamily: 'Asul',
    fontSize: 17,
    color: colors.darkGrey,
    borderColor: 'transparent',
    backgroundColor: '#f1f1f1',
    zIndex: 1000,
    marginBottom: scale(10),
  },
  textArea: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    fontFamily: 'Asul',
    fontSize: 17,
  },
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 20,
    padding: 10,
    flexDirection: 'row',
    gap: 5,
    backgroundColor: 'black',
    borderRadius: 5,
  },
});

export default PreviewImage;
