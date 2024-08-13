import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CardExchange from './CardComponent/cardExchange';
import Container from '../../components/Container';
import colors from '../../constants/color';
import {getHistoryExchange} from '../../service/ExchangesService';
import IsLoading from '../../components/IsLoading';
import {getUserFromToken} from '../../service/SessionService';
import {useIsFocused} from '@react-navigation/native';
import Header from '../../components/Header';
import {scale} from 'react-native-size-matters';

const ExchangeHistory = ({navigation}) => {
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
      const data = await getHistoryExchange(userID, selectedStatus, navigation);
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
  }, [isFocused, userID, selectedStatus, navigation]);

  if (error) {
    return <Text style={{color: 'red'}}>Erreur: {error.message}</Text>;
  }

  return (
    <>
      <Header
        backgroundColor={colors.secondary}
        title="Historique des échanges"
        navigation={navigation}
      />
      {loading ? (
        <IsLoading />
      ) : (
        <Container>
          <View style={styles.exchangeCount}>
            <Text style={styles.exchangeCountText}>
              Nombre d'échanges: {exchanges.length}
            </Text>
          </View>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedStatus}
                onValueChange={itemValue => setSelectedStatus(itemValue)}
                style={styles.picker}>
                <Picker.Item
                  label="Tous les statuts"
                  value="All"
                  style={{fontFamily: 'Asul'}}
                />
                <Picker.Item
                  label="Accepté"
                  value="Accepted"
                  style={{fontFamily: 'Asul'}}
                />
                <Picker.Item
                  label="Annulé"
                  value="Cancelled"
                  style={{fontFamily: 'Asul'}}
                />
                <Picker.Item
                  label="Refusé"
                  value="Refused"
                  style={{fontFamily: 'Asul'}}
                />
              </Picker>
            </View>
          </View>
          {exchanges.length === 0 ? (
            <Text style={styles.noResultsText}>Aucun résultat!</Text>
          ) : (
            <FlatList
              data={exchanges}
              renderItem={({item}) => (
                <CardExchange
                  exchange={item}
                  onPress={() =>
                    navigation.navigate('ExchangeDetails', {
                      exchangeId: item.id,
                    })
                  }
                />
              )}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{flexGrow: 1}}
              ListFooterComponent={<View style={{height: 0}} />}
            />
          )}
        </Container>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary,
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  headerText: {
    fontSize: scale(18),
    color: colors.white,
    fontFamily: 'Asul-Bold',
  },
  pickerContainer: {
    marginVertical: scale(10),
    marginHorizontal: scale(20),
    paddingHorizontal: scale(10),
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: scale(10),
  },
  picker: {
    height: scale(50),
    color: colors.textPrimary,
  },
  exchangeCount: {
    backgroundColor: colors.primary,
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
    borderRadius: scale(10),
    marginTop: scale(10),
    // marginHorizontal: scale(28)
  },
  exchangeCountText: {
    fontSize: scale(16),
    color: colors.white,
    fontFamily: 'Asul',
    textAlign: 'center',
  },
  exchangeList: {
    paddingHorizontal: scale(20),
    paddingBottom: scale(20),
  },
  noResultsText: {
    fontSize: scale(16),
    color: 'grey',
    fontFamily: 'Asul',
    textAlign: 'center',
    marginTop: scale(100),
  },
});

export default ExchangeHistory;
