import React, { useState, useEffect, StrictMode } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Container from '../../../components/Container';
import colors from '../../../constants/color';
import { launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { getCategories } from '../../../service/CategoryService';
import { createObject } from '../../../service/ObjectService';
import IsLoading from '../../../components/IsLoading';

const getBase64Image = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = reader.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        resolve(`data:image/png;base64,${base64String}`);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error.message);
    throw error;
  }
};

const checkAndRequestPermission = async () => {
  const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  if (result === RESULTS.GRANTED) {
    return true;
  }

  const requestResult = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  return requestResult === RESULTS.GRANTED;
};

const AddObject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const selectPhoto = async () => {
    const hasPermission = await checkAndRequestPermission();
    if (!hasPermission) {
      Alert.alert('Permission refusée', 'La permission de lire le stockage externe est requise.');
      return;
    }

    launchImageLibrary({}, async (response) => {
      if (response.didCancel) {
        console.log('Annuler');
      } else if (response.errorCode) {
        console.log('Une erreur s\'est produite : ', response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        try {
          const base64Image = await getBase64Image(response.assets[0].uri);
          setPhoto(base64Image);
        } catch (error) {
          console.error('Error processing image:', error.message);
          Alert.alert('Erreur', 'Une erreur est survenue lors de la conversion de l\'image.');
        }
      } else {
        console.error('Image URI est undefined ou invalide');
      }
    });
  };

  const handleSubmit = async () => {
    if (!title || !description || !categorie || !photo) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    const objectData = {
      name: title,
      description,
      category_id: categorie,
      image_file: photo,
      user_id: 52,
    };

    try {
      setLoading(true);
      const result = await createObject(objectData);
      Alert.alert('Succès', 'Objet ajouté avec succès !');
      setCategorie("");
      setTitle("");
      setDescription("");
      setPhoto(null);
      setLoading(false);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout de l\'objet.');
      console.error('Error in handleSubmit:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getCategories();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <IsLoading />;
  }

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
          {data.map((item) => (
            <Picker.Item key={item.id} label={item.name} value={item.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Image de l'objet</Text>
      <TouchableOpacity style={styles.photoContainer} onPress={selectPhoto}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
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
        <TouchableOpacity style={styles.buttonAjouter} onPress={handleSubmit}>
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
