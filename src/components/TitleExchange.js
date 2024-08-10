import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import colors from '../constants/color';
import CustomText from './CustomText';

const TitleExchange = ({title}) => {
  return <CustomText text={title} style={styles.title} />;
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: colors.secondary,
    borderRadius: scale(10),
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: colors.white,
    fontSize: scale(16),
    marginVertical: 10,
  },
});

export default TitleExchange;
