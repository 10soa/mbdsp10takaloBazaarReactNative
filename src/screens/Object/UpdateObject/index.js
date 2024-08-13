import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Container from '../../../components/Container';
import colors from '../../../constants/color';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { getCategories } from '../../../service/CategoryService';
import { getObject, updateObject } from '../../../service/ObjectService';
import IsLoading from '../../../components/IsLoading';
import { NavigationActions } from 'react-navigation';
import { useIsFocused,useRoute } from '@react-navigation/native';
import CustomText from '../../../components/CustomText';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

const getBase64ImageFiche = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          let base64String = reader.result;
          base64String = base64String.replace(/^data:image\/\w+;base64,/, '');
          resolve(base64String);
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

const UpdateObject = ({ route, navigation }) => {
  const  objectId = route.params?.idObject;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [categorieError, setCategorieError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    clearError();
    const fetchData = async () => {
      try {
        setLoading(true);
        const categories = await getCategories();
        setData(categories);

        const objectData = await getObject(objectId);
        setTitle(objectData.name);
        setDescription(objectData.description);
        setCategorie(objectData.category_id);
        const base64Image = await getBase64ImageFiche(objectData.image);
        setPhoto(base64Image);
      } catch (error) {
        setError(error);
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [objectId]);

  const clearError = () => {
    setCategorieError('');
    setTitleError('');
    setDescriptionError('');
    setPhotoError('');
    setError('');
  };

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

  const takePhoto = async () => {
    const hasPermission = await checkAndRequestPermission();
    if (!hasPermission) {
      setPhotoError('La permission de lire le stockage externe est requise.');
      //Alert.alert('Permission refusée', 'La permission de lire le stockage externe est requise.');
      return;
    }

    launchCamera({}, async (response) => {
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
          setPhotoError(
            "Une erreur est survenue lors de la conversion de l'image.",
          );
          //Alert.alert('Erreur', 'Une erreur est survenue lors de la conversion de l\'image.');
        }
      } else {
        console.error('Image URI est undefined ou invalide');
      }
    });
  };

  const handleUpdate = async () => {
    /*if (!title || !description || !categorie || !photo) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }*/
      clearError();
      let valid = true;
      if (!title) {
        setTitleError('Le champ Libellé est obligatoire!');
        valid = false;
      }
      if (!description) {
        setDescriptionError('Le champ description est obligatoire!');
        valid = false;
      }
      if (!categorie) {
        setCategorieError('Vous devez selectionnez une catégorie!');
        valid = false;
      }
      if (!photo) {
        setPhotoError('Vous devez télécharger une photo');
        valid = false;
      }
      if (!valid) {
        return;
      }

    const objectData = {
      name: title,
      description,
      category_id: categorie,
      image_file: photo,
    };

    try {
      setLoading(true);
      await updateObject(objectId, objectData, navigation);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour de l\'objet.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <IsLoading />;
  }

  return (
    <Container isScrollable>
      <Text style={styles.title}>Modification d'un objet</Text>
      <Text style={styles.label}>Libellé</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        keyboardType="default"
        value={title}
        onChangeText={setTitle}
      />
      {titleError && <CustomText text={titleError} style={styles.error} />}
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
      {descriptionError && (
        <CustomText text={descriptionError} style={styles.error} />
      )}
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
      {categorieError && (
        <CustomText text={categorieError} style={styles.error} />
      )}
      <Text style={styles.label}>Image de l'objet</Text>
      <TouchableOpacity style={styles.photoContainer} onPress={selectPhoto}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={styles.placeholder}>
            <Image source={require('../../../assets/icons/clodes.png')} resizeMode="contain" style={{ width: 100, height: 100, tintColor: '#D6CDBD' }} />
          </View>
        )}
      </TouchableOpacity>
      {photoError && <CustomText text={photoError} style={styles.error} />}
      <View style={styles.buttonContainerTake}>
        <TouchableOpacity onPress={selectPhoto}>
          <Image source={require('../../../assets/icons/Picture.png')} resizeMode="contain" style={{ width: 50, height: 50, tintColor: colors.textPrimary }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto}>
          <Image source={require('../../../assets/icons/Camera.png')} resizeMode="contain" style={{ width: 45, height: 43, tintColor: colors.textPrimary, marginTop: 3 }} />
        </TouchableOpacity>
      </View>
      {error && (
        <CustomText
          text={error}
          style={[styles.error, {textAlign: 'center'}]}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonAjouter} onPress={handleUpdate}>
          <Image source={require('../../../assets/icons/Edit.png')} resizeMode="contain" style={{ width: 25, height: 25, tintColor: '#fff' }} />
          <Text style={styles.buttonText}>Modifier</Text>
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  error: {
    color: colors.error,
    fontSize: 18,
    marginBottom: 5,
    marginTop: -10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonContainerTake: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonAjouter: {
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
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default UpdateObject;
