import {Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';

const HomeHeader = ({navigation, style}) => {
  return (
    <View style={[Styles.container, style]}>
      <View>
        <Image
          source={require('../../../assets/img/logo-no-background.png')}
          resizeMode="contain"
        />
      </View>
      <View>
        <Image
          source={require('../../../assets/icons/Tune.png')}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
export default HomeHeader;
