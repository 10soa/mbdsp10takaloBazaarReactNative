import {StyleSheet, Text} from 'react-native';
import Container from '../../components/Container';
import IsLoading from '../../components/IsLoading';
import UserProfile from './components/UserProfile';
import {getUserFromToken} from '../../service/SessionService';
import {useEffect, useState} from 'react';
import CustomText from '../../components/CustomText';
import colors from '../../constants/color';
import ObjectCard from './components/ObjectCard';
import ListItem from './components/ListItem';

const Profile = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserFromToken();
        userData.profile_picture =
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa4xjShh4ynJbrgYrW_aB4lhKSxeMzQ3cO_A&usqp=CAU';
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
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
