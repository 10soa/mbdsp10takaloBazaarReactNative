/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, ScrollView, Text, Alert } from 'react-native';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { scale } from 'react-native-size-matters';
import User from '../Propose/components/User';
import colors from '../../../constants/color';
import ButtonPrimary from '../../../components/ButtonPrimary';
import TitleExchange from '../../../components/TitleExchange';
import { getExchangeById, acceptExchange } from '../../../service/ExchangeService';
import ProductCard from '../../../components/ProductCard';
import CustomText from '../../../components/CustomText';
import IsLoading from '../../../components/IsLoading';
import { getUserFromToken } from '../../../service/SessionService';
import AcceptExchangeModal from '../components/AcceptExchangeModal';
import RejectExchangeModal from '../components/RejectExchangeModal'; // Import the RejectExchangeModal
import GlobalSafeAreaView from '../../../components/GlobalSafeAreaView';

const ExchangeDetails = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [exchange, setExchange] = useState({});
  const [propositionObjects, setPropositionObjects] = useState([]);
  const [receiverObjects, setReceiverObjects] = useState([]);
  const [user, setUser] = useState([]);
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);

  useEffect(() => {
    const prepareData = async id => {
      try {
        await getExchange(id);
        setUser(await getUserFromToken());
      } catch (err) { }
    };
    if (route.params?.exchangeId) {
      prepareData(route.params?.exchangeId);
    }
  }, [route]);

  const getExchange = async id => {
    try {
      setLoading(true);
      const data = await getExchangeById(id, navigation);
      setExchange(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (exchange && exchange.exchange_objects) {
      const proposerObjects = exchange.exchange_objects.filter(
        obj => obj.user_id === exchange.proposer_user_id,
      );
      const receiverObjects = exchange.exchange_objects.filter(
        obj => obj.user_id === exchange.receiver_user_id,
      );
      setPropositionObjects(proposerObjects);
      setReceiverObjects(receiverObjects);
    }
  }, [exchange]);

  const translateStatus = status => {
    switch (status) {
      case 'Accepted':
        return 'Accepté';
      case 'Cancelled':
        return 'Annulé';
      case 'Proposed':
        return 'Proposé';
      case 'Refused':
        return 'Refusé';
      default:
        return status;
    }
  };

  const formatDate = (isoString, hasHour) => {
    const date = new Date(isoString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const heure = hasHour ? ' à '+isoString.split('T')[1].split('.')[0] : '';
    return date.toLocaleDateString('fr-FR', options)+heure;
  };

  const handleAccept = async () => {
    try {
      setAcceptModalVisible(false);
      getExchange(exchange.id);
    } catch (error) {
      Alert.alert('Erreur', "Une erreur s'est produite lors de l'acceptation de l'échange.");
    }
  };

  const handleReject = async () => {
    try {
      setRejectModalVisible(false);
      getExchange(exchange.id);
    } catch (error) {
      Alert.alert('Erreur', "Une erreur s'est produite lors du refus de l'échange.");
    }
  };

  return (
    <GlobalSafeAreaView>
      <Header navigation={navigation} title="Détails de l'échange" />
      {loading ? (
        <IsLoading />
      ) : (
        <>
          <Container isScrollable>
            <Text style={styles.status}>
              Statut: {translateStatus(exchange.status)} (
              {formatDate(exchange.created_at)})
            </Text>
            <View style={styles.container}>
              {exchange.proposer && (
                <User
                  imageUrl={exchange.proposer?.profile_picture}
                  username={exchange.proposer?.username}
                />
              )}
              <Image
                source={require('../../../assets/icons/Right.png')}
                style={styles.arrow}
              />
              {exchange.receiver && (
                <User
                  imageUrl={exchange.receiver?.profile_picture}
                  username={exchange.receiver?.username}
                />
              )}
            </View>
            <TitleExchange title="Proposition" />
            <ScrollView horizontal={true} style={styles.itemContent}>
              {propositionObjects.map((item, index) => (
                <ProductCard
                  product={item.object}
                  key={index}
                  styleCard={{ marginHorizontal: 10, width: scale(130) }}
                  disableShared
                  disableCategory
                  onPress={() => {
                    navigation.navigate('Details', {
                      objectId: item.object.id,
                    });
                  }}
                />
              ))}
            </ScrollView>
            <TitleExchange title="Contre" />
            <ScrollView horizontal={true} style={styles.itemContent}>
              {receiverObjects.map((item, index) => (
                <ProductCard
                  product={item.object}
                  key={index}
                  styleCard={{ marginHorizontal: 10, width: scale(130) }}
                  disableShared
                  disableCategory
                  onPress={() => {
                    navigation.navigate('Details', {
                      objectId: item.object.id,
                    });
                  }}
                />
              ))}
            </ScrollView>
            <TitleExchange
              title="Détails"
              icon={require('../../../assets/icons/Info.png')}
            />
            <View style={styles.detailsContent}>
              <CustomText
                text={'Depuis: ' + formatDate(exchange.created_at)}
                style={styles.details}
              />
              {exchange.status == 'Accepted' && (
                <>
                  <CustomText
                    text={'Accepté le : ' + formatDate(exchange.date)}
                    style={styles.details}
                  />
                  <CustomText
                    text={'Lieu du rendez-vous: ' + exchange.meeting_place}
                    style={styles.details}
                  />
                  <CustomText
                    text={
                      'Date du rendez-vous: ' +
                      formatDate(exchange.appointment_date, true)
                    }
                    style={styles.details}
                  />
                </>
              )}
              {exchange.status == 'Refused' && (
                <>
                  <CustomText
                    text={'Refusé le : ' + formatDate(exchange.date)}
                    style={styles.details}
                  />
                  <CustomText
                    text={'Raison: ' + exchange.note}
                    style={styles.details}
                  />
                </>
              )}
              {exchange.status == 'Cancelled' && (
                <>
                  <CustomText
                    text={'Annulé  le : ' + formatDate(exchange.date)}
                    style={styles.details}
                  />
                  <CustomText
                    text={'Raison: ' + exchange.note}
                    style={styles.details}
                  />
                </>
              )}
            </View>
          </Container>
          {exchange.status == 'Proposed' &&
            user.id == exchange.receiver_user_id && (
              <View style={styles.buttonContainer}>
                <ButtonPrimary
                  image={require('../../../assets/icons/Done.png')}
                  text="Accepter"
                  style={{ width: '45%', justifyContent: 'center' }}
                  textStyle={{ fontSize: scale(16) }}
                  onPress={() => setAcceptModalVisible(true)}
                />
                <ButtonPrimary
                  image={require('../../../assets/icons/Close.png')}
                  text="Refuser"
                  style={{
                    backgroundColor: colors.textPrimary,
                    width: '45%',
                    justifyContent: 'center',
                  }}
                  textStyle={{ fontSize: scale(16) }}
                  onPress={() => setRejectModalVisible(true)}
                />
              </View>
            )}
          <AcceptExchangeModal
            visible={acceptModalVisible}
            onClose={() => setAcceptModalVisible(false)}
            onConfirm={handleAccept}
            idExchange={exchange.id}
            navigation={navigation}
          />
          <RejectExchangeModal
            visible={rejectModalVisible}
            onClose={() => setRejectModalVisible(false)}
            onConfirm={handleReject}
            idExchange={exchange.id}
            navigation={navigation}
          />
        </>
      )}
    </GlobalSafeAreaView>
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
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  details: {
    fontSize: scale(16),
  },
  detailsContent: {
    paddingHorizontal: scale(10),
    flexDirection: 'column',
    gap: scale(5),
  },
  status: {
    fontFamily: 'Asul-Bold',
    color: colors.textPrimary,
    fontSize: scale(17),
  },
});

export default ExchangeDetails;
