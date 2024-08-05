import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native';
import colors from '../constants/color';

const IsLoading = ({isLoading}) => {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator
        style={styles.loadingStyle}
        animating={isLoading}
        size={'large'}
        color={colors.secondary}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default IsLoading;
