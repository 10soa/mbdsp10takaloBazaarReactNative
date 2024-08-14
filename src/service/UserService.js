import {Easing, Notifier, NotifierComponents} from 'react-native-notifier';
import { API_URL } from '../constants/config';
import { fetchWithAuth } from './ApiService';

export const getUser = async idUser => {
    try {
        const data = await fetchWithAuth(
            `${API_URL}/user/${idUser}`,
            {
                method: 'GET',
            },
            null,
        );
        return data.user;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async user => {
    try {
        const data = await fetchWithAuth(
            `${API_URL}/user/${user.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            },
            null,
        );
        Notifier.clearQueue(true);
        Notifier.showNotification({
            title: 'Succès ',
            description:
                'Votre profil a bien été modifié.',
            Component: NotifierComponents.Notification,
            duration: 0,
            showAnimationDuration: 800,
            showEasing: Easing.bounce,
            onHidden: () => console.log('Hidden'),
        });
        return data;
    } catch (error) {
        throw error;
    }
};
