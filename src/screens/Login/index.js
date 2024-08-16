import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import colors from '../../constants/color';
import { useCallback, useContext, useEffect, useState } from 'react';
import { log } from '../../service/AuthService';
import { AuthContext } from '../../context/AuthContext';
import { validateForm } from '../../service/Function';
import Container from '../../components/Container';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { scale } from 'react-native-size-matters';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { setIsAuthenticated, setuserID } = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  let text = route?.params?.text || '';

  useFocusEffect(
    useCallback(() => {
      setFormErrors({
        email: '',
        password: '',
      });
      setErrorMessage('');
      return () => {};
    }, []),
  );

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (name, value) => {
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

  const redirectTo = route?.params?.routeName || 'Home';
  const goToSignup = () => {
    navigation.navigate('Signup', { routeName: redirectTo, textLogin: text });
  };
  const handleLogin = async () => {
    try {
      let valid = true;
      setLoading(true);
      setErrorMessage('');
      valid = validateForm(['email', 'password'], formData, setFormErrors);

      if (!valid) {
        setLoading(false);
        return;
      }

      const user = await log(formData.email, formData.password);
      setLoading(false);
      setIsAuthenticated(true);
      setuserID(user.user.id.toString());
      navigation.navigate(redirectTo);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <Container isScrollable paddingVerticalDisabled>
      <View style={styles.container}>
        <Image
          source={require('../../assets/img/logo-color.png')}
          style={styles.logo}
        />
        {text && <Text style={styles.subtitle}>{text}</Text>}

        <View
          style={[
            styles.inputContainer,
            formErrors.email
              ? { borderColor: 'red' }
              : { borderColor: 'transparent' },
          ]}>
          <Image
            source={require('../../assets/icons/User.png')}
            style={styles.icon}
          />
          <TextInput
            placeholder="Pseudo ou email"
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
            ]}
            onPress={handleLogin}>
            <ActivityIndicator
              animating={loading}
              size={25}
              color={colors.white}
            />
            <Text style={[styles.buttonText, { marginLeft: 10 }]}>
              Se connecter
            </Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.orText}>Ou</Text>

        <TouchableOpacity
          onPress={goToSignup}
          style={[styles.button, { backgroundColor: colors.black }]}>
          <Text style={styles.buttonText}>S'inscrire</Text>
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
    minHeight: Dimensions.get('window').height,
  },
  subtitle: {
    marginBottom: scale(20),
    fontSize: scale(16),
    color: colors.darkGrey,
    fontFamily: 'Asul-Bold',
    textAlign: 'center',
    marginTop: scale(-30),
  },
  logo: {
    marginBottom: scale(30),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: scale(15),
    marginVertical: scale(10),
    paddingHorizontal: scale(15),
    paddingVertical: scale(5),
    width: '100%',
    elevation: scale(4),
    borderWidth: scale(2),
  },
  errorText: {
    color: colors.error,
    marginVertical: scale(10),
    fontFamily: 'Asul',
    fontSize: scale(17),
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: scale(10),
    tintColor: colors.darkGrey,
    width: scale(22),
    height: scale(22),
  },
  input: {
    flex: 1,
    height: scale(42),
    color: colors.black,
    fontFamily: 'Asul',
    fontSize: scale(17),
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: scale(15),
    width: '100%',
    paddingVertical: scale(15),
    alignItems: 'center',
    marginVertical: scale(20),
    elevation: scale(4),
  },
  buttonText: {
    color: colors.white,
    fontSize: scale(21),
    fontFamily: 'Asul-Bold',
  },
  orText: {
    color: colors.darkGrey,
    marginVertical: scale(10),
    fontFamily: 'Asul',
  },
});

export default Login;
