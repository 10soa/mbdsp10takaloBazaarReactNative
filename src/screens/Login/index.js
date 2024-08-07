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
import {useState} from 'react';
import {log} from '../../service/AuthService';

const Login = ({text, home, navigation}) => {
  const [email, setEmail] = useState('bjones');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('password');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      let valid = true;
      setLoading(true);
      setErrorMessage('');
      if (!email) {
        setEmailError('Email est requis');
        valid = false;
      } else {
        setEmailError('');
      }

      if (!password) {
        setPasswordError('Mot de passe est requis');
        valid = false;
      } else {
        setPasswordError('');
      }

      if (!valid) return;

      await log(email, password);
      setLoading(false);
      if (home === true) {
        navigation.navigate('Home');
        return;
      } else {
        navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/img/logo-color.png')}
        style={styles.logo}
      />
      {text && <Text style={styles.subtitle}>{text}</Text>}

      <View
        style={[
          styles.inputContainer,
          emailError ? {borderColor: 'red'} : {borderColor: 'transparent'},
        ]}>
        <Image
          source={require('../../assets/icons/User.png')}
          style={styles.icon}
        />
        <TextInput
          placeholder="Pseudo ou email"
          placeholderTextColor={colors.darkGrey}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <View
        style={[
          styles.inputContainer,
          passwordError ? {borderColor: 'red'} : {borderColor: 'transparent'},
        ]}>
        <Image
          source={require('../../assets/icons/Lock.png')}
          style={styles.icon}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.darkGrey}
          secureTextEntry={true}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}
      {errorMessage ? (
        <Text style={[styles.errorText, {textAlign: 'center'}]}>
          {errorMessage}
        </Text>
      ) : null}
      {loading ? (
        <View
          style={[styles.button, {backgroundColor: colors.secondary, flexDirection: 'row', justifyContent: 'center'}]}
          onPress={handleLogin}>
          <ActivityIndicator
            animating={loading}
            size={25}
            color={colors.white}
          />
          <Text style={[styles.buttonText,{marginLeft: 10}]}>Se connecter</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.orText}>Ou</Text>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: colors.black}]}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  subtitle: {
    marginBottom: 30,
    fontSize: 16,
    color: colors.darkGrey,
    fontFamily: 'Asul-Bold',
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
