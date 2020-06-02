import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProps {
  children?: string | React.ReactNode;
}

export const GradientBackground = ({ children }: IProps): React.ReactElement => {
  return (
    <LinearGradient
      useAngle
      angle={54.15}
      colors={[theme.colors.propertyGradientA, theme.colors.propertyGradientB]}
      locations={[0.1955, 0.7738]}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" />
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.globalStyles.center,
    flexDirection: 'row',
  },
});
