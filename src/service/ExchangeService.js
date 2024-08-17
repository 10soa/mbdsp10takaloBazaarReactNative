/* eslint-disable prettier/prettier */
import { Easing, Notifier, NotifierComponents } from 'react-native-notifier';
import { API_URL } from '../constants/config';
import { fetchWithAuth } from './ApiService';
import colors from '../constants/color';

export const rejectExchange = async (idExchange, payload, navigation) => {
  try {
    const data = await fetchWithAuth(
      `${API_URL}/exchange/${idExchange}/reject`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
      navigation,
    );

    Notifier.clearQueue(true);
    Notifier.showNotification({
      title: 'Succès ',
      description:
        'L\'échange a bien été refusé avec succès',
      Component: NotifierComponents.Notification,
      duration: 0,
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
    return data;
  } catch (error) {
    throw error;
  }
};

export const accepterExchange = async (idExchange, payload, navigation) => {
  try {
    const data = await fetchWithAuth(
      `${API_URL}/exchange/${idExchange}/accept`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
      navigation,
    );

    Notifier.clearQueue(true);
    Notifier.showNotification({
      title: 'Succès ',
      description:
        'L\'échange a bien été accepté avec succès',
      Component: NotifierComponents.Notification,
      duration: 0,
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
    return data;
  } catch (error) {
    throw error;
  }
};

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
      description:
        'Votre proposition a été envoyée avec succès au receveur. Cliquez ici pour consulter les détails',
      Component: NotifierComponents.Notification,
      duration: 0,
      showAnimationDuration: 800,
      showEasing: Easing.bounce,
      onHidden: () => console.log('Hidden'),
      onPress: () =>
        navigation.navigate('ExchangeDetails', {
          exchangeId: data.exchange.id,
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
