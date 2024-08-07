import AsyncStorage from '@react-native-async-storage/async-storage';
import {TOKEN_NAME} from '../constants/config';
import {decode as base64_decode} from 'base-64';

export const isConnected = async () => {
  const token = await AsyncStorage.getItem('TOKEN_NAME');
  return token ? true : false;
};

const decodeToken = token => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = base64_decode(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const getToken = async () => {
  return await AsyncStorage.getItem(TOKEN_NAME);
};

export const getUserFromToken = async () => {
  const token = await getToken();
  if (token) {
    try {
      console.log('decodedTokeneee', token);
      const decodedToken = decodeToken(token);
      console.log('decodedToken', decodedToken);

      return decodedToken || null;
    } catch (error) {
      return null;
    }
  }
  return null;
};
