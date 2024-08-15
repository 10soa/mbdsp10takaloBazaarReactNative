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
import colors from '../../../constants/color';
import {useCallback, useContext, useState} from 'react';
import {AuthContext} from '../../../context/AuthContext';
import {validateForm} from '../../../service/Function';
import Container from '../../../components/Container';
import {useFocusEffect} from '@react-navigation/native';
import {scale} from 'react-native-size-matters';
import {updateUserProfile} from '../../../service/UserService';

const ChangePassword = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {userID} = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      setFormErrors({
        oldPassword: '',
        password: '',
        confirmPassword: '',
      });
      setErrorMessage('');
      setLoading(false);
      return () => {};
    }, []),
  );

  const translateInput = name => {
    switch (name) {
      case 'oldPassword':
        return 'Ancien mot de passe';
      case 'password':
        return 'Nouveau mot de passe';
      case 'confirmPassword':
        return 'Confirmation mot de passe';
      default:
        return name;
    }
  };

  const [formData, setFormData] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: '',
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
        [name]: translateInput(name) + ' est obligatoire',
      });
    }
  };

  const onSubmitRestPassword = async () => {
    setLoading(true);
    setErrorMessage('');
    let valid = true;
    valid = validateForm(
      ['oldPassword', 'password', 'confirmPassword'],
      formData,
      setFormErrors,
      translateInput,
    );
    if (formData.password !== formData.confirmPassword) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        confirmPassword: 'Les mots de passe ne correspondent pas',
      }));
      valid = false;
    }
    if (!valid) {
      setLoading(false);
      return;
    }
    try {
      if (userID) {
        await updateUserProfile(
          userID,
          formData,
          'Le mot de passe a été réinitialisé avec succès.',
          navigation,
        );
        setLoading(false);
        setFormData({
          oldPassword: '',
          password: '',
          confirmPassword: '',
        });
        navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
      setFormData({
        oldPassword: '',
        password: '',
        confirmPassword: '',
      });
      setErrorMessage(error.message);
    }
  };

  return (
    <Container isScrollable paddingVerticalDisabled>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/icons/PasswordBook1.png')}
          style={styles.logo}
        />
        <Text style={styles.subtitle}>Réinitialiser mon mot de passe</Text>

        <View
          style={[
            styles.inputContainer,
            formErrors.oldPassword
              ? {borderColor: 'red'}
              : {borderColor: 'transparent'},
          ]}>
          <Image
            source={require('../../../assets/icons/Lock.png')}
            style={styles.icon}
          />
          <TextInput
            placeholder="Ancien mot de passe"
            placeholderTextColor={colors.darkGrey}
            secureTextEntry={true}
            style={styles.input}
            value={formData.oldPassword}
            onChangeText={text => handleInputChange('oldPassword', text)}
          />
        </View>
        {formErrors.oldPassword ? (
          <Text style={styles.errorText}>{formErrors.oldPassword}</Text>
        ) : null}

        <View
          style={[
            styles.inputContainer,
            formErrors.password
              ? {borderColor: 'red'}
              : {borderColor: 'transparent'},
          ]}>
          <Image
            source={require('../../../assets/icons/Lock.png')}
            style={styles.icon}
          />
          <TextInput
            placeholder="Nouveau mot de passe"
            placeholderTextColor={colors.darkGrey}
            style={styles.input}
            secureTextEntry={true}
            value={formData.password}
            onChangeText={text => handleInputChange('password', text)}
          />
        </View>
        {formErrors.password ? (
          <Text style={styles.errorText}>{formErrors.password}</Text>
        ) : null}
        <View
          style={[
            styles.inputContainer,
            formErrors.confirmPassword
              ? {borderColor: 'red'}
              : {borderColor: 'transparent'},
          ]}>
          <Image
            source={require('../../../assets/icons/Lock.png')}
            style={styles.icon}
          />
          <TextInput
            placeholder="Confirmation mot de passe"
            placeholderTextColor={colors.darkGrey}
            secureTextEntry={true}
            style={styles.input}
            value={formData.confirmPassword}
            onChangeText={text => handleInputChange('confirmPassword', text)}
          />
        </View>
        {formErrors.confirmPassword ? (
          <Text style={styles.errorText}>{formErrors.confirmPassword}</Text>
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
            onPress={onSubmitRestPassword}>
            <ActivityIndicator
              animating={loading}
              size={25}
              color={colors.white}
            />
            <Text style={[styles.buttonText, {marginLeft: scale(10)}]}>
              Mettre à jour
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={onSubmitRestPassword}>
            <Text style={styles.buttonText}> Mettre à jour</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.button,
            {backgroundColor: colors.black, marginVertical: scale(0)},
          ]}>
          <Text style={styles.buttonText}>Annuler</Text>
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
    marginBottom: scale(15),
    fontSize: scale(18),
    color: colors.textPrimary,
    fontFamily: 'Asul',
    textAlign: 'center',
    marginTop: scale(-28),
  },
  logo: {
    marginBottom: scale(40),
    width: scale(60),
    height: scale(60),
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

export default ChangePassword;
