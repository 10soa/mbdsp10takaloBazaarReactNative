import React from 'react';
import { useEffect } from 'react';
import AppNavigator from './src/navigator/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { NotifierWrapper } from 'react-native-notifier';
import messaging from '@react-native-firebase/messaging';
import { requestUserPermission } from './src/service/Function';
import { Alert } from 'react-native';
export default function App() {
  useEffect(() => {
    SplashScreen.hide();
    console.log('SplashScreen hidden');

    void requestUserPermission();
    console.log('User permission requested');

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      try {
        Alert.alert(
          'Une nouvelle notification FCM est arrivée !',
          JSON.stringify(remoteMessage),
        );
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
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </NotifierWrapper>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
