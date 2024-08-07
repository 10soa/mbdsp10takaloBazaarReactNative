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

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const {isAuthenticated} = useContext(AuthContext);
  return (
    <Tab.Navigator
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
        component={AddObject}
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
                onPress={onPress}>
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
        component={Login}
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
    </Tab.Navigator>
  );
};

export default AppNavigator;
