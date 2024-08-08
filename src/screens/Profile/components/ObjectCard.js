import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {scale} from 'react-native-size-matters'; // Utilisé pour les tailles dynamiques
import colors from '../../../constants/color'; // Assurez-vous d'avoir un fichier de couleurs
import CustomText from '../../../components/CustomText';

const ObjectCard = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.textContainer}>
        <CustomText style={styles.title} text="Mes objets" />
        <CustomText
          style={styles.description}
          text="Gardez un œil sur vos biens et gérez-les facilement."
        />
      </View>
      <View
        style={{alignItems: 'flex-end', alignContent: 'flex-start'}}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../../assets/icons/Forward.png')}
            style={styles.icon}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: scale(10),
    paddingVertical: scale(20),
    paddingHorizontal: scale(25),
    marginVertical: scale(10),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: scale(17),
    fontFamily: 'Asul-Bold',
    color: colors.white,
  },
  description: {
    fontSize: scale(14),
    color: colors.white,
    marginTop: scale(15),
  },
  iconContainer: {
    width: scale(22),
    height: scale(22),
    borderRadius: scale(8),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: scale(12),
    height: scale(12),
    tintColor: colors.textPrimary,
  },
});

export default ObjectCard;
