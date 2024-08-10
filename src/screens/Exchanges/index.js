import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CardExchange from './CardComponent/cardExchange';
import Container from '../../components/Container';
import colors from '../../constants/color';
import { getHistoryExchange } from '../../service/ExchangesService';
import IsLoading from '../../components/IsLoading';
import { getUserFromToken } from '../../service/SessionService';

const ExchangeHistory = ({ navigation }) => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await getUserFromToken();
        setUserID(userId.id);
        const data = await getHistoryExchange(userID, selectedStatus, navigation);
        setExchanges(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userID, selectedStatus, navigation]);

  if (loading) {
    return <IsLoading />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>Erreur: {error.message}</Text>;
  }

  return (
    <Container style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Historique des échanges</Text>
      </View>
      <View style={styles.exchangeCount}>
        <Text style={styles.exchangeCountText}>Nombre d'échanges: {exchanges.length}</Text>
      </View>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(itemValue) => setSelectedStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Tous les statuts" value="All" />
            <Picker.Item label="Accepté" value="Accepted" />
            <Picker.Item label="Annulé" value="Cancelled" />
          </Picker>
        </View>
      </View>
      <FlatList
        data={exchanges}
        renderItem={({ item }) => <CardExchange exchange={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        ListFooterComponent={<View style={{ height: 0 }} />}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontSize: 18,
    color: colors.white,
    fontFamily: 'Asul-Bold',
  },
  pickerContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
  },
  picker: {
    height: 50,
    color: colors.textPrimary,
  },
  exchangeCount: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  exchangeCountText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: 'Asul',
    textAlign: 'center',
  },
  exchangeList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default ExchangeHistory;
