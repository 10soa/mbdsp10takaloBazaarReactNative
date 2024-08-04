import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Container from '../../../components/Container';
import colors from '../../../constants/color';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddObject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('');
  const [photo, setPhoto] = useState(null);

  const selectPhoto = () => {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('Annuler');
      } else if (response.error) {
        console.log('Une erreur s\est produite : ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setPhoto(source);
      }
    });
  };

  return (
    <Container isScrollable>
      <Text style={styles.title}>Ajouter un nouvel objet</Text>
      <Text style={styles.label}>Libellé</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        keyboardType="default"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder=""
        keyboardType="default"
        multiline={true}
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Catégorie</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categorie}
          style={styles.picker}
          onValueChange={(itemValue) => setCategorie(itemValue)}
        >
          <Picker.Item label="..." value="" />
          <Picker.Item label="Moto" value="moto" />
          <Picker.Item label="Vêtements" value="vetements" />
        </Picker>
      </View>

      <Text style={styles.label}>Image de l'objet</Text>
      <TouchableOpacity style={styles.photoContainer} onPress={selectPhoto}>
        {photo ? (
          <Image source={photo} style={styles.photo}/>
        ) : (
          <View style={styles.placeholder}>
            <Image source={require('../../../assets/icons/clodes.png')} resizeMode="contain" style={{ width: 100, height: 100, tintColor: '#D6CDCD' }} />
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonBrouillon}>
          <Text style={styles.buttonText}>Brouillon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonAjouter}>
          <Text style={styles.buttonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
  },
  photoContainer: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 20,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    flex: 1,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonAjouter: {
    flex: 1,
    height: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonBrouillon: {
    flex: 1,
    height: 50,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonAddPhoto: {
    flex: 1,
    height: 50,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddObject;
