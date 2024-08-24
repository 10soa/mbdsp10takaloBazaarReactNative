import messaging from '@react-native-firebase/messaging';

import DeviceInfo from 'react-native-device-info';
export const validateForm = (
  fieldsToValidate,
  formData,
  setFormErrors,
  translate = undefined,
) => {
  let valid = true;
  const newErrors = {};

  fieldsToValidate.forEach(field => {
    if (!formData[field]) {
      if (translate) {
        newErrors[field] = translate(field) + ' est obligatoire';
      } else {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } est obligatoire`;
      }
      valid = false;
    } else {
      newErrors[field] = '';
    }
  });

  setFormErrors(newErrors);
  return valid;
};

export const getBase64Image = async uri => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = reader.result.replace(
          /^data:image\/(png|jpeg|jpg);base64,/,
          '',
        );
        resolve(`data:image/png;base64,${base64String}`);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw error;
  }
};

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

export const getFcmToken = async () => {
  try {
    const newFcmToken = await messaging().getToken();
    console.log('getFcmToken', newFcmToken);
    return newFcmToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAndroidId = async () => {
  try {
    const androidId = await DeviceInfo.getAndroidId();
    console.log('Android ID:', androidId);
    return androidId;
  } catch (error) {
    console.error('Unable to get Android ID:', error);
  }
};
