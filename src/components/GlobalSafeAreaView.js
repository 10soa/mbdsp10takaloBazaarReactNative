import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

const GlobalSafeAreaView = ({ children, style }) => {
  return <SafeAreaView style={[styles.container,style]}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', 
  },
});

export default GlobalSafeAreaView;
