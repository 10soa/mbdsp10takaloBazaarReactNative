import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import DetailsHeader from './components/DetailsHeader';
import Container from '../../components/Container';
import colors from '../../constants/color';
import InformationLine from './components/InformationLine';
import PreviewImage from './components/PreviewImage';
import ButtonPrimary from '../../components/ButtonPrimary';
import {scale} from 'react-native-size-matters';
import IsLoading from '../../components/IsLoading';
import React, {useContext, useEffect, useState} from 'react';
import {getObject, removeObject, restoreObject} from '../../service/ObjectService';
import {AuthContext} from '../../context/AuthContext';
import {getUserFromToken} from '../../service/SessionService';

const Details = ({navigation, route}) => {
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState(null);
  const {objectId} = route.params;
  let user = {};
  const {isAuthenticated} = useContext(AuthContext);

  useEffect(() => {
    const fetchObject = async () => {
      // setLoading(true);
      try {
        const data = await getObject(objectId);
        setObject(data);
        setIsOwner(await isOwnerObject(data.user_id));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchObject();
  }, [objectId]);

  const isOwnerObject = async id => {
    user = await getUserFromToken();

    if (user.id === id) {
      return true;
    }
    return false;
  };

  const goToLogin = (text, routeName) => {
    navigation.navigate('User', {text: text, routeName: routeName});
  };

  const remove = async () => {
    try {
      setLoading(true);
      const data = await removeObject(object.id, navigation);
      setObject(await getObject(object.id));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const repost = async () => {
    try {
      setLoading(true);
      const data = await restoreObject(object.id, navigation);
      setObject(await getObject(object.id));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const proposeExchange = () => {
    if (!isAuthenticated) {
      goToLogin();
      return;
    }
    navigation.navigate('ProposeExchange', {user: object.user, object: object});
  };

  if (loading) {
    return <IsLoading />;
  }
  return (
    <View style={{flex: 1}}>
      <Container isScrollable style={{paddingBottom: 70}}>
        <DetailsHeader onBackPress={() => navigation.goBack()} />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.userContainer}
            onPress={() =>
              navigation.navigate('ProfileUser', {user: object.user})
            }>
            {object.user.profile_picture && (
              <Image
                source={{uri: object.user.profile_picture}}
                style={styles.userImage}
              />
            )}
            {!object.user.profile_picture && (
              <Image
                source={require('../../assets/img/user.png')}
                style={styles.userImage}
              />
            )}

            <Text style={styles.userName}>{object.user.username}</Text>
          </TouchableOpacity>
          <View style={{justifyContent: 'center'}}>
            <Text
              style={[
                styles.status,
                {
                  backgroundColor:
                    object.status === 'Available'
                      ? colors.success
                      : colors.error,
                },
              ]}>
              {object.status === 'Available' ? 'Disponible' : 'Indisponible'}
            </Text>
          </View>
        </View>
        <PreviewImage
          image={object.image}
          idObject={object.id}
          objectName={object.name}
          isOwner={isOwner}
          removeObject={remove}
          repostObject={repost}
          status={object.status}
        />
        <InformationLine
          title={object.name}
          description={object.description}
          cat={object.category.name}
          date={object.created_at}
        />
      </Container>
      {!isOwner && (
        <View style={styles.buttonContainer}>
          <ButtonPrimary
            textStyle={styles.buttonText}
            text={'Proposer un échange'}
            style={styles.buttonStyle}
            onPress={proposeExchange}
          />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 30,
    marginVertical: 15,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  buttonText: {
    fontSize: scale(20),
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 12,
  },
  userName: {
    fontSize: 17,
    color: colors.textPrimary,
    textDecorationLine: 'underline',
    fontFamily: 'Asul',
  },
  status: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    borderRadius: 5,
    color: colors.white,
    fontSize: 15,
    paddingBottom: 3,
    fontFamily: 'Asul',
  },
});
export default Details;
