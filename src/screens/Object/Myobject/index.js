import {
  FlatList,
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import colors from '../../../constants/color';
import {useEffect, useState} from 'react';
import {scale} from 'react-native-size-matters';
import ProductCard from '../../../components/ProductCard';
import {getUserObjects} from '../../../service/ObjectService';
import {getUserFromToken} from '../../../service/SessionService';
import Header from '../../../components/Header';
import IsLoading from '../../../components/IsLoading';

const MyObject = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [myObjects, setMyObjects] = useState([]);
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;

  useEffect(() => {
    const prepareData = async () => {
      try {
        await getObjects(page, '');
      } catch (err) {
        console.error('Failed to fetch user data', err);
      } finally {
        setLoading(false);
      }
    };
    setName('');
    setLoadingMore(false);
    setHasMore(true);
    setPage(1);
    prepareData();
  }, []);

  const getObjects = async (page, name, append = false) => {
    try {
        setPage(page);
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const userData = await getUserFromToken();
      const params = {
        name: name,
        order_direction: 'desc',
        page,
        limit
      };
      const data = await getUserObjects(userData.id, params, navigation);
      console.log('data', data);

      setMyObjects(append ? [...myObjects, ...data.objects] : data.objects);
      setHasMore(data.objects.length > 0);
    } catch (error) {
      console.error('Error fetching objects', error);
      return [];
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setPage(prevPage => prevPage + 1);
      getObjects(page + 1, name, true);
    }
  };

  const renderProductCard = ({item}) => (
    <ProductCard
      product={item}
      onPress={() => {
        navigation.navigate('Details', {
          objectId: item.id,
        });
      }}
    />
  );

  return (
    <>
      <Header navigation={navigation} title="Mes objets" />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Image
            source={require('../../../assets/icons/Search.png')}
            style={styles.icon}
          />
          <TextInput
            placeholder="Recherchez vos objets"
            placeholderTextColor={colors.darkGrey}
            style={styles.input}
            value={name}
            onChangeText={setName}
            onSubmitEditing={() => getObjects(1, name)}
          />
        </View>

        {loading ? (
          <IsLoading />
        ) : (
          <FlatList
            data={myObjects}
            renderItem={renderProductCard}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.flatListContent}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loadingMore ? <ActivityIndicator  color={colors.secondary}/> : null}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(10),
    backgroundColor: colors.white,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: scale(10),
    marginHorizontal: scale(10),
  },
  flatListContent: {
    paddingVertical: scale(10),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    color: colors.darkGrey,
    fontFamily: 'Asul',
    fontSize: 17,
  },
  icon: {
    marginRight: 10,
    tintColor: colors.darkGrey,
    width: 22,
    height: 22,
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
  },
});

export default MyObject;
