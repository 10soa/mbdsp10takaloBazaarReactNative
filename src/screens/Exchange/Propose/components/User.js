import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters'; // Si vous utilisez react-native-size-matters pour les tailles dynamiques
import colors from '../../../../constants/color';

const User = ({imageUrl, username}) => {
  return (
    <View style={styles.container}>
      {imageUrl && <Image source={{uri: imageUrl}} style={styles.avatar} />}
      {!imageUrl && (
        <Image
          source={require('../../../../assets/img/user.png')}
          style={styles.avatar}
        />
      )}
      <Text style={styles.username}>{username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatar: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    marginBottom: scale(5),
  },
  username: {
    fontSize: scale(14),
    color: colors.textPrimary,
    fontFamily: 'Asul-Bold',
  },
});

export default User;
