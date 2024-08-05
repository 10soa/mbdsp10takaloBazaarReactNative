import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet, Text} from 'react-native';
import colors from '../../../constants/color';

const DetailsHeader = ({onBackPress, onCartPress, cartItemCount, isLogged}) => {
  cartItemCount = 4;
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={onBackPress}>
        <Image
          source={require('../../../assets/icons/Left.png')}
          resizeMode="contain"
          style={{width: 25, height: 25}}
        />
      </TouchableOpacity>
      {isLogged && (
        <View style={styles.rightContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={onCartPress}>
            <Image
              source={require('../../../assets/icons/Transfer.png')}
              resizeMode="contain"
              style={{width: 25, height: 25}}
            />
            {cartItemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  iconButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: colors.white,
    elevation: 3,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DetailsHeader;
