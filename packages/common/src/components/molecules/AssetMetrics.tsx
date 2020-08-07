import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';

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
      <Text type="regular" textType="regular" style={styles.metrics}>
        {header}
      </Text>
      <Divider />
      <Text type="regular" textType="regular" style={styles.metrics}>
        {value}
      </Text>
    </LinearGradient>
  );
};

export { AssetMetrics };

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 10,
    padding: 5,
    minWidth: theme.viewport.width / 3.5,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  metrics: {
    textAlign: 'center',
    marginVertical: 5,
  },
});
