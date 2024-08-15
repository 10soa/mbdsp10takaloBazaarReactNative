import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const handleSearch = () => {
    if (searchQuery) {
      navigation.navigate('SearchFilter', {name: searchQuery});
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleSearch}>
      <Image
        source={require('../assets/icons/Search.png')}
        resizeMode="contain"
        style={{width: 30, height: 30, tintColor: '#000'}}
      />
      <TextInput
        value={searchQuery}
        style={styles.input}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        placeholder="Recherchez des objets...."
        placeholderTextColor="#A9A9A9"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginVertical: 20,
    gap: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Asul',
  },
});

export default SearchBar;
