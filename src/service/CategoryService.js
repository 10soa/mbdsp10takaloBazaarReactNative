import {API_URL} from '../constants/config';

export const getCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) {
        throw new Error('Erreur fetching Categories');
      }
      const result = await response.json();
      return result.data.categories;
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      throw error;
    }
};