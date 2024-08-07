import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL, TOKEN_NAME, USERID, USERNAME} from '../constants/config';
import { getUserFromToken } from './SessionService';

export const log = async (email, mdp) => {
  const url = `${API_URL}/auth/user/login`;

  const body = {
    username: email,
    password: mdp,
  };
  try {
    console.log('sss', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status !== 500) {
        throw new Error(data.error);
      } else {
        throw new Error('Veuillez réessayer ultérieurement');
      }
    }
    await AsyncStorage.setItem(TOKEN_NAME, data.user.token);
    await AsyncStorage.setItem(USERNAME, data.user.username);
    await AsyncStorage.setItem(USERID, data.user.id.toString());

    return data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  const url = `${API_URL}/auth/logout`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

export const register = async user => {
  const url = `${API_URL}/register`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};
