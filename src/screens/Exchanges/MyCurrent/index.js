import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CardExchange from '../CardComponent/cardExchange';
import Container from '../../../components/Container';
import colors from '../../../constants/color';
import { getHistoryExchange,getMyCurrentExchange } from '../../../service/ExchangesService';
import IsLoading from '../../../components/IsLoading';
import { getUserFromToken } from '../../../service/SessionService';
import { useIsFocused,useRoute } from '@react-navigation/native';

const CurrentExchange = ({ navigation }) => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');
  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = await getUserFromToken();
      setUserID(userId.id);
      const data = await getMyCurrentExchange(navigation);
      setExchanges(data);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
        fetchData();
    }
  }, [isFocused,userID, selectedStatus, navigation]);

  if (loading) {
    return <IsLoading />;
  }

  if (error) {
    return <Text style={{ color: 'red' }}>Erreur: {error.message}</Text>;
  }

  return (
    <Container style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Négociations en cours</Text>
      </View>
      <View style={styles.exchangeCount}>
        <Text style={styles.exchangeCountText}>Nombre d'échanges: {exchanges.length}</Text>
      </View>
      {exchanges.length === 0 ? (
        <Text style={styles.noResultsText}>Aucun résultat!</Text>
      ) : (
        <FlatList
            data={exchanges}
            renderItem={({ item }) => <CardExchange exchange={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
            ListFooterComponent={<View style={{ height: 0 }} />}
        />
      )}
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
  noResultsText: {
    fontSize: 16,
    color: 'grey',
    fontFamily:'Asul',
    textAlign: 'center',
    marginTop: 100,
  },
});

export default CurrentExchange;
