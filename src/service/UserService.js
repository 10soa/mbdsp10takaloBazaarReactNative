import { Easing, Notifier, NotifierComponents } from 'react-native-notifier';
import { API_URL } from '../constants/config';
import { fetchWithAuth } from './ApiService';
import colors from '../constants/color';

export const updateUserProfile = async (id, data, successText, navigation) => {
    try {
        const response = await fetchWithAuth(
            `${API_URL}/user/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            },
            navigation,
        );
        Notifier.clearQueue(true);
        Notifier.showNotification({
            title: 'Succès ',
            description: successText,
            Component: NotifierComponents.Notification,
            duration: 6000,
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
        console.log('error', error);

        throw error;
    }
};
