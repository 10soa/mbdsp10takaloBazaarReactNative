import {StyleSheet, Text, View} from 'react-native';
import HomeHeader from './components/HomeHeader';
import Container from '../../components/Container';
import SearchBar from '../../components/SeachBar';
import Banner from './components/Banner';
import colors from '../../constants/color';
import ProductCard from '../../components/ProductCard';

const Home = props => {
  const products = {
    name: 'Smartphone',
    category: {
      name: 'Television',
    },
    user: {
      username: 'Bjones',
      profile_picture: '',
    },
  };
  return (
    <Container isScrollable paddingVerticalDisabled>
      <HomeHeader style={styles.HomeHeader} />
      <SearchBar />
      <Banner />
      <View style={styles.Title}>
        <Text style={styles.TitleContent}> Les 20 objets les plus récents</Text>
      </View>
      <View style={styles.Products}>
        <ProductCard
          product={products}
          badgeText={'Récent'}
          user={products.user}
        />
        <ProductCard
          product={products}
          badgeText={'Récent'}
          user={products.user}
        />
        <ProductCard
          product={products}
          badgeText={'Récent'}
          user={products.user}
        />
        <ProductCard
          product={products}
          badgeText={'Récent'}
          user={products.user}
        />
        <ProductCard
          product={products}
          badgeText={'Récent'}
          user={products.user}
        />
        <ProductCard
          product={products}
          badgeText={'Récent'}
          user={products.user}
        />
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
    color: colors.textPrimary,
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
