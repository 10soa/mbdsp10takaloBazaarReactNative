import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import colors from '../../../constants/color';
import {useNavigation} from '@react-navigation/native';

const {width: viewportWidth} = Dimensions.get('window');

const data = [
  {
    title: 'Échangez vos objets',
    subtitle: 'Découvrez des Objets',
    image: require('../../../assets/img/banner3.png'),
  },
  {
    title: 'Trouvez de nouveaux trésors',
    subtitle: 'Commencez votre Recherche',
    image: require('../../../assets/img/banner.png'),
  },
  {
    title: 'Transformez vos objets en nouvelles opportunités',
    subtitle: 'Explorez Maintenant',
    image: require('../../../assets/img/banner2.png'),
  },
];

const Banner = ({navigation}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  let carouselRef = null;

  const goToList = () => {
    navigation.navigate('SearchFilter');
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity style={styles.ObjectButton} onPress={goToList}>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        </View>
        <Image source={item.image} style={styles.image} />
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={
              index === activeSlide ? styles.activeDot : styles.inactiveDot
            }
            onPress={() => carouselRef.snapToItem(index)}
          />
        ))}
      </View>
    );
  };

  return (
    <View>
      <Carousel
        ref={c => {
          carouselRef = c;
        }}
        data={data}
        renderItem={renderItem}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth - 60}
        onSnapToItem={index => setActiveSlide(index)}
        loop={true}
      />
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#C4C4C4',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontFamily: 'Asul-Bold',
  },
  subtitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Asul-Bold',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    backgroundColor: colors.grey,
  },
  ObjectButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
    padding: 10,
    alignSelf: 'flex-start',
    borderRadius: 10,
  },
});

export default Banner;
