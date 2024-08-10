import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import colors from '../../../../constants/color';

const ItemCard = ({imageUrl, itemName, onDelete}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: imageUrl}}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Image
            source={require('../../../../assets/icons/Close.png')}
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
        {itemName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(120),
    margin: scale(10),
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: colors.grey,
    borderStyle: 'dashed',
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: scale(120),
    resizeMode: 'cover',
    borderRadius: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: scale(5),
    right: scale(5),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: scale(15),
    zIndex: 1,
    padding: scale(5),
  },
  deleteIcon: {
    width: scale(16),
    height: scale(16),
    tintColor: colors.textPrimary,
  },
  itemName: {
    marginTop: scale(8),
    fontSize: scale(14),
    color: colors.textPrimary,
    fontFamily: 'Asul-Bold',
  },
});

export default ItemCard;
