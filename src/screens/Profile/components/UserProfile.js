import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import colors from '../../../constants/color';
import {scale} from 'react-native-size-matters';
import CustomText from '../../../components/CustomText';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const UserProfile = ({user}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission given');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const updateProfilePicture = () => {};

  const handleChoosePhoto = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.assets[0].uri};
        console.log('Selected image: ', source);
        updateProfilePicture();
      }
      handleCloseModal();
    });
  };

  const handleTakePhoto = async () => {
    await requestCameraPermission();
    launchCamera({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        const source = {uri: response.assets[0].uri};
        console.log('Captured image: ', source);
        updateProfilePicture();
      }
      handleCloseModal();
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleOpenModal}>
        {user.profile_picture ? (
          <Image
            source={{uri: user.profile_picture}}
            style={styles.profileImage}
          />
        ) : (
          <Image
            source={require('../../../assets/img/user.png')}
            style={styles.profileImage}
          />
        )}
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {user.last_name} {user.first_name}
        </Text>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}>
              <Image
                source={require('../../../assets/icons/Close.png')}
                style={{
                  width: scale(20),
                  height: scale(20),
                  tintColor: colors.white,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonAction}
              onPress={handleChoosePhoto}>
              <Image
                source={require('../../../assets/icons/Picture.png')}
                style={{
                  width: scale(25),
                  height: scale(25),
                  tintColor: colors.white,
                }}
              />
              <CustomText
                text="Choisir dans la bibliothèque"
                style={styles.modalOption}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonAction}
              onPress={handleTakePhoto}>
              <Image
                source={require('../../../assets/icons/Camera.png')}
                style={{
                  width: scale(23),
                  height: scale(23),
                  tintColor: colors.white,
                }}
              />
              <CustomText text="Prendre une photo" style={styles.modalOption} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    backgroundColor: '#fff',
    marginBottom: scale(10),
  },
  profileImage: {
    width: scale(85),
    height: scale(85),
    borderRadius: scale(50),
    marginRight: scale(15),
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 5,
  },
  name: {
    fontSize: scale(18),
    fontFamily: 'Asul-Bold',
    color: colors.textPrimary,
    marginBottom: scale(3),
  },
  username: {
    fontSize: scale(15),
    color: colors.darkGrey,
    marginBottom: scale(3),
    fontFamily: 'Asul-Bold',
  },
  email: {
    fontSize: scale(14),
    color: '#777',
    fontFamily: 'Asul',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.textPrimary,
    paddingHorizontal: scale(20),
    paddingBottom: scale(20),
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingVertical: scale(10),
  },
  closeButtonText: {
    fontSize: scale(18),
    color: '#fff',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(20),
  },
  profileImageSmall: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
  },
  modalOption: {
    fontSize: scale(18),
    color: '#fff',
    paddingVertical: scale(10),
  },
  modalOptionDelete: {
    fontSize: scale(18),
    color: 'red',
    paddingVertical: scale(10),
  },
  buttonAction: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
});

export default UserProfile;
