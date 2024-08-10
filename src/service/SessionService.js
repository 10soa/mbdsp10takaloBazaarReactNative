import AsyncStorage from '@react-native-async-storage/async-storage';
import {TOKEN_NAME, USERID, USERNAME} from '../constants/config';
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

export const getUserId = async () => {
  return await AsyncStorage.getItem(USERID);
};

export const getUsername = async () => {
  return await AsyncStorage.getItem(USERNAME);
};

export const getUserFromToken = async () => {
  const token = await getToken();
  if (token) {
    try {
      const decodedToken = decodeToken(token);
      return decodedToken || null;
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(TOKEN_NAME);
  await AsyncStorage.removeItem(USERID);
  await AsyncStorage.removeItem(USERNAME);
}