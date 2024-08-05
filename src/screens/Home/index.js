import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import HomeHeader from './components/HomeHeader';
import Container from '../../components/Container';
import SearchBar from '../../components/SeachBar';
import Banner from './components/Banner';
import colors from '../../constants/color';
import ProductCard from '../../components/ProductCard';
import {getObjects} from '../../service/ObjectService';
import React, {useEffect, useState} from 'react';
import IsLoading from '../../components/IsLoading';

const Home = ({navigation}) => {
  const products = {
    name: 'Smartphone',
    category: {
      name: 'Television',
    },
    user: {
      username: 'Bjones',
      profile_picture:
        'https://www.jusprofi.at/wp-content/uploads/2020/05/nat%C3%BCrliche-person.jpg',
    },
  };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const filters = {
          name: '',
          description: '',
          category_id: '',
          created_at_start: '',
          created_at_end: '',
        };
        const result = await getObjects(1, 20, 'desc', filters);
        setData(result.objects);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return <IsLoading />;
  }
  return (
    <Container isScrollable paddingVerticalDisabled>
      <HomeHeader style={styles.HomeHeader} />
      <SearchBar />
      <Banner />
      <View style={styles.Title}>
        <Text style={styles.TitleContent}> Les 20 objets les plus récents</Text>
      </View>
      <View style={styles.Products}>
        {data.map((item, index) => (
          <ProductCard
            product={item}
            badgeText={'Récent'}
            user={item.user}
            onPress={() => {
              navigation.navigate('Details', {
                objectId: item.id,
              });
            }}
          />
        ))}
      </View>
    </Container>
  );
};
const styles = StyleSheet.create({
  HomeHeader: {
    marginTop: 10,
  },
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
    fontWeight: 500,
    color: colors.white,
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
