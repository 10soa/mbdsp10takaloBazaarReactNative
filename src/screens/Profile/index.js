import {StyleSheet, Text} from 'react-native';
import Container from '../../components/Container';
import IsLoading from '../../components/IsLoading';
import UserProfile from './components/UserProfile';
import {getUserFromToken} from '../../service/SessionService';
import {useContext, useEffect, useState} from 'react';
import CustomText from '../../components/CustomText';
import ObjectCard from './components/ObjectCard';
import ListItem from './components/ListItem';
import {AuthContext} from '../../context/AuthContext';
import {getUser} from '../../service/UserService';
import {useIsFocused} from '@react-navigation/native';

const Profile = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {logoutUser} = useContext(AuthContext);
  const isFocused = useIsFocused();

  const fetchUser = async () => {
    try {
      let userData = await getUserFromToken();
      if (userData) {
        userData = await getUser(userData.id);
      }
      setUser(userData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [isFocused]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser(navigation);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <IsLoading />;
  }
  return (
    <Container isScrollable>
      <CustomText
        text="Mon profil"
        style={[styles.screenTitle, {marginBottom: 15, marginTop: 10}]}
      />
      <UserProfile user={user} navigation={navigation} fetchData={fetchUser} />
      <ObjectCard onPress={() => navigation.navigate('MyObject')} />
      <CustomText
        text="Generale"
        style={[styles.screenTitle, {marginTop: 10}]}
      />
      <ListItem
        title="Mes échanges en cours"
        iconSource={require('../../assets/icons/DataTransfer.png')}
        onPress={() => navigation.navigate('CurrentExchange')}
      />
      <ListItem
        title="Mon historique d'échanges"
        iconSource={require('../../assets/icons/TimeMachine.png')}
        onPress={() => navigation.navigate('ExchangeHistory')}
      />
      <ListItem
        title="Deconnexion"
        iconSource={require('../../assets/icons/Logout.png')}
        onPress={handleLogout}
      />
      <CustomText
        text="Informations personelles"
        style={[styles.screenTitle, {marginTop: 30}]}
      />
      <ListItem
        title="Modifier mon compte"
        iconSource={require('../../assets/icons/Registration.png')}
        onPress={() => navigation.navigate('EditUser', {onGoBack: fetchUser})}
      />
      <ListItem
        title="Changer mon mot de passe"
        iconSource={require('../../assets/icons/PasswordBook.png')}
        onPress={() => navigation.navigate('ChangePassword')}
      />
    </Container>
  );
};
const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 22,
    fontFamily: 'Asul-Bold',
    // marginBottom: 15
  },
});
export default Profile;
