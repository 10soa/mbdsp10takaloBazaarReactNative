import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {TextInput} from 'react-native-paper';
import {getCategories} from '../../../service/CategoryService';
import colors from '../../../constants/color';
import {scale} from 'react-native-size-matters';

const FilterComponent = ({
  onApplyFilters,
  onResetFilters,
  filters,
  visible,
}) => {
  const [name, setName] = useState(filters.name);
  const [description, setDescription] = useState(filters.description);
  const [category, setCategory] = useState(filters.category_id);
  const [dateMin, setDateMin] = useState(filters.created_at_start);
  const [dateMax, setDateMax] = useState(filters.created_at_end);
  const [order, setOrder] = useState(filters.order || 'desc');
  const [dataCat, setDataCat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(visible);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getCategories();
        setIsFilterVisible(visible);
        setDataCat(result);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApplyFilters = () => {
    const newFilters = {
      name,
      description,
      category_id: category,
      created_at_start: dateMin,
      created_at_end: dateMax,
      order,
    };
    onApplyFilters(newFilters, setIsFilterVisible);
  };

  const handleResetFilters = () => {
    setName('');
    setDescription('');
    setCategory('');
    setDateMin('');
    setDateMax('');
    setOrder('desc');
    onResetFilters(setIsFilterVisible);
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleFilterVisibility} style={styles.filtre}>
        <Image
          source={require('../../../assets/icons/Funnel.png')}
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            tintColor: colors.darkGrey,
            marginRight: 5,
            marginBottom: 10,
          }}
        />
        <Text style={styles.title}>Filtres</Text>
        <Image
          source={require('../../../assets/icons/Down.png')}
          resizeMode="contain"
          style={[
            {
              width: 20,
              height: 20,
              tintColor: colors.darkGrey,
              marginLeft: 'auto',
            },
            {transform: [{rotate: isFilterVisible ? '180deg' : '0deg'}]},
          ]}
        />
      </TouchableOpacity>

      {isFilterVisible && (
        <View>
          <TextInput
            label="Nom"
            value={name}
            onChangeText={setName}
            style={[styles.input, styles.textInput]}
            mode="outlined"
            theme={{colors: {primary: 'grey', text: 'grey'}}}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            theme={{colors: {primary: 'grey', text: 'grey'}}}
          />

          <View style={styles.pickerContainer}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={category}
                style={styles.picker}
                onValueChange={itemValue => setCategory(itemValue)}>
                <Picker.Item label="Sélectionner une catégorie" value="" />
                {dataCat.map(item => (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <TextInput
            label="Date de création min"
            value={dateMin}
            onChangeText={setDateMin}
            style={styles.input}
            mode="outlined"
            theme={{colors: {primary: 'grey', text: 'grey'}}}
          />

          <TextInput
            label="Date de création max"
            value={dateMax}
            onChangeText={setDateMax}
            style={styles.input}
            mode="outlined"
            theme={{colors: {primary: 'grey', text: 'grey'}}}
          />

          <View style={styles.pickerContainer}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={order}
                style={styles.picker}
                onValueChange={itemValue => setOrder(itemValue)}>
                <Picker.Item label="Le plus récent" value="desc" />
                <Picker.Item label="Le plus ancien" value="asc" />
              </Picker>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonFind}
              onPress={handleApplyFilters}>
              <Image
                source={require('../../../assets/icons/Search.png')}
                resizeMode="contain"
                style={{width: 25, height: 25, tintColor: '#fff'}}
              />
              <Text style={styles.buttonText}>Filtrer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonRest}
              onPress={handleResetFilters}>
              <Image
                source={require('../../../assets/icons/Reboot.png')}
                resizeMode="contain"
                style={{width: 15, height: 15, tintColor: '#fff'}}
              />
              <Text style={styles.buttonText}>Réinitialiser</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: scale(18),
    marginBottom: 10,
    color: colors.darkGrey,
    fontFamily: 'Asul-Bold',
  },
  filtre: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    fontFamily: 'Asul',
  },
  pickerContainer: {
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    marginTop: 6,
  },
  textInput: {
    fontFamily: 'Asul',
  },
  picker: {
    height: 50,
    // color: 'grey',
    fontFamily: 'Asul',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonFind: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 2,
    fontFamily: 'Asul-Bold',
  },
  buttonRest: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    backgroundColor: colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default FilterComponent;
