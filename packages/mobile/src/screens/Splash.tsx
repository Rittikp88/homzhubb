import React from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '@homzhub/common/src/styles/theme';

export const Splash = (): React.ReactElement => {
  return (
    <LinearGradient
      useAngle
      angle={157.69}
      colors={[theme.colors.splashGradientA, theme.colors.splashGradientB]}
      locations={[0.0512, 0.9475]}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.logoContainer}>
        <Image source={require('@homzhub/common/src/assets/images/logo.png')} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.globalStyles.center,
    flexDirection: 'row',
  },
  logoContainer: {
    padding: 30,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
});
