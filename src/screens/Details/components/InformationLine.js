import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import colors from '../../../constants/color';

const formatDate = isoString => {
  const date = new Date(isoString);
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  const formattedDate = date.toLocaleDateString('fr-FR', options);
  const formattedTime = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `publié le ${formattedDate} à ${formattedTime}`;
};
const InformationLine = ({title, description, date, cat}) => {
  return (
    <View style={styles.Content}>
      <Text style={styles.cat}> {cat}</Text>
      <Text style={styles.Title}> {title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.dateContent}>
        <Image
          source={require('../../../assets/icons/Calendar.png')}
          resizeMode="contain"
          style={{width: 17, height: 17, marginRight: 5, alignSelf: 'center'}}
        />
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cat: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: 'poppins_regular',
    alignSelf: 'flex-start',
    borderRadius: 5,
    justifyContent: 'center',
    marginVertical: 5,
  },
  Content: {
    marginVertical: 10,
  },
  Title: {
    fontSize: 20,
    color: colors.textPrimary,
    fontFamily: 'poppins_black',
  },
  description: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'poppins_regular',
  },
  dateContent: {
    paddingVertical: 2,
    paddingHorizontal: 15,
    backgroundColor: colors.grey,
    alignSelf: 'flex-start',
    borderRadius: 5,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  date: {
    color: colors.textPrimary,
    fontFamily: 'poppins_regular',
    fontSize: 14,
  },
});

export default InformationLine;
