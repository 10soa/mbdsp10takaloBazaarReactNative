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
import {useContext, useState} from 'react';
import {log} from '../../service/AuthService';
import {AuthContext} from '../../context/AuthContext';
import {validateForm} from '../../service/Function';
import Container from '../../components/Container';

const Login = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {setIsAuthenticated} = useContext(AuthContext);
  let text = route.params?.text || '';
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

  const redirectTo = route.params?.routeName || 'Home';
  const goToSignup = () => {
    navigation.navigate('Signup', {routeName: redirectTo, textLogin: text});
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
              ? {borderColor: 'red'}
              : {borderColor: 'transparent'},
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
              ? {borderColor: 'red'}
              : {borderColor: 'transparent'},
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
          <Text style={[styles.errorText, {textAlign: 'center'}]}>
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
            <Text style={[styles.buttonText, {marginLeft: 10}]}>
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
          style={[styles.button, {backgroundColor: colors.black}]}>
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
    color: colors.black,
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
});

export default Login;
