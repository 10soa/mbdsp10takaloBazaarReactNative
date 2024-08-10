import {
  Image,
  Modal,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Easing,
  Text,
} from 'react-native';
import Container from '../../../components/Container';
import {useEffect, useState} from 'react';
import {getUserFromToken} from '../../../service/SessionService';
import Header from '../../../components/Header';
import {scale} from 'react-native-size-matters';
import User from './components/User';
import colors from '../../../constants/color';
import ButtonPrimary from '../../../components/ButtonPrimary';
import TitleExchange from '../../../components/TitleExchange';
import AddItemButton from './components/AddItemButton';
import ItemCard from './components/ItemCard';
import {proposerExchange} from '../../../service/ExchangeService';
import ProductCard from '../../../components/ProductCard';
import {getUserObjects} from '../../../service/ObjectService';
import {
  Notifier,
  NotifierComponents,
  NotifierWrapper,
} from 'react-native-notifier';
import CustomText from '../../../components/CustomText';

const Propose = ({navigation, route}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [proposedItem, setProposedItem] = useState([]);
  const [receivedItem, setReceivedItem] = useState([]);
  const [rcvObjectId, setRcvObjectId] = useState([]);
  const [prpObjectId, setPrpObjectId] = useState([]);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [myModalVisible, setMyModalVisible] = useState(false);
  const [myObjets, setMyObjects] = useState([]);
  const [userObjects, setUserObjets] = useState([]);
  const [error, setError] = useState('');
  const user = route.params?.user || {};

  useEffect(() => {
    const prepareData = async () => {
      try {
        const userData = await getUserFromToken();
        setCurrentUser(userData);
        setUserObjets(await getObjects(user.id, {}));
        setMyObjects(await getObjects(userData.id, {}));
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };
    prepareData();
    if (route.params?.object) {
      addObject([], setReceivedItem, [], setRcvObjectId, route.params?.object);
    }
  }, [route]);

  const addObject = (list, setList, listId, setListId, object) => {
    setError('');
    if (listId.includes(parseInt(object.id))) {
      const error = object.name + ' a déjà été ajouté.';
      Notifier.clearQueue(true);
      Notifier.showNotification({
        title: 'Erreur',
        description: error,
        Component: NotifierComponents.Notification,
        duration: 5000,
        showAnimationDuration: 800,
        showEasing: Easing.bounce,
        onHidden: () => console.log('Hidden'),
        hideOnPress: true,
        componentProps: {
          titleStyle: {
            color: colors.textPrimary,
            fontSize: 20,
            fontFamily: 'Asul-Bold',
          },
          descriptionStyle: {
            color: colors.textPrimary,
            fontSize: 16,
            fontFamily: 'Asul',
          },
          containerStyle: {
            backgroundColor: colors.error,
          },
        },
      });
    } else {
      setList([...list, object]);
      setListId([...listId, parseInt(object.id)]);
    }
    setMyModalVisible(false);
    setUserModalVisible(false);
  };

  const deleteItem = (items, setItems, ids, setIds, index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    const updatedIds = ids.filter((_, i) => i !== index);
    setItems(updatedItems);
    setIds(updatedIds);
  };

  const getObjects = async (id, params) => {
    try {
      const data = await getUserObjects(id, params);
      return data.objects;
    } catch (error) {}
  };

  const proposeExchange = async () => {
    setLoading(true);
    setError('');
    if (rcvObjectId.length === 0) {
      setError('Vous devez sélectionner un objet à échanger.');
      setLoading(false);
    } else if (prpObjectId.length === 0) {
      setError("Vous devez sélectionner un objet à proposer pour l'échange.");
      setLoading(false);
    } else {
      const body = {
        rcvUserId: user.id,
        rcvObjectId: rcvObjectId,
        prpObjectId: prpObjectId,
      };

      try {
        const data = await proposerExchange(body, navigation);
        setLoading(false);
        navigation.navigate('Home');
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
  };

  const renderProductCard = ({item}) => (
    <ProductCard
      product={item}
      disableShared
      onPress={() =>
        addObject(
          myModalVisible ? proposedItem : receivedItem,
          myModalVisible ? setProposedItem : setReceivedItem,
          myModalVisible ? prpObjectId : rcvObjectId,
          myModalVisible ? setPrpObjectId : setRcvObjectId,
          item,
        )
      }
    />
  );

  return (
    <NotifierWrapper>
      <Header navigation={navigation} title="Proposer un échange" />
      <Container isScrollable>
        <View style={styles.container}>
          {currentUser && (
            <User
              imageUrl={currentUser?.profile_picture}
              username={currentUser?.username}
            />
          )}
          <Image
            source={require('../../../assets/icons/Right.png')}
            style={styles.arrow}
          />
          <User imageUrl={user?.profile_picture} username={user?.username} />
        </View>
        <TitleExchange title="Proposition" />
        <ScrollView horizontal={true} style={styles.itemContent}>
          <AddItemButton onPress={() => setMyModalVisible(true)} />
          {proposedItem.map((item, index) => (
            <ItemCard
              onDelete={() =>
                deleteItem(
                  proposedItem,
                  setProposedItem,
                  prpObjectId,
                  setPrpObjectId,
                  index,
                )
              }
              key={index}
              imageUrl={item.image}
              itemName={item.name}
            />
          ))}
        </ScrollView>
        <TitleExchange title="Contre" />
        <ScrollView horizontal={true} style={styles.itemContent}>
          <AddItemButton onPress={() => setUserModalVisible(true)} />
          {receivedItem.map((item, index) => (
            <ItemCard
              onDelete={() =>
                deleteItem(
                  receivedItem,
                  setReceivedItem,
                  rcvObjectId,
                  setRcvObjectId,
                  index,
                )
              }
              key={index}
              imageUrl={item.image}
              itemName={item.name}
            />
          ))}
        </ScrollView>
      </Container>
      <View style={styles.buttonContainer}>
        {error && <CustomText text={error} style={styles.textError}/> }
        {!loading ? (
          <ButtonPrimary text="Proposer l'échange" onPress={proposeExchange} />
        ) : (
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
            <Text style={[styles.buttonText, {marginLeft: 10}]}>
              Proposer l'échange
            </Text>
          </View>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={userModalVisible || myModalVisible}
        onRequestClose={() => {
          setUserModalVisible(false);
          setMyModalVisible(false);
        }}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => {
            setUserModalVisible(false);
            setMyModalVisible(false);
          }}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setUserModalVisible(false);
                setMyModalVisible(false);
              }}>
              <Image
                source={require('../../../assets/icons/Close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
            <FlatList
              data={myModalVisible ? myObjets : userObjects}
              renderItem={renderProductCard}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.row}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </NotifierWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(40),
  },
  arrow: {
    width: scale(24),
    height: scale(24),
    marginHorizontal: scale(20),
    tintColor: colors.textPrimary,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: scale(15),
    backgroundColor: colors.white,
  },
  itemContent: {
    flexDirection: 'row',
    gap: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: scale(20),
    marginVertical: scale(10),
    marginHorizontal: scale(10),
    borderRadius: scale(10),
  },
  row: {
    justifyContent: 'space-between',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: scale(10),
  },
  closeIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: colors.black,
  },
  button: {
    borderRadius: 10,
    backgroundColor: colors.primary,
    padding: scale(10),
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'Asul-Bold',
    fontStyle: 'normal',
    fontSize: scale(19),
    lineHeight: scale(24),
    textAlign: 'center',
    color: colors.white,
  },
  textError:{
    color: colors.error,
    textAlign: 'center',
    marginBottom: scale(10),
    fontSize: scale(16)
  }
});

export default Propose;
