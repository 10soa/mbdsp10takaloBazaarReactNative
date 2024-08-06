import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, Modal, FlatList, Button, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Container from '../../../components/Container';
import colors from '../../../constants/color';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { getCategories } from '../../../service/CategoryService';
import { createObject } from '../../../service/ObjectService';
import IsLoading from '../../../components/IsLoading';
import { initDB, insertDraft, getDrafts, deleteDrafts } from '../../../constants/database';

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
const { width: screenWidth } = Dimensions.get('window');

const AddObject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [drafts, setDrafts] = useState([]);

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

  const handleSaveDraft = async () => {
    if (!title) {
      Alert.alert('Erreur', 'Le champ Libellé est obligatoire!');
      return;
    }

    const draft = {
      name: title,
      description,
      category_id: categorie,
      image_file: photo,
      user_id: 52,
    };

    try {
      await insertDraft(draft);
      Alert.alert('Succès', 'Brouillon enregistré.');
      setCategorie("");
      setTitle("");
      setDescription("");
      setPhoto(null);
      fetchDrafts();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'enregistrement du brouillon.');
      console.error('Error in handleSaveDraft:', error.message);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await checkAndRequestPermission();
    if (!hasPermission) {
      Alert.alert('Permission refusée', 'La permission de lire le stockage externe est requise.');
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
          Alert.alert('Erreur', 'Une erreur est survenue lors de la conversion de l\'image.');
        }
      } else {
        console.error('Image URI est undefined ou invalide');
      }
    });
  };

  const handleDraftPress = (item) => {
    setTitle(item.name);
    setDescription(item.description);
    setCategorie(item.category_id);
    setPhoto(item.image_file);
    setModalVisible(false);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchDrafts = async () => {
    try {
      const drafts = await new Promise((resolve, reject) => {
        getDrafts((result) => {
          resolve(result);
        });
      });
      setDrafts(drafts);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des brouillons.');
      console.error('Error fetching drafts:', error.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    initDB();
    fetchDrafts();
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonBrouillon} onPress={() => setModalVisible(true)}>
          <Image source={require('../../../assets/icons/OpenEnvelope.png')} resizeMode="contain" style={{ width: 30, height: 30, tintColor: '#fff' }} />
          <Text style={styles.buttonText}>Brouillons</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonAjouter} onPress={handleSaveDraft}>
        <Image source={require('../../../assets/icons/Save.png')} resizeMode="contain" style={{ width: 30, height: 30, tintColor: '#fff' }} />
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
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
            <Image source={require('../../../assets/icons/clodes.png')} resizeMode="contain" style={{ width: 100, height: 100, tintColor: '#D6CDBD' }} />
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.buttonContainerTake}>
        <TouchableOpacity  onPress={selectPhoto}>
          <Image source={require('../../../assets/icons/Picture.png')} resizeMode="contain" style={{ width: 50, height: 50, tintColor: colors.textPrimary }} />
        </TouchableOpacity>
        <TouchableOpacity  onPress={takePhoto}>
        <Image source={require('../../../assets/icons/Camera.png')} resizeMode="contain" style={{ width: 45, height: 43, tintColor: colors.textPrimary,marginTop : 3 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonAjouter} onPress={handleSubmit}>
        <Image source={require('../../../assets/icons/plus.png')} resizeMode="contain" style={{ width: 30, height: 30, tintColor: '#fff' }} />
          <Text style={styles.buttonText}>Créer l'objet</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalBackground}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Charger Brouillon</Text>
            <FlatList
              data={drafts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.draftItem}>
                  <TouchableOpacity style={styles.textContainer} onPress={() => handleDraftPress(item)}>
                    <Text style={styles.draftTitle}>{item.name}</Text>
                    <Text style={styles.draftDescription}>{item.description}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonSpp} onPress={async () => {
                    try {
                      await deleteDrafts(item.id);
                      Alert.alert('Succès', 'Brouillon supprimé.');
                      fetchDrafts();
                    } catch (error) {
                      Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression du brouillon.');
                      console.error('Error deleting draft:', error.message);
                    }
                  }}>
                    <Image source={require('../../../assets/icons/Remove2.png')} resizeMode="contain" style={{ width: 30, height: 30, tintColor:colors.primary }} />
                  </TouchableOpacity>
                </View>
              )}
            />
            <TouchableOpacity style={styles.buttonClose} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.buttonCloseText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View> 
      </Modal>
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
    marginBottom :30
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
    flexDirection: 'row',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  draftDescription: {
    fontSize: 14,
    color: '#666',
    width : 250
  },
  buttonSpp: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: 30,
  },
  buttonBrouillon: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    backgroundColor: colors.secondary,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    fontStyle : 'italic',
    marginBottom: 15,
    textAlign: 'left',
    alignSelf: 'flex-start',
    color : colors.secondary
  },
  draftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  draftTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    width : 250
  },
  trashButton: {
    marginLeft: 10,
  },
  trashText: {
    color: 'red',
  },
  buttonClose: {
    marginTop: 50,
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 10,
    alignSelf: 'flex-end'
  },
  buttonCloseText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddObject;
