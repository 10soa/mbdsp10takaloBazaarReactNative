import React from 'react';
import {Text, StyleSheet} from 'react-native';

const CustomText = ({style, text}) => {
  return <Text style={[styles.defaultText, style]}>{text}</Text>;
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'Asul',
  },
});

export default CustomText;
