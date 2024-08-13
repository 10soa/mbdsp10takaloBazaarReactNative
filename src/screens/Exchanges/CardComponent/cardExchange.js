import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';

const CardExchange = ({exchange, onPress}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.text}>Echange ID : {exchange.id}</Text>
      <Text style={styles.textBold}>Proposeur : {exchange.proposer_user_name || exchange.proposer.username}</Text>
      <Text style={styles.textBold}>Receveur : {exchange.receiver_user_name || exchange.receiver.username}</Text>
      <Text style={styles.text}>Status : {translateStatus(exchange.status)}</Text>
    </TouchableOpacity>
  );
};

const translateStatus = status => {
  switch (status) {
    case 'Accepted':
      return 'Accepté';
    case 'Cancelled':
      return 'Annulé';
    case 'Proposed':
      return 'Proposé';
    case 'Refused':
      return 'Refusé';
    default:
      return status;
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily : 'Asul'
  },
  textBold: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily : 'Asul-Bold'
  },
});

export default CardExchange;
