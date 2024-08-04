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

const {width: viewportWidth} = Dimensions.get('window');

const data = [
  {
    title: 'Pegasus Trail Gortex',
    subtitle: 'Just Do it',
    image: 'https://image.png',
  },
  {
    title: 'Air Max',
    subtitle: 'Feel the comfort',
    image: 'https://image.png',
  },
  {
    title: 'Revolution 5',
    subtitle: 'Everyday comfort',
    image: 'https://image.png',
  },
];

const Banner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  let carouselRef = null;

  const renderItem = ({item}) => {
    return (
      <View style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
        <Image source={{uri: item.image}} style={styles.image} />
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
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#FFF',
    fontSize: 14,
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
    backgroundColor: '#C4C4C4',
  },
});

export default Banner;
