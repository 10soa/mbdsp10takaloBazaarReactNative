import React from 'react';
import { useEffect } from 'react';
import AppNavigator from './src/navigator/AppNavigator';
import {
  createNavigationContainerRef,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import {
  Notifier,
  NotifierComponents,
  NotifierWrapper,
} from 'react-native-notifier';
import messaging from '@react-native-firebase/messaging';
import { requestUserPermission } from './src/service/Function';
import { Easing } from 'react-native';
import colors from './src/constants/color';

import { navigationRef } from './src/config/navigationService';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
    console.log('SplashScreen hidden');

    void requestUserPermission();
    console.log('User permission requested');

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      try {
        Notifier.clearQueue(true);
        Notifier.showNotification({
          title: remoteMessage.notification.title,
          description: remoteMessage.notification.body,
          Component: NotifierComponents.Notification,
          duration: 0,
          showAnimationDuration: 800,
          showEasing: Easing.bounce,
          onHidden: () => console.log('Hidden'),
          onPress: () =>
            navigationRef.current?.navigate('ExchangeDetails', {
              exchangeId: remoteMessage.data.id,
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
      } catch (error) {
        console.error('Erreur lors de la gestion de la notification:', error);
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Notification received in background:', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            "Notification a ouvert l'app depuis l'état fermé:",
            remoteMessage.notification,
          );
        }
      });

    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          "Notification a ouvert l'app depuis l'arrière-plan:",
          remoteMessage.notification,
        );
      },
    );

    return () => {
      console.log('Unsubscribing from notification listeners');
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NotifierWrapper>
          <NavigationContainer ref={navigationRef}>
            <AppNavigator />
          </NavigationContainer>
        </NotifierWrapper>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
