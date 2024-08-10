import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import colors from '../constants/color';

const Header = ({title, navigation}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Image
          source={require('../assets/icons/Left.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: colors.white,
  },
  title: {
    fontSize: 20,
    color: colors.white,
    fontFamily: 'Asul',
  },
});

export default Header;
