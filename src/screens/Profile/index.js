import {StyleSheet, Text} from 'react-native';
import Container from '../../components/Container';
import IsLoading from '../../components/IsLoading';
import UserProfile from './components/UserProfile';
import {getUserFromToken} from '../../service/SessionService';
import {useContext, useEffect, useState} from 'react';
import CustomText from '../../components/CustomText';
import colors from '../../constants/color';
import ObjectCard from './components/ObjectCard';
import ListItem from './components/ListItem';
import { AuthContext } from '../../context/AuthContext';

const Profile = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {logoutUser} = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserFromToken();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logoutUser(navigation);
  }
  if (loading) {
    return <IsLoading />;
  }
  return (
    <Container isScrollable>
      <CustomText
        text="Votre profile"
        style={[styles.screenTitle, {marginBottom: 15, marginTop: 10}]}
      />
      <UserProfile user={user} />
      <ObjectCard />
      <CustomText
        text="Generale"
        style={[styles.screenTitle, {marginTop: 10}]}
      />
      <ListItem
        title="Mes échanges en cours"
        iconSource={require('../../assets/icons/DataTransfer.png')}
      />
      <ListItem
        title="Mes historiques d'échanges"
        iconSource={require('../../assets/icons/TimeMachine.png')}
      />
      <ListItem
        title="Deconnexion"
        iconSource={require('../../assets/icons/Logout.png')}
        onPress={handleLogout}
      />
      <CustomText
        text="Information personelle"
        style={[styles.screenTitle, {marginTop: 30}]}
      />
      <ListItem
        title="Modifier mon compte"
        iconSource={require('../../assets/icons/Registration.png')}
      />
      <ListItem
        title="Changer mon mot de passe"
        iconSource={require('../../assets/icons/PasswordBook.png')}
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
