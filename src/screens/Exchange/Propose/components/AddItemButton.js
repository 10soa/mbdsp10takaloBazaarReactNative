import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { scale } from 'react-native-size-matters';  
import colors from '../../../../constants/color';

const AddItemButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require('../../../../assets/icons/plus.png')}
          style={styles.icon}
        />
        <Text style={styles.text}>Ajouter objet</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(120),
    height: scale(150),
    borderWidth: 2,
    borderColor: colors.grey,
    borderStyle: 'dashed',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: scale(10),
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: scale(40),
    height: scale(40),
    tintColor: colors.grey,
  },
  text: {
    marginTop: scale(10),
    fontSize: scale(16),
    color: colors.darkGrey,
    fontFamily: 'Asul-Regular',
  },
});

export default AddItemButton;
