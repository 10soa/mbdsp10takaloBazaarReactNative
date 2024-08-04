import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {style} from './Style';
import Home from '../screens/Home';
import colors from '../constants/color';
import {TouchableOpacity, View, Image} from 'react-native';
import AddObject from '../screens/Object/AddObject';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{tabBarStyle: style.navigator, headerShown: false}}
      tabBarOptions={{showIcon: true, showLabel: false}}>
      <Tab.Screen
        name="Accueil"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={style.navView}>
                <Image
                  source={require('../assets/icons/home.png')}
                  resizeMode="contain"
                  style={{
                    tintColor: focused ? colors.primary : colors.grey,
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
          tabBarStyle: { display: 'none' },
          tabBarIcon: () => {
            return (
              <View style={style.navView}>
                <Image
                  source={require('../assets/icons/plus.png')}
                  resizeMode="contain"
                  style={{
                    tintColor: '#fff',
                    ...style.centerIcon,
                  }}
                />
              </View>
            );
          },
          tabBarButton: ({children, onPress}) => {
            return (
              <TouchableOpacity
                style={style.centerButtonContainer}
                onPress={onPress}>
                <View style={style.centerButton}>{children}</View>
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen
        name="Recherche"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={style.navView}>
                <Image
                  source={require('../assets/icons/home.png')}
                  resizeMode="contain"
                  style={{
                    tintColor: focused ? colors.primary : colors.grey,
                    ...style.navImage,
                  }}
                />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
