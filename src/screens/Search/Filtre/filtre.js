import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
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

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisibleMax, setDatePickerVisibilityMax] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setName(filters.name);
        setOrder(filters.order);
        setDateMin(filters.created_at_start);
        setDateMax(filters.created_at_end);
        setDescription(filters.description);
        setCategory(filters.category_id);
        const result = await getCategories();
        setIsFilterVisible(visible);
        setDataCat(result);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const handleConfirmMin = (date) => {
    setDateMin(date.toISOString().split('T')[0]);
    setDatePickerVisibility(false);
  };

  const handleConfirmMax = (date) => {
    setDateMax(date.toISOString().split('T')[0]);
    setDatePickerVisibilityMax(false);
  };

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
            width: scale(20),
            height: scale(20),
            tintColor: colors.darkGrey,
            marginRight: scale(5),
            marginBottom: scale(10),
          }}
        />
        <Text style={styles.title}>Filtres</Text>
        <Image
          source={require('../../../assets/icons/Down.png')}
          resizeMode="contain"
          style={[
            {
              width: scale(20),
              height: scale(20),
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

          <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
            <TextInput
              label="Date de création min"
              value={dateMin}
              style={styles.input}
              mode="outlined"
              theme={{colors: {primary: 'grey', text: 'grey'}}}
              editable={false}
              right={<TextInput.Icon name="calendar" />}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setDatePickerVisibilityMax(true)}>
            <TextInput
              label="Date de création max"
              value={dateMax}
              style={styles.input}
              mode="outlined"
              theme={{colors: {primary: 'grey', text: 'grey'}}}
              editable={false}
              right={<TextInput.Icon name="calendar" />}
            />
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmMin}
            onCancel={() => setDatePickerVisibility(false)}
          />

          <DateTimePickerModal
            isVisible={isDatePickerVisibleMax}
            mode="date"
            onConfirm={handleConfirmMax}
            onCancel={() => setDatePickerVisibilityMax(false)}
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
                style={{width: scale(25), height: scale(25), tintColor: '#fff'}}
              />
              <Text style={styles.buttonText}>Filtrer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonRest}
              onPress={handleResetFilters}>
              <Image
                source={require('../../../assets/icons/Reboot.png')}
                resizeMode="contain"
                style={{width: scale(15), height: scale(15), tintColor: '#fff'}}
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
    padding: scale(20),
    backgroundColor: colors.white,
  },
  title: {
    fontSize: scale(18),
    marginBottom: scale(10),
    color: colors.darkGrey,
    fontFamily: 'Asul-Bold',
  },
  filtre: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(10),
  },
  input: {
    marginBottom: scale(10),
    fontFamily: 'Asul',
  },
  pickerContainer: {
    marginBottom: scale(10),
  },
  pickerWrapper: {
    borderWidth: scale(1),
    borderColor: 'grey',
    borderRadius: scale(5),
    marginTop: scale(6),
  },
  textInput: {
    fontFamily: 'Asul',
  },
  picker: {
    height: scale(50),
    fontFamily: 'Asul',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(10),
  },
  buttonFind: {
    flex: 1,
    height: scale(50),
    flexDirection: 'row',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(5),
    marginHorizontal: scale(5),
  },
  buttonText: {
    color: '#fff',
    fontSize: scale(16),
    marginLeft: scale(2),
    fontFamily: 'Asul-Bold',
  },
  buttonRest: {
    flex: 1,
    height: scale(50),
    flexDirection: 'row',
    backgroundColor: colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(5),
    marginHorizontal: scale(5),
  },
});

export default FilterComponent;
