import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../constants/color';

const ProductCard = ({
  styleCard,
  product,
  badgeText,
  backgroundBadge,
  disableShared,
  onPress,
  user,
  navigation,
  disableCategory,
  isOwner,
  isAuthenticated,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, styleCard && styleCard]}
      onPress={onPress}>
      {badgeText && (
        <View
          style={[
            styles.badge,
            backgroundBadge && {backgroundColor: backgroundBadge},
          ]}>
          <Text style={styles.name}>{badgeText}</Text>
        </View>
      )}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: product.image,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.details}>
        <View style={styles.detailsContent}>
          {user && (
            <TouchableOpacity
              style={styles.userContainer}
              onPress={() =>
                !isAuthenticated
                  ? navigation.navigate('User', {
                      text: 'Vous devez être connecté pour consulter les profils des utilisateurs.',
                    })
                  : isOwner
                  ? navigation.navigate('User')
                  : navigation.navigate('ProfileUser', {user: user})
              }>
              {user.profile_picture && (
                <Image
                  source={{uri: user.profile_picture}}
                  style={styles.userImage}
                />
              )}
              {!user.profile_picture && (
                <Image
                  source={require('../assets/img/user.png')}
                  style={styles.userImage}
                />
              )}
              <Text style={styles.userName}>{user.username}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{product.name}</Text>
          {!disableCategory && (
            <Text style={styles.cat}>{product.category.name}</Text>
          )}
        </View>
        {!disableShared && (
          <TouchableOpacity style={styles.cartIcon}>
            <Image
              source={require('../assets/icons/Share1.png')}
              style={{width: 20, height: 20, tintColor: colors.black}}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
    elevation: 5,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Asul-Bold',
  },
  name: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Asul',
  },
  cartIcon: {
    alignSelf: 'flex-end',
  },
  badge: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingTop: 2,
    paddingBottom: 4,
    position: 'absolute',
    elevation: 1,
    zIndex: 1,
    marginTop: 10,
    marginLeft: 10,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  cat: {
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: 'Asul',
  },
  detailsContent: {
    flexDirection: 'column',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  userName: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Asul',
    textDecorationLine: 'underline',
  },
});

export default ProductCard;
