import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import HomeHeader from './components/HomeHeader';
import Container from '../../components/Container';
import SearchBar from '../../components/SeachBar';
import Banner from './components/Banner';
import colors from '../../constants/color';
import ProductCard from '../../components/ProductCard';
import {getObjects} from '../../service/ObjectService';
import React, {useContext, useEffect, useState} from 'react';
import IsLoading from '../../components/IsLoading';
import {AuthContext} from '../../context/AuthContext';
import ButtonPrimary from '../../components/ButtonPrimary';

const Home = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();
  const {userID, isAuthenticated} = useContext(AuthContext);
  useEffect(() => {
    if (isFocused) {
      const fetchData = async () => {
        try {
          const filters = {
            name: '',
            description: '',
            category_id: '',
            created_at_start: '',
            created_at_end: '',
          };
          const result = await getObjects(1, 20, 'desc', filters, navigation);
          setData(result.objects);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isFocused]);

  return (
    <>
      <HomeHeader  />
      <Container isScrollable paddingVerticalDisabled>
        <SearchBar />
        <Banner navigation={navigation} />
        <View style={styles.Title}>
          <Text style={styles.TitleContent}>
            {' '}
            Les 20 objets les plus récents
          </Text>
        </View>
        {!loading ? (
          <View style={styles.Products}>
            {data.map((item, index) => (
              <ProductCard
                key={index}
                product={item}
                isOwner={item.user_id.toString() == userID}
                badgeText={'Récent'}
                user={item.user}
                isAuthenticated={isAuthenticated}
                navigation={navigation}
                onPress={() => {
                  navigation.navigate('Details', {
                    objectId: item.id,
                  });
                }}
              />
            ))}
            <ButtonPrimary
              text={'Voir plus'}
              style={{width: '100%'}}
              imageRight={require('../../assets/icons/Forward.png')}
              onPress={() => navigation.navigate('SearchFilter')}
            />
          </View>
        ) : (
          <View style={{height: Dimensions.get('screen').height * 0.4}}>
            <IsLoading />
          </View>
        )}
      </Container>
    </>
  );
};
const styles = StyleSheet.create({
  Title: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  TitleContent: {
    fontSize: 15,
    color: colors.white,
    fontFamily: 'Asul-Bold',
  },
  Products: {
    marginVertical: 20,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10,
  },
});
export default Home;
