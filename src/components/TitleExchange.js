import {Image, StyleSheet, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import colors from '../constants/color';
import CustomText from './CustomText';

const TitleExchange = ({title, icon}) => {
  return (
    <View style={styles.content}>
      {icon && (
        <Image
          source={icon}
          style={{width: 23, height: 23, tintColor: colors.white}}
        />
      )}
      <CustomText text={title} style={styles.title} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: scale(10),
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 10,
    gap: 3,
    alignContent: 'center',
  },
  title: {
    color: colors.white,
    fontSize: scale(16),
  },
});

export default TitleExchange;
