import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList, Platform} from 'react-native';
import {useIsFocused, useRoute} from '@react-navigation/native';
import Container from '../../components/Container';
import colors from '../../constants/color';
import ProductCard from '../../components/ProductCard';
import {getObjects} from '../../service/ObjectService';
import IsLoading from '../../components/IsLoading';
import FilterComponent from './Filtre/filtre';
import Header from '../../components/Header';
import { scale } from 'react-native-size-matters';
import GlobalSafeAreaView from '../../components/GlobalSafeAreaView';

const SearchFilter = ({navigation}) => {
  const route = useRoute();
  const [data, setData] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [filters, setFilters] = useState({
    name: route.params?.name || '',
    description: '',
    category_id: '',
    created_at_start: '',
    created_at_end: '',
    order: 'desc',
  });
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();

  const fetchObjects = async (filters = {}, page = 1, append = false) => {
    try {
      const result = await getObjects(
        page,
        20,
        filters.order || 'desc',
        filters,
        navigation
      );

      if (result.objects.length > 0) {
        setData(prevData =>
          append ? [...prevData, ...result.objects] : result.objects,
        );
        setHasMoreData(result.objects.length > 0);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreData = () => {
    if (!loadingMore && hasMoreData) {
      setLoadingMore(true);
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchObjects(filters, nextPage, true);
        return nextPage;
      });
    }
  };

  useEffect(() => {
    if (isFocused) {
      setFilters(prevFilters => ({
        ...prevFilters,
        name: route.params?.name || '',
      }));
      setData([]);
      setLoading(true);
      setHasMoreData(true);
      setLoadingMore(false);
      setPage(1);
      fetchObjects({...filters, name: route.params?.name || ''},1,false);
    }
  }, [isFocused]);

  const handleApplyFilters = (newFilters,setVisible) => {
    setLoading(true);
    setFilters(newFilters);
    setData([]);
    setHasMoreData(true);
    setLoadingMore(false);
    setPage(1);
    fetchObjects(newFilters);
    setVisible(false);
  };

  const handleResetFilters = (setVisible) => {
    const defaultFilters = {
      name: '',
      description: '',
      category_id: '',
      created_at_start: '',
      created_at_end: '',
      order: 'desc',
    };
    setLoading(true);
    setFilters(defaultFilters);
    setHasMoreData(true);
    setLoadingMore(false);
    setPage(1);
    fetchObjects(defaultFilters);
    setVisible(false);
  };

  return (
    <GlobalSafeAreaView>
      <Header
        haveLine
        title="Liste des objets"
        color={colors.textPrimary}
        navigation={navigation}
        backgroundColor={colors.white}
      />
      <FilterComponent
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        filters={filters}
        visible={isVisible}
      />
      {loading ? (
        <IsLoading />
      ) : (
        <Container paddingVerticalDisabled>
          <FlatList
            data={data}
            renderItem={({item, index}) => (
              <ProductCard
                key={index}
                styleCard={{marginHorizontal: scale(5)}}
                product={item}
                user={item.user}
                navigation={navigation}
                onPress={() => {
                  navigation.navigate('Details', {
                    objectId: item.id,
                  });
                }}
              />
            )}
            keyExtractor={(item, index) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.Products}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loadingMore ? <IsLoading /> : null}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>Aucun résultat trouvé</Text>
            }
          />
          {error && (
            <Text
              style={{
                color: colors.primary,
                fontFamily: 'Asul',
                textAlign: 'center',
              }}>
              {error.message}
            </Text>
          )}
        </Container>
      )}
    </GlobalSafeAreaView>
  );
};

const styles = StyleSheet.create({
  noResultsText: {
    marginTop: 20,
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    width: '100%',
    fontFamily: 'Asul',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 0,
    borderTopLeftRadius: 10,
    marginTop: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontFamily: 'Asul-Bold',
  },
});

export default SearchFilter;
