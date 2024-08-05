import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../constants/color';

const PreviewImage = ({image, isOwner, style}) => {
  return (
    <View style={style}>
      <Image
        source={{
          uri: image,
        }}
        resizeMode="contain"
        style={styles.image}
      />
      {isOwner && (
        <View style={styles.isOwner}>
          <TouchableOpacity style={styles.remove}>
            <Image
              source={require('../../../assets/icons/Edit.png')}
              resizeMode="contain"
              style={{width: 30, height: 30, tintColor: colors.black}}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.remove}>
            <Image
              source={require('../../../assets/icons/Remove.png')}
              resizeMode="contain"
              style={{width: 30, height: 30, tintColor: colors.error}}
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.remove}>
          <Image
            source={require('../../../assets/icons/Share1.png')}
            resizeMode="contain"
            style={{width: 30, height: 30, tintColor: colors.black}}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.remove}>
          <Image
            source={require('../../../assets/icons/Unflag.png')}
            resizeMode="contain"
            style={{width: 30, height: 30, tintColor: colors.error}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  isOwner: {
    display: 'flex',
    flexDirection: 'row',
    gap: 7,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 7,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  remove: {
    backgroundColor: colors.white,
    padding: 5,
    borderRadius: 10,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: Dimensions.get('screen').height * 0.4,
  },
});

export default PreviewImage;
