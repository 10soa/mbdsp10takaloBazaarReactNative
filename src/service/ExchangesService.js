import { API_URL } from '../constants/config';
import { fetchWithAuth } from './ApiService';

export const getHistoryExchange = async (userID, status, navigation) => {
  try {
    if(status=="All") status='';
    const url = `${API_URL}/exchange/history/${userID}?page=1&limit=&status=${status}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const result = await fetchWithAuth(url, options, navigation);
    
    if (result && result.data && result.data.exchanges) {
     return result.data.exchanges;
    } else {
     return [];
    }
  } catch (error) {
    throw error;
  }
};

export const getMyCurrentExchange = async (navigation) => {
    try {
      const url = `${API_URL}/exchanges/myCurrents`;
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const result = await fetchWithAuth(url, options, navigation);
      if (result && result.data) {
        return result.data;
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  };