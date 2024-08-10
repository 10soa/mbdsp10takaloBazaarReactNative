import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useIsFocused,useRoute } from '@react-navigation/native';
import Container from '../../components/Container';
import colors from '../../constants/color';
import ProductCard from '../../components/ProductCard';
import { getObjects } from '../../service/ObjectService';
import IsLoading from '../../components/IsLoading';
import FilterComponent from './Filtre/filtre';

const SearchFilter = ({ navigation }) => {
  const route = useRoute();
  const [data, setData] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
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

  const fetchObjects = async (filters = {}) => {
    setLoading(true);
    try {
      console.log('Fetching objects with filters:', filters);
      const result = await getObjects(1, 1000, filters.order || 'desc', filters);
      setData(result.objects);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchObjects(filters);
    }
  }, [isFocused]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    fetchObjects(newFilters);
    setIsVisible(false);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      name: '',
      description: '',
      category_id: '',
      created_at_start: '',
      created_at_end: '',
      order: 'desc',
    };
    setFilters(defaultFilters);
    fetchObjects(defaultFilters);
    setIsVisible(true);
  };

  if (loading) {
    return <IsLoading />;
  }

  return (
    <Container isScrollable paddingVerticalDisabled>
      <FilterComponent 
        onApplyFilters={handleApplyFilters} 
        onResetFilters={handleResetFilters} 
        filters={filters}
        visible={isVisible}
      />
      <View style={styles.Products}>
        {data.map((item, index) => (
          <ProductCard
            key={index}
            product={item}
            user={item.user}
            onPress={() => {
              navigation.navigate('Details', {
                objectId: item.id,
              });
            }}
          />
        ))}
      </View>
      {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
    </Container>
  );
};

const styles = StyleSheet.create({
  Products: {
    marginVertical: 20,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 10,
  },
});

export default SearchFilter;
