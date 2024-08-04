import React from 'react';
import {View, TextInput, StyleSheet, Image} from 'react-native';

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icons/Search.png')}
        resizeMode="contain"
        style={{width: 30, height: 30, tintColor: '#000'}}
      />
      <TextInput
        style={styles.input}
        placeholder="Recherchez des objets...."
        placeholderTextColor="#A9A9A9"
      />
    </View>
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
  },
});

export default SearchBar;
