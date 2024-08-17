import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  FlatList,
  Button,
  Dimensions,
  Easing,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Container from '../../../components/Container';
import colors from '../../../constants/color';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {getCategories} from '../../../service/CategoryService';
import {createObject} from '../../../service/ObjectService';
import IsLoading from '../../../components/IsLoading';
import {
  initDB,
  insertDraft,
  getDrafts,
  deleteDrafts,
} from '../../../constants/database';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {getUserId} from '../../../service/SessionService';
import CustomText from '../../../components/CustomText';
import {getBase64Image} from '../../../service/Function';

const checkAndRequestPermission = async () => {
  const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  if (result === RESULTS.GRANTED) {
    return true;
  }

  const requestResult = await request(
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  );
  return requestResult === RESULTS.GRANTED;
};
const {width: screenWidth} = Dimensions.get('window');

const AddObject = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [categorie, setCategorie] = useState('');
  const [categorieError, setCategorieError] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [drafts, setDrafts] = useState([]);

  const clearForm = () => {
    setCategorie('');
    setTitle('');
    setDescription('');
    setPhoto(null);
  };

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
      setPhotoError('La permission de lire le stockage externe est requise.');
      // Alert.alert('Permission refusée', 'La permission de lire le stockage externe est requise.');
      return;
    }

    launchImageLibrary({}, async response => {
      if (response.didCancel) {
        console.log('Annuler');
      } else if (response.errorCode) {
        console.log("Une erreur s'est produite : ", response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        try {
          const base64Image = await getBase64Image(response.assets[0].uri);
          setPhoto(base64Image);
        } catch (error) {
          console.error('Error processing image:', error.message);
          setPhotoError(
            "Une erreur est survenue lors de la conversion de l'image.",
          );
          // Alert.alert('Erreur', 'Une erreur est survenue lors de la conversion de l\'image.');
        }
      } else {
      }
    });
  };

  const handleSaveDraft = async () => {
    clearError();
    if (!title) {
      console.log('rr');

      setTitleError('Le champ Libellé est obligatoire!');
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
      Notifier.clearQueue(true);
      Notifier.showNotification({
        title: 'Succès ',
        description: 'Brouillon enregistré',
        Component: NotifierComponents.Notification,
        duration: 5000,
        showAnimationDuration: 800,
        showEasing: Easing.bounce,
        onHidden: () => console.log('Hidden'),
        hideOnPress: true,
        componentProps: {
          titleStyle: {
            color: colors.secondary,
            fontSize: 20,
            fontFamily: 'Asul-Bold',
          },
          descriptionStyle: {
            color: colors.textPrimary,
            fontSize: 16,
            fontFamily: 'Asul',
          },
        },
      });
      clearForm();
      fetchDrafts();
    } catch (error) {
      setError(
        "Une erreur est survenue lors de l'enregistrement du brouillon.",
      );
      // console.error('Error in handleSaveDraft:', error.message);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await checkAndRequestPermission();
    if (!hasPermission) {
      setPhotoError('La permission de lire le stockage externe est requise.');
      // Alert.alert('Permission refusée', 'La permission de lire le stockage externe est requise.');
      return;
    }

    launchCamera({}, async response => {
      if (response.didCancel) {
        console.log('Annuler');
      } else if (response.errorCode) {
        console.log("Une erreur s'est produite : ", response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        try {
          const base64Image = await getBase64Image(response.assets[0].uri);
          setPhoto(base64Image);
        } catch (error) {
          console.error('Error processing image:', error.message);
          setPhotoError(
            "Une erreur est survenue lors de la conversion de l'image.",
          );
          // Alert.alert('Erreur', 'Une erreur est survenue lors de la conversion de l\'image.');
        }
      } else {
        console.error('Image URI est undefined ou invalide');
      }
    });
  };

  const handleDraftPress = item => {
    setTitle(item.name);
    setDescription(item.description);
    setCategorie(item.category_id);
    setPhoto(item.image_file);
    setModalVisible(false);
  };

  const handleSubmit = async navigation => {
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
      // Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    const objectData = {
      name: title,
      description,
      category_id: categorie,
      image_file: photo,
      user_id: await getUserId(),
    };

    try {
      setLoading(true);
      const result = await createObject(objectData, navigation);

      // Alert.alert('Succès', 'Objet ajouté avec succès !');
      clearForm();
      setLoading(false);
      navigation.navigate('Home');
    } catch (error) {
      setError(error.message);
      // Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout de l\'objet.');
      // console.error('Error in handleSubmit:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrafts = async () => {
    try {
      const drafts = await new Promise((resolve, reject) => {
        getDrafts(result => {
          resolve(result);
        });
      });
      setDrafts(drafts);
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la récupération des brouillons.',
      );
      console.error('Error fetching drafts:', error.message);
    }
  };

  useEffect(() => {
    clearError();
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

  // if (loading) {
  //   return <IsLoading />;
  // }

  return (
    <Container isScrollable>
      <Text style={styles.title}>Ajouter un nouvel objet</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonBrouillon}
          onPress={() => setModalVisible(true)}>
          <Image
            source={require('../../../assets/icons/OpenEnvelope.png')}
            resizeMode="contain"
            style={{width: 30, height: 30, tintColor: '#fff'}}
          />
          <Text style={styles.buttonText}>Brouillons</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonAjouter}
          onPress={handleSaveDraft}>
          <Image
            source={require('../../../assets/icons/Save.png')}
            resizeMode="contain"
            style={{width: 30, height: 30, tintColor: '#fff'}}
          />
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Libellé</Text>
      <TextInput
        style={[styles.input, titleError && styles.borderError]}
        placeholder=""
        keyboardType="default"
        value={title}
        onChangeText={setTitle}
      />
      {titleError && <CustomText text={titleError} style={styles.error} />}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[
          styles.input,
          styles.textarea,
          descriptionError && styles.borderError,
        ]}
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
      <View
        style={[styles.pickerContainer, categorieError && styles.borderError]}>
        <Picker
          selectedValue={categorie}
          style={[styles.picker]}
          onValueChange={itemValue => setCategorie(itemValue)}>
          <Picker.Item label="..." value="" />
          {data.map(item => (
            <Picker.Item
              key={item.id}
              label={item.name}
              value={item.id}
              style={{fontFamily: 'Asul', fontSize: 17}}
            />
          ))}
        </Picker>
      </View>
      {categorieError && (
        <CustomText text={categorieError} style={styles.error} />
      )}
      <Text style={styles.label}>Image de l'objet</Text>
      <TouchableOpacity
        style={[styles.photoContainer, , photoError && styles.borderError]}
        onPress={selectPhoto}>
        {photo ? (
          <Image source={{uri: photo}} style={styles.photo} />
        ) : (
          <View style={styles.placeholder}>
            <Image
              source={require('../../../assets/icons/clodes.png')}
              resizeMode="contain"
              style={[{width: 100, height: 100, tintColor: '#D6CDBD'}]}
            />
          </View>
        )}
      </TouchableOpacity>

      {photoError && <CustomText text={photoError} style={styles.error} />}

      <View style={styles.buttonContainerTake}>
        <TouchableOpacity onPress={selectPhoto}>
          <Image
            source={require('../../../assets/icons/Picture.png')}
            resizeMode="contain"
            style={{width: 50, height: 50, tintColor: colors.textPrimary}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto}>
          <Image
            source={require('../../../assets/icons/Camera.png')}
            resizeMode="contain"
            style={{
              width: 45,
              height: 43,
              tintColor: colors.textPrimary,
              marginTop: 3,
            }}
          />
        </TouchableOpacity>
      </View>
      {error && (
        <CustomText
          text={error}
          style={[styles.error, {textAlign: 'center'}]}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonAjouter}
          onPress={() => {
            handleSubmit(navigation);
          }}>
          <Image
            source={require('../../../assets/icons/plus.png')}
            resizeMode="contain"
            style={{width: 30, height: 30, tintColor: '#fff'}}
          />
          <Text style={styles.buttonText}>Créer l'objet</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalBackground}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Charger Brouillon</Text>
              <FlatList
                data={drafts}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <View style={styles.draftItem}>
                    <TouchableOpacity
                      style={styles.textContainer}
                      onPress={() => handleDraftPress(item)}>
                      <Text style={styles.draftTitle}>{item.name}</Text>
                      <Text style={styles.draftDescription}>
                        {item.description}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonSpp}
                      onPress={async () => {
                        try {
                          await deleteDrafts(item.id);
                          Alert.alert('Succès', 'Brouillon supprimé.');
                          fetchDrafts();
                        } catch (error) {
                          Alert.alert(
                            'Erreur',
                            'Une erreur est survenue lors de la suppression du brouillon.',
                          );
                          console.error('Error deleting draft:', error.message);
                        }
                      }}>
                      <Image
                        source={require('../../../assets/icons/Remove2.png')}
                        resizeMode="contain"
                        style={{
                          width: 30,
                          height: 30,
                          tintColor: colors.black,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {drafts.length === 0 && (
                <CustomText
                  text={"Vous n'avez actuellement aucun brouillon."}
                  style={{fontSize: 20}}
                />
              )}
              <TouchableOpacity
                style={styles.buttonClose}
                onPress={() => setModalVisible(!modalVisible)}>
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
    fontFamily: 'Asul-Bold',
    textAlign: 'center',
    color: colors.primary,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Asul',
    color: colors.darkGrey
  },
  input: {
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontFamily: 'Asul',
    marginBottom: 20,
    fontSize: 17,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
    fontFamily: 'Asul',
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
    fontFamily: 'Asul',
    fontSize: 17,
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
    fontFamily: 'Asul',
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
  draftDescription: {
    fontSize: 16,
    color: '#666',
    width: 250,
    fontFamily: 'Asul',
  },
  borderError: {
    borderWidth: 3,
    borderColor: colors.error,
  },
  buttonSpp: {
    flex: 1,
    height: 40,
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
    fontSize: 19,
    marginLeft: 10,
    fontFamily: 'Asul-Bold',
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
    marginBottom: 15,
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontFamily: 'Asul-Bold',
    color: colors.secondary,
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
    fontSize: 18,
    fontFamily: 'Asul-Bold',
    width: 250,
    color: colors.darkGrey
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
    alignSelf: 'flex-end',
  },
  buttonCloseText: {
    color: 'white',
    fontFamily: 'Asul-Bold',
    fontSize: 18,
  },
  error: {
    color: colors.error,
    fontSize: 18,
    marginBottom: 5,
    marginTop: -10,
  },
});

export default AddObject;
