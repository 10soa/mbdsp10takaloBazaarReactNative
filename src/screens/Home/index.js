import {View, Text} from 'react-native';

const Home = props => {
  const {style} = props;
  return (
    <View style={{alignContent: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
};

export default Home;