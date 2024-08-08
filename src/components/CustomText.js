import React from 'react';
import {Text, StyleSheet} from 'react-native';
import colors from '../constants/color';

const CustomText = ({style, text}) => {
  return <Text style={[styles.defaultText, style]}>{text}</Text>;
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'Asul',
    color: colors.textPrimary,
  },
});

export default CustomText;
