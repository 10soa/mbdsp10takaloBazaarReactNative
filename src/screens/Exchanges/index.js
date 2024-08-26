import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
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
import GlobalSafeAreaView from '../../components/GlobalSafeAreaView';
import DropDownPicker from 'react-native-dropdown-picker';

const ExchangeHistory = ({navigation}) => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const isFocused = useIsFocused();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState([
    { label: 'Tous les statuts', value: 'All' },
  { label: 'Accepté', value: 'Accepted' },
  { label: 'Annulé', value: 'Cancelled' },
  { label: 'Refusé', value: 'Refused' },
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = await getUserFromToken();
      setUserID(userId.id);
      const data = await getHistoryExchange(userID, selectedStatus, navigation);
      setExchanges(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setSelectedStatus('All');
      fetchData();
    }
  }, [isFocused, userID, selectedStatus, navigation]);

  if (error) {
    return <Text style={{color: 'red'}}>Erreur: {error.message}</Text>;
  }

  return (
    <GlobalSafeAreaView>
      <Header
        backgroundColor={colors.secondary}
        title="Historique des échanges"
        navigation={navigation}
      />
      {loading ? (
        <IsLoading />
      ) : (
        <Container>
          <View style={{...styles.pickerContainer, marginTop: open ? scale(150) : scale(0)}}>
            <View
              style={[
                styles.inputContainer,
                {paddingLeft: 30, paddingRight: 20},
              ]}>
            
              <DropDownPicker
            open={open}
            value={selectedStatus}
            items={status}
            setOpen={setOpen}
            setValue={callback => {
              const selectedValue = callback();
              setSelectedStatus(selectedValue);
            }}
            setItems={setStatus}
            dropDownDirection="TOP"
            placeholder="Statut"
            style={[styles.picker]}
            dropDownContainerStyle={[styles.picker]}
            textStyle={{
              fontFamily: 'Asul-Bold',
              fontSize: 17,
              textAlign: 'center',
              color: colors.primary,
            }}
          />
              {/* <Picker
                selectedValue={selectedStatus}
                style={[styles.picker]}
                onValueChange={itemValue => setSelectedStatus(itemValue)}>
                <Picker.Item
                  label="Tous les statuts"
                  value="All"
                  style={{
                    fontFamily: 'Asul',
                    fontSize: 17,
                    color: colors.darkGrey,
                  }}
                />
                <Picker.Item
                  label="Accepté"
                  value="Accepted"
                  style={{
                    fontFamily: 'Asul',
                    fontSize: 17,
                    color: colors.darkGrey,
                  }}
                />
                <Picker.Item
                  label="Annulé"
                  value="Cancelled"
                  style={{
                    fontFamily: 'Asul',
                    fontSize: 17,
                    color: colors.darkGrey,
                  }}
                />
                <Picker.Item
                  label="Refusé"
                  value="Refused"
                  style={{
                    fontFamily: 'Asul',
                    fontSize: 17,
                    color: colors.darkGrey,
                  }}
                />
              </Picker> */}
            </View>
          </View>
          {exchanges.length === 0 ? (
            <Text style={styles.noResultsText}>Aucun échange!</Text>
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
    </GlobalSafeAreaView>
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
    // marginVertical: scale(10),
    // marginHorizontal: scale(20),
    // paddingHorizontal: scale(10),
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: scale(10),
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
  picker: {
    width: '100%',
    fontFamily: 'Asul',
    fontSize: 17,
    color: colors.darkGrey,
    borderColor: 'transparent',
    backgroundColor: '#f1f1f1',
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: '100%',
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.darkGrey
  }, 
  icon: {
    marginRight: 10,
    tintColor: colors.darkGrey,
    width: 22,
    height: 22,
  },
});

export default ExchangeHistory;
