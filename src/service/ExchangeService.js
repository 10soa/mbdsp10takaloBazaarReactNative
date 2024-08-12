import {Easing, Notifier, NotifierComponents} from 'react-native-notifier';
import {API_URL} from '../constants/config';
import {fetchWithAuth} from './ApiService';
import colors from '../constants/color';

export const proposerExchange = async (body, navigation) => {
  try {
    const data = await fetchWithAuth(
      `${API_URL}/exchange/proposed`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
      navigation,
    );

    Notifier.clearQueue(true);
    Notifier.showNotification({
      title: 'Succès ',
      description: 'Votre proposition ...',
      Component: NotifierComponents.Notification,
      duration: 0,
      showAnimationDuration: 800,
      showEasing: Easing.bounce,
      onHidden: () => console.log('Hidden'),
      // onPress: () =>
      //   navigation.navigate('Details', {
      //     objectId: data.id,
      //   }),
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

export const getExchangeById = async (exchangeId, navigation) => {
  try {
    const data = await fetchWithAuth(
      `${API_URL}/exchange/${exchangeId}`,
      {
        method: 'GET',
      },
      navigation,
    );
    return data;
  } catch (error) {
    throw error;
  }
};
