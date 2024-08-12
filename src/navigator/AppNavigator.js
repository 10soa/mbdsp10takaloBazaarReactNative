import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {style} from './Style';
import Home from '../screens/Home';
import colors from '../constants/color';
import {TouchableOpacity, View, Image} from 'react-native';
import AddObject from '../screens/Object/AddObject';
import Details from '../screens/Details';
import Login from '../screens/Login';
import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import Profile from '../screens/Profile';
import Signup from '../screens/Signup';
import {useNavigation} from '@react-navigation/native';
import SearchFilter from '../screens/Search';
import Propose from '../screens/Exchange/Propose';
import ExchangeHistory from '../screens/Exchanges';
import MyObject from '../screens/Object/Myobject';
import CurrentExchange from '../screens/Exchanges/MyCurrent';
import UpdateObject from '../screens/Object/UpdateObject';
import ProfileUser from '../screens/Profile/ProfileUser';
import ExchangeDetails from '../screens/Exchange/Details';
import QRCodeScannerComponent from '../components/scanQR/QRCodeScannerComponen';
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const {isAuthenticated} = useContext(AuthContext);
  const navigation = useNavigation();
  const handlePress = () => {
    if (isAuthenticated) {
      navigation.navigate('AjouterObjet');
    } else {
      navigation.navigate('User', {
        text: 'Veuillez vous connecter pour pouvoir publier un objet.',
        routeName: 'AjouterObjet',
      });
    }
  };
  return (
    <Tab.Navigator
      backBehavior={'history'}
      screenOptions={{tabBarStyle: style.navigator, headerShown: false}}
      tabBarOptions={{showIcon: true, showLabel: false}}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={style.navView}>
                <Image
                  source={require('../assets/icons/home.png')}
                  resizeMode="contain"
                  style={{
                    tintColor: focused ? colors.primary : colors.darkGrey,
                    ...style.navImage,
                  }}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="AjouterObjet"
        component={isAuthenticated ? AddObject : Login}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={style.navView}>
                <Image
                  source={require('../assets/icons/plus.png')}
                  resizeMode="contain"
                  style={{
                    tintColor: focused ? colors.white : colors.darkGrey,
                    ...style.centerIcon,
                  }}
                />
              </View>
            );
          },
          tabBarButton: ({children, onPress, accessibilityState}) => {
            const isFocused = accessibilityState.selected;
            return (
              <TouchableOpacity
                style={style.centerButtonContainer}
                onPress={handlePress}>
                <View
                  style={[
                    style.centerButton,
                    isFocused && {backgroundColor: colors.primary},
                  ]}>
                  {children}
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen
        name="User"
        component={isAuthenticated ? Profile : Login}
        options={{
          tabBarStyle: {display: isAuthenticated ? 'flex' : 'none'},
          tabBarIcon: ({focused}) => {
            return (
              <View style={style.navView}>
                <Image
                  source={require('../assets/icons/User.png')}
                  resizeMode="contain"
                  style={{
                    tintColor: focused ? colors.primary : colors.darkGrey,
                    ...style.navImage,
                  }}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        key={'Details'}
        name={'Details'}
        component={Details}
        options={{
          tabBarButton: props => null,
          tabBarVisible: false,
          tabBarLabel: 'Filter',
          tabBarStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        key={'Signup'}
        name={'Signup'}
        component={Signup}
        options={{
          tabBarButton: props => null,
          tabBarVisible: false,
          tabBarLabel: 'Signup',
          tabBarStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        key={'SearchFilter'}
        name={'SearchFilter'}
        component={SearchFilter}
        options={{
          tabBarButton: props => null,
          tabBarVisible: false,
          tabBarLabel: 'Filter',
          tabBarStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        key={'ProposeExchange'}
        name={'ProposeExchange'}
        component={Propose}
        options={{
          tabBarButton: props => null,
          tabBarVisible: false,
          tabBarLabel: 'ProposeExchange',
          tabBarStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        key={'ExchangeHistory'}
        name={'ExchangeHistory'}
        component={ExchangeHistory}
        options={{
          tabBarButton: props => null,
          tabBarVisible: false,
          tabBarLabel: 'ExchangeHistory',
          tabBarStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        key={'MyObject'}
        name={'MyObject'}
        component={MyObject}
        options={{
          tabBarButton: props => null,
          tabBarVisible: false,
          tabBarLabel: 'MyObject',
          tabBarStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        key={'CurrentExchange'}
        name={'CurrentExchange'}
        component={CurrentExchange}
        options={{
          tabBarButton: props => null,
          tabBarVisible: false,
          tabBarLabel: 'CurrentExchange',
          tabBarStyle: {display: 'none'},
        }}
      />
       <Tab.Screen
        key={'UpdateObject'}
        name={'UpdateObject'}
        component={UpdateObject}
        options={{
          tabBarButton: props => null,
          tabBarVisible: false,
          tabBarLabel: 'UpdateObject',
          tabBarStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        key={'ProfileUser'}
        name={'ProfileUser'}
        component={ProfileUser}
        options={{
          tabBarButton: props => null,
          tabBarVisible: false,
          tabBarLabel: 'ProfileUser',
          tabBarStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        key={'ExchangeDetails'}
        name={'ExchangeDetails'}
        component={ExchangeDetails}
        options={{
          tabBarButton: props => null,
          tabBarVisible: false,
          tabBarLabel: 'ExchangeDetails',
          tabBarStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        key={'QRCodeScannerComponent'}
        name={'QRCodeScannerComponent'}
        component={QRCodeScannerComponent}
        options={{
          tabBarButton: props => null,
          tabBarVisible: false,
          tabBarLabel: 'QRCodeScannerComponent',
          tabBarStyle: {display: 'none'},
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
