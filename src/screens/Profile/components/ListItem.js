import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {scale} from 'react-native-size-matters';
import colors from '../../../constants/color'; // Assurez-vous d'avoir un fichier de couleurs

const ListItem = ({title, iconSource, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image source={iconSource} style={styles.icon} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Image
        source={require('../../../assets/icons/Forward.png')}
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: scale(20),
    paddingRight: scale(10),
    backgroundColor: '#fff',
  },
  iconContainer: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(50),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(15),
  },
  icon: {
    width: scale(20),
    height: scale(20),
    tintColor: colors.white
  },
  title: {
    fontSize: scale(15),
    fontFamily: 'Asul-Bold',
    color: colors.textPrimary,
    flex: 1,
  },
  arrowIcon: {
    width: scale(15),
    height: scale(15),
    tintColor: colors.darkGrey,
  },
});

export default ListItem;
