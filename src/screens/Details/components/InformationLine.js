import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import colors from '../../../constants/color';

const formatDate = isoString => {
  const date = new Date(isoString);
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  const formattedDate = date.toLocaleDateString('fr-FR', options);

  return `publié le ${formattedDate}`;
};
const InformationLine = ({title, description, date, cat}) => {
  return (
    <View style={styles.Content}>
      <View style={styles.viewcat}>
      <Text style={styles.cat}> {cat}</Text>
      </View>
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
  viewcat:{
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    borderRadius: 5,
    justifyContent: 'center',
    marginVertical: 5,
    paddingBottom: 3,
    paddingHorizontal: 10,

  },
  cat: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Asul',
  },
  Content: {
    marginVertical: 10,
  },
  Title: {
    fontSize: 22,
    color: colors.textPrimary,
    fontFamily: 'Asul-Bold',
  },
  description: {
    fontSize: 17,
    color: colors.textPrimary,
    fontFamily: 'Asul',
  },
  dateContent: {
    paddingVertical: 3,
    paddingBottom: 4,
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
    fontFamily: 'Asul',
    fontSize: 16,
  },
});

export default InformationLine;
