import {StyleSheet} from 'react-native';
import {Text} from 'react-native';
import {View, Image} from 'react-native';
import colors from '../constants/color';
import {TouchableOpacity} from 'react-native';
import {scale} from 'react-native-size-matters';

const ButtonPrimary = ({onPress, style, text, image, textStyle}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      {image && (
        <View style={{justifyContent: 'center'}}>
          <Image source={image} style={{width: scale(15), height: scale(15), tintColor: colors.white}}/>
        </View>
      )}
      <Text allowFontScaling={true} style={[styles.textStyle, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: colors.primary,
    padding: scale(10),
    elevation: 3,
    flexDirection: 'row',
    gap: scale(5),
    alignContent: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    fontFamily: 'Asul-Bold',
    fontStyle: 'normal',
    fontSize: scale(19),
    lineHeight: scale(24),
    textAlign: 'center',
    color: colors.white,
  },
});
export default ButtonPrimary;
