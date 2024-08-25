import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import colors from '../../constants/color';
import { useCallback, useContext, useState } from 'react';
import { log, register } from '../../service/AuthService';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { validateForm } from '../../service/Function';
import Container from '../../components/Container';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

const Signup = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setIsAuthenticated, setuserID } = useContext(AuthContext);
  const textLogin = route.params?.textLogin || '';
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    pseudo: '',
    nom: '',
    prenom: '',
    sexe: '',
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    pseudo: '',
    nom: '',
    prenom: '',
    sexe: '',
  });

  const [open, setOpen] = useState(false);

  const [gender, setGender] = useState([
    { label: 'Selectionnez votre sexe', value: '' },
    { label: 'Homme', value: 'Male' },
    { label: 'Femme', value: 'Female' },
  ]);

  const handleInputChange = (name, value) => {
    console.log('value', name, value);

    setErrorMessage('');
    setFormData({
      ...formData,
      [name]: value,
    });

    if (value !== '') {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    } else {
      setFormErrors({
        ...formErrors,
        [name]: name + ' est obligatoire',
      });
    }
  };

  const redirectTo = route.params?.routeName || 'Home';

  useFocusEffect(
    useCallback(() => {
      setFormErrors({
        email: '',
        password: '',
        pseudo: '',
        nom: '',
        prenom: '',
        sexe: '',
      });
      return () => {};
    }, []),
  );

  const goToLogin = () => {
    navigation.navigate('User', { routeName: redirectTo, text: textLogin });
  };

  const handleSignup = async () => {
    try {
      let valid = true;
      setLoading(true);
      setErrorMessage('');
      valid = validateForm(
        ['email', 'password', 'pseudo', 'nom', 'sexe', 'prenom'],
        formData,
        setFormErrors,
      );

      if (!valid) {
        setLoading(false);
        return;
      }

      const user = {
        first_name: formData.prenom,
        last_name: formData.nom,
        username: formData.pseudo,
        email: formData.email,
        password: formData.password,
        gender: formData.sexe,
      };

      const data = await register(user);
      setLoading(false);
      setIsAuthenticated(true);
      setuserID(data.id.toString());
      navigation.navigate(redirectTo);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <Container isScrollable>
      <View style={styles.container}>
        <Image
          source={require('../../assets/img/logo-color.png')}
          style={styles.logo}
        />
        <Text style={styles.subtitle}>
          Rejoignez la communauté et commencez à échanger vos objets dès
          aujourd'hui !
        </Text>
        <View
          style={[
            styles.inputContainer,
            formErrors.nom
              ? { borderColor: 'red' }
              : { borderColor: 'transparent' },
          ]}>
          <Image
            source={require('../../assets/icons/Name.png')}
            style={styles.icon}
          />
          <TextInput
            placeholder="Nom"
            placeholderTextColor={colors.darkGrey}
            style={styles.input}
            value={formData.nom}
            onChangeText={text => handleInputChange('nom', text)}
          />
        </View>
        {formErrors.nom ? (
          <Text style={styles.errorText}>{formErrors.nom}</Text>
        ) : null}
        <View
          style={[
            styles.inputContainer,
            formErrors.prenom
              ? { borderColor: 'red' }
              : { borderColor: 'transparent' },
          ]}>
          <Image
            source={require('../../assets/icons/Name.png')}
            style={styles.icon}
          />
          <TextInput
            placeholder="Prénom"
            placeholderTextColor={colors.darkGrey}
            style={styles.input}
            value={formData.prenom}
            onChangeText={text => handleInputChange('prenom', text)}
          />
        </View>
        {formErrors.prenom ? (
          <Text style={styles.errorText}>{formErrors.prenom}</Text>
        ) : null}

        <View
          style={[
            styles.inputContainer,
            formErrors.pseudo
              ? { borderColor: 'red' }
              : { borderColor: 'transparent' },
          ]}>
          <Image
            source={require('../../assets/icons/Username.png')}
            style={styles.icon}
          />
          <TextInput
            placeholder="Pseudo"
            placeholderTextColor={colors.darkGrey}
            style={styles.input}
            value={formData.pseudo}
            onChangeText={text => handleInputChange('pseudo', text)}
          />
        </View>
        {formErrors.pseudo ? (
          <Text style={styles.errorText}>{formErrors.pseudo}</Text>
        ) : null}
        <View
          style={[
            styles.inputContainer,
            formErrors.sexe
              ? { borderColor: 'red' }
              : { borderColor: 'transparent' },
            { paddingLeft: 30, paddingRight: 20 },
          ]}>
          <Image
            source={require('../../assets/icons/Gender.png')}
            style={[styles.icon, { marginRight: 0 }]}
          />
          {/* <Picker
            selectedValue={formData.sexe}
            style={[styles.picker]}
            onValueChange={itemValue => handleInputChange('sexe', itemValue)}>
            {gender.map(item => (
              <Picker.Item
                key={item.value}
                label={item.name}
                value={item.value}
                style={{
                  fontFamily: 'Asul',
                  fontSize: 17,
                  color: colors.darkGrey,
                }}
              />
            ))}
          </Picker> */}
          <DropDownPicker
            open={open}
            value={formData.sexe}
            items={gender}
            setOpen={setOpen}
            setValue={callback => {
              const selectedValue = callback();
              handleInputChange('sexe', selectedValue);
            }}
            setItems={setGender}
            dropDownDirection="TOP"
            placeholder="Selectionnez votre sexe"
            style={[styles.picker]}
            dropDownContainerStyle={[styles.picker]}
            textStyle={{
              fontFamily: 'Asul',
              fontSize: 17,
              color: colors.darkGrey,
            }}
          />
        </View>
        {formErrors.sexe ? (
          <Text style={styles.errorText}>{formErrors.sexe}</Text>
        ) : null}
        <View
          style={[
            styles.inputContainer,
            formErrors.email
              ? { borderColor: 'red' }
              : { borderColor: 'transparent' },
          ]}>
          <Image
            source={require('../../assets/icons/Email.png')}
            style={styles.icon}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.darkGrey}
            style={styles.input}
            value={formData.email}
            onChangeText={text => handleInputChange('email', text)}
          />
        </View>
        {formErrors.email ? (
          <Text style={styles.errorText}>{formErrors.email}</Text>
        ) : null}
        <View
          style={[
            styles.inputContainer,
            formErrors.password
              ? { borderColor: 'red' }
              : { borderColor: 'transparent' },
          ]}>
          <Image
            source={require('../../assets/icons/Lock.png')}
            style={styles.icon}
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor={colors.darkGrey}
            secureTextEntry={true}
            style={styles.input}
            value={formData.password}
            onChangeText={text => handleInputChange('password', text)}
          />
        </View>
        {formErrors.password ? (
          <Text style={styles.errorText}>{formErrors.password}</Text>
        ) : null}
        {errorMessage ? (
          <Text style={[styles.errorText, { textAlign: 'center' }]}>
            {errorMessage}
          </Text>
        ) : null}
        {loading ? (
          <View
            style={[
              styles.button,
              {
                backgroundColor: colors.secondary,
                flexDirection: 'row',
                justifyContent: 'center',
              },
            ]}>
            <ActivityIndicator
              animating={loading}
              size={25}
              color={colors.white}
            />
            <Text style={[styles.buttonText, { marginLeft: 10 }]}>
              S'inscrire
            </Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.orText}>Ou</Text>

        <TouchableOpacity
          onPress={goToLogin}
          style={[styles.button, { backgroundColor: colors.textPrimary }]}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 30,
  },
  subtitle: {
    marginBottom: 30,
    fontSize: 16,
    color: colors.darkGrey,
    fontFamily: 'Asul-Bold',
    textAlign: 'center',
    marginTop: -20,
  },
  logo: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: '100%',
    elevation: 4,
    borderWidth: 2,
  },
  errorText: {
    color: colors.error,
    marginVertical: 10,
    fontFamily: 'Asul',
    fontSize: 17,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 10,
    tintColor: colors.darkGrey,
    width: 22,
    height: 22,
  },
  input: {
    flex: 1,
    height: 50,
    color: colors.darkGrey,
    fontFamily: 'Asul',
    fontSize: 17,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 20,
    elevation: 4,
  },
  buttonText: {
    color: colors.white,
    fontSize: 22,
    fontFamily: 'Asul-Bold',
  },
  orText: {
    color: colors.darkGrey,
    marginVertical: 10,
    fontFamily: 'Asul',
  },
  picker: {
    width: '100%',
    fontFamily: 'Asul',
    fontSize: 17,
    color: colors.darkGrey,
    borderColor: 'transparent',
    backgroundColor: '#f1f1f1',
    zIndex: 1000,
  },
});

export default Signup;
