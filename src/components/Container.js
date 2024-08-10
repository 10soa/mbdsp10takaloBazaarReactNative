import React from 'react';
import {ScrollView, StyleSheet, View, SafeAreaView} from 'react-native';
import colors from '../constants/color';

const Container = ({
  children,
  isScrollable,
  bodyStyle,
  paddingVerticalDisabled,
  paddingHorizontalDisabled,
  color
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {isScrollable ? (
        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <View
            style={[
              styles.innerView,
              bodyStyle,
              styles.marginBottom,
              !paddingVerticalDisabled && styles.paddingVertical,
              !paddingHorizontalDisabled && styles.paddingHorizontal,
            ]}>
            {children}
          </View>
        </ScrollView>
      ) : (
        <View
          style={[
            styles.innerView,
            bodyStyle,
            styles.marginBottom,
            !paddingVerticalDisabled && styles.paddingVertical,
            !paddingHorizontalDisabled && styles.paddingHorizontal,
          ]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  innerView: {
    flex: 1,
  },
  paddingHorizontal: {
    paddingHorizontal: 20,
  },
  paddingVertical: {
    paddingVertical: 10,
  },
  marginBottom: {
    marginBottom: 70,
  },
});

export default Container;
