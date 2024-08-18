import {Easing, Notifier, NotifierComponents} from 'react-native-notifier';
import {API_URL, TOKEN} from '../constants/config';
import {fetchWithAuth} from './ApiService';
import colors from '../constants/color';

// Fonction pour signaler un objet
export const reportObject = async (objectId, reason, navigation) => {
  try {
    const response = await fetchWithAuth(
      `${API_URL}/reports`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ object_id: objectId, reason }),
      },
      navigation,
    );
    Notifier.clearQueue(true);
    Notifier.showNotification({
      title: 'Succès',
      description: "L'objet a été signalé avec succès.",
      Component: NotifierComponents.Notification,
      duration: 5000,
      showAnimationDuration: 800,
      showEasing: Easing.bounce,
      onHidden: () => console.log('Hidden'),
      hideOnPress: true,
      componentProps: {
        titleStyle: {
          color: colors.secondary,
          fontSize: 20,
          fontFamily: 'Asul-Bold',
        },
        descriptionStyle: {
          color: colors.textPrimary,
          fontSize: 16,
          fontFamily: 'Asul',
        },
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Fonction pour récupérer les raisons de signalement depuis l'API
export const fetchReportReasons = async () => {
  try {
    const response = await fetchWithAuth(
      `${API_URL}/typeReports`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; 
  } catch (error) {
    throw error;
  }
};

export const getObjects = async (
  pageNo,
  pageSize,
  sortBy,
  filters,
  navigation,
) => {
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
    const query = new URLSearchParams(params).toString();
    const result = await fetchWithAuth(
     `${API_URL}/objects?${query}`,
      {
        method: 'GET'
      },
      navigation,
    );
    // const response = await fetch(`${API_URL}/objects?${query}`);
    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }
    // const result = await response.json();

    return {
      objects: result.data.objects,
      totalPages: result.data.totalPages,
      currentPage: result.data.currentPage,
    };
  } catch (error) {
    throw error;
  }
};

// Create Object
export const createObject = async (objectData, navigation) => {
  try {
    const data = await fetchWithAuth(
      `${API_URL}/objects`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objectData),
      },
      navigation,
    );
    Notifier.clearQueue(true);
    Notifier.showNotification({
      title: 'Succès ',
      description:
        'Votre objet a bien été enregistré. Veuillez cliquer ici pour le consulter.',
      Component: NotifierComponents.Notification,
      duration: 0,
      showAnimationDuration: 800,
      showEasing: Easing.bounce,
      onHidden: () => console.log('Hidden'),
      onPress: () =>
        navigation.navigate('Details', {
          objectId: data.id,
        }),
      hideOnPress: true,
      componentProps: {
        titleStyle: {
          color: colors.secondary,
          fontSize: 20,
          fontFamily: 'Asul-Bold',
        },
        descriptionStyle: {
          color: colors.textPrimary,
          fontSize: 16,
          fontFamily: 'Asul',
        },
      },
    });
    return data;
  } catch (error) {
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
    throw error;
  }
};

// Update Ibject
export const updateObject = async (id, objectData, navigation) => {
  try {
    const data = await fetchWithAuth(
      `${API_URL}/objects/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objectData),
      },
      navigation,
    );
    Notifier.clearQueue(true);
    Notifier.showNotification({
      title: 'Succès ',
      description:
        'Votre objet a bien été modifié. Veuillez cliquer ici pour le consulter.',
      Component: NotifierComponents.Notification,
      duration: 0,
      showAnimationDuration: 800,
      showEasing: Easing.bounce,
      onHidden: () => console.log('Hidden'),
      onPress: () =>
        navigation.navigate('Details', {
          objectId: data.id,
        }),
      hideOnPress: true,
      componentProps: {
        titleStyle: {
          color: colors.secondary,
          fontSize: 20,
          fontFamily: 'Asul-Bold',
        },
        descriptionStyle: {
          color: colors.textPrimary,
          fontSize: 16,
          fontFamily: 'Asul',
        },
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// getUserObjects

export const getUserObjects = async (userId, params, navigation) => {
  let queryString = '';

  if (params) {
    queryString = Object.keys(params)
      .map(
        key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]),
      )
      .join('&');
  }

  const url = `${API_URL}/user/${userId}/objects?${queryString}`;
  console.log('url', url);

  try {
    const response = await fetchWithAuth(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      navigation,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeObject = async (objectId, navigation) => {
  try {
    const response = await fetchWithAuth(
      `${API_URL}/object/${objectId}/remove`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      navigation,
    );
    Notifier.clearQueue(true);
    Notifier.showNotification({
      title: 'Succès ',
      description: 'Votre objet a été retiré et est désormais indisponible.',
      Component: NotifierComponents.Notification,
      duration: 5000,
      showAnimationDuration: 800,
      showEasing: Easing.bounce,
      onHidden: () => console.log('Hidden'),
      hideOnPress: true,
      componentProps: {
        titleStyle: {
          color: colors.secondary,
          fontSize: 20,
          fontFamily: 'Asul-Bold',
        },
        descriptionStyle: {
          color: colors.textPrimary,
          fontSize: 16,
          fontFamily: 'Asul',
        },
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const restoreObject = async (objectId, navigation) => {
  try {
    const response = await fetchWithAuth(
      `${API_URL}/object/${objectId}/repost`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      navigation,
    );
    Notifier.clearQueue(true);
    Notifier.showNotification({
      title: 'Succès ',
      description: 'Votre objet a été reposté et est maintenant disponible.',
      Component: NotifierComponents.Notification,
      duration: 5000,
      showAnimationDuration: 800,
      showEasing: Easing.bounce,
      onHidden: () => console.log('Hidden'),
      hideOnPress: true,
      componentProps: {
        titleStyle: {
          color: colors.secondary,
          fontSize: 19,
          fontFamily: 'Asul-Bold',
        },
        descriptionStyle: {
          color: colors.textPrimary,
          fontSize: 16,
          fontFamily: 'Asul',
        },
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};



