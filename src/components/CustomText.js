import React from 'react';
import {Text, StyleSheet} from 'react-native';

const CustomText = ({style, ...props}) => {
  return <Text style={[styles.defaultText, style]} {...props} />;
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'Asul',
  },
});

export default CustomText;
