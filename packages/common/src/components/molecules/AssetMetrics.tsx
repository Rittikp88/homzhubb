import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  header: string;
  value: string | number;
  colorA: string;
  colorB: string;
}

const AssetMetrics = (props: IProps): React.ReactElement => {
  const { header, value, colorA, colorB } = props;
  return (
    <LinearGradient useAngle angle={180} colors={[colorA, colorB]} locations={[0, 1]} style={styles.container}>
      <Text type="small" textType="semiBold" style={styles.metrics}>
        {header}
      </Text>
      <Text type="large" textType="semiBold" style={styles.metrics}>
        {value}
      </Text>
    </LinearGradient>
  );
};

export { AssetMetrics };

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 8,
    padding: 5,
    minWidth: (theme.viewport.width - 90) / 3,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metrics: {
    textAlign: 'center',
    marginVertical: 5,
    color: theme.colors.white,
  },
});
