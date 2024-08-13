import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import colors from '../constants/color';

const Header = ({title, navigation, backgroundColor, color, haveLine}) => {
  return (
    <View
      style={[
        styles.headerContainer,
        {backgroundColor: backgroundColor ? backgroundColor : colors.primary},
        ,
        haveLine && styles.header,
      ]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Image
          source={require('../assets/icons/Left.png')}
          style={[styles.backIcon, {tintColor: color ? color : colors.white}]}
        />
      </TouchableOpacity>
      <Text style={[styles.title, {color: color ? color : colors.white}]}>
        {title}
      </Text>
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
  header: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
});

export default Header;
