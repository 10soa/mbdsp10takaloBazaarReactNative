import {TOKEN_NAME} from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken, removeToken} from './SessionService';

const handleHttpError = async (response, navigation) => {
  if (response.status === 401) {
    await removeToken();
    navigation.navigate('User', {
      text: 'Vous devez vous-connecter!',
    });
    return;
  } else if (response.status !== 500) {
    const error = await response.json();
    throw new Error(error.error);
  } else {
    throw new Error('Veuillez réessayer ultérieurement');
  }
};

export const fetchWithAuth = async (url, options = {}, navigation) => {
  const token = await getToken();
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      await handleHttpError(response, navigation);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
