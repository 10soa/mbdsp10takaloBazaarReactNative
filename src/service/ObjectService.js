import {API_URL} from '../constants/config';
export const getObjects = async (pageNo, pageSize, sortBy, filters) => {
  try {
    let params = {
      page: pageNo,
      limit: pageSize,
      order_by: 'created_at',
      order_direction: sortBy,
    };

    if (filters.name) params.name = filters.name;
    if (filters.description) params.description = filters.description;
    if (filters.category_id) params.category_id = filters.category_id;
    if (filters.created_at_start)
      params.created_at_start = filters.created_at_start;
    if (filters.created_at_end) params.created_at_end = filters.created_at_end;
    const response = await fetch(`${API_URL}/objects?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();

    return {
      objects: result.data.objects,
      totalPages: result.data.totalPages,
      currentPage: result.data.currentPage,
    };
  } catch (error) {
    console.error('Error fetching objects:', error.message);
    throw error;
  }
};

export const getObject = async id => {
  try {
    const response = await fetch(`${API_URL}/object/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      'There was a problem with the fetch operation:',
      error.message,
    );
    throw error;
  }
};
