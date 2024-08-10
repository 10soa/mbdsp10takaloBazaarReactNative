import { API_URL } from '../constants/config';
import { fetchWithAuth } from './ApiService';

export const getHistoryExchange = async (userID, status = '', navigation) => {
  try {
    if(status=="All") status='';
    const page = 1, limit = 1000;
    const url = `${API_URL}/exchange/history/${userID}?page=${page}&limit=${limit}&status=${status}`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const result = await fetchWithAuth(url, options, navigation);
    
    if (result && result.data && result.data.exchanges) {
      console.log('Exchanges fetched successfully:', result);
      return result.data.exchanges;
    } else {
      console.error('Unexpected response format:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching exchange history:', error.message);
    throw error;
  }
};
