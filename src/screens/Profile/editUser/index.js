/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import colors from '../../../constants/color';
import { getUserFromToken } from '../../../service/SessionService';
import { getUser, updateUserProfile } from '../../../service/UserService';
import { useRoute } from '@react-navigation/native';

const EditUser = ({ navigation }) => {
  const route = useRoute();
  const [idUser, setIdUser] = useState(null);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);

  const [lastNameError, setLastNameError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [genderError, setGenderError] = useState('');

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const tokenData = await getUserFromToken();
      setIdUser(tokenData.id);

      const userData = await getUser(tokenData.id);
      if (userData) {
        setLastName(userData.last_name || '');
        setFirstName(userData.first_name || '');
        setUsername(userData.username || '');
        setEmail(userData.email || '');
        setGender(userData.gender || '');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les informations utilisateur.');
    } finally {
      setLoading(false);
    }
  };

  const refreshError = () => {
    setLastNameError('');
    setFirstNameError('');
    setUsernameError('');
    setEmailError('');
    setGenderError('');
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
      refreshError();
    }, [])
  );

  const validateForm = () => {
    let isValid = true;
    if (!lastName) {
      setLastNameError('Le champ Nom est obligatoire.');
      isValid = false;
    }
    if (!firstName) {
      setFirstNameError('Le champ Prénom est obligatoire.');
      isValid = false;
    }
    if (!username) {
      setUsernameError('Le champ Pseudo est obligatoire.');
      isValid = false;
    }
    if (!email) {
      setEmailError('Le champ Email est obligatoire.');
      isValid = false;
    }
    if (!gender) {
      setGenderError('Vous devez sélectionner un sexe.');
      isValid = false;
    }
    return isValid;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const updatedUser = {
      id: idUser,
      last_name: lastName,
      first_name: firstName,
      username,
      email,
      gender,
    };

    try {
      await updateUserProfile(idUser, updatedUser, 'Votre profil a été mis à jour avec succès !', navigation);
      // Alert.alert('Succès', 'Profil mis à jour avec succès !');

      if (route.params && route.params.onGoBack) {
        route.params.onGoBack();
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update user:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du profil.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/icons/User2.png')}
        resizeMode="contain"
        style={styles.profileImage}
      />
      <Text style={styles.title}>Modification de mon Profil</Text>

      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={[styles.input, lastNameError && styles.borderError]}
        value={lastName}
        onChangeText={text => {
          setLastName(text);
          setLastNameError('');
        }}
      />
      {lastNameError ? <Text style={styles.error}>{lastNameError}</Text> : null}

      <Text style={styles.label}>Prénom</Text>
      <TextInput
        style={[styles.input, firstNameError && styles.borderError]}
        value={firstName}
        onChangeText={text => {
          setFirstName(text);
          setFirstNameError('');
        }}
      />
      {firstNameError ? <Text style={styles.error}>{firstNameError}</Text> : null}

      <Text style={styles.label}>Pseudo</Text>
      <TextInput
        style={[styles.input, usernameError && styles.borderError]}
        value={username}
        onChangeText={text => {
          setUsername(text);
          setUsernameError('');
        }}
      />
      {usernameError ? <Text style={styles.error}>{usernameError}</Text> : null}

      <Text style={styles.label}>Adresse Email</Text>
      <TextInput
        style={[styles.input, emailError && styles.borderError]}
        value={email}
        onChangeText={text => {
          setEmail(text);
          setEmailError('');
        }}
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      <Text style={styles.label}>Sexe</Text>
      <View style={[styles.pickerContainer, genderError && styles.borderError]}>
        <Picker
          selectedValue={gender}
          onValueChange={itemValue => {
            setGender(itemValue);
            setGenderError('');
          }}
          style={styles.picker}>
          <Picker.Item label="Homme" value="Male" />
          <Picker.Item label="Femme" value="Female" />
        </Picker>
      </View>
      {genderError ? <Text style={styles.error}>{genderError}</Text> : null}

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Image
          source={require('../../../assets/icons/Save.png')}
          resizeMode="contain"
          style={{ width: 30, height: 30, tintColor: '#fff', marginRight: 10 }}
        />
        <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Asul-Bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Asul',
    marginBottom: 10,
    color: colors.textPrimary,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontFamily: 'Asul',
    fontSize: 17,
    color: colors.textPrimary,
  },
  pickerItem: {
    fontFamily: 'Asul',
    fontSize: 17,
    color: colors.textPrimary,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'center',
    fontFamily: 'Asul',
    color: colors.textPrimary,
  },
  picker: {
    height: 50,
    fontFamily: 'Asul',
    fontSize: 17,
    color: colors.textPrimary,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 19,
    fontFamily: 'Asul',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    marginBottom: 20,
    alignSelf: 'center',
    tintColor: colors.textPrimary,
  },
  error: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 5,
    marginTop: -5,
    fontFamily: 'Asul',
  },
  borderError: {
    borderColor: colors.error,
  },
});

export default EditUser;
