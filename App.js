import React from 'react';
import {useEffect} from 'react';
import AppNavigator from './src/navigator/AppNavigator';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AuthProvider} from './src/context/AuthContext';
import {NotifierWrapper} from 'react-native-notifier';
export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
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
