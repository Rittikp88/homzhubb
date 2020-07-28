import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';

interface IProps {
  text?: string;
}

const ShieldGroup = ({ text }: IProps): React.ReactElement => {
  return (
    <View style={styles.container}>
      {text && (
        <Text type="small" textType="regular" style={styles.propertyTypeText}>
          {text}
        </Text>
      )}
      <View style={styles.badgesContainer}>
        <Icon name={icons.badge} size={23} color={theme.colors.warning} style={styles.badges} />
        <Icon name={icons.badge} size={23} color={theme.colors.warning} style={styles.badges} />
        <Icon name={icons.badge} size={23} color={theme.colors.disabledPreference} style={styles.badges} />
      </View>
    </View>
  );
};

export default ShieldGroup;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
  },
  badges: {
    marginHorizontal: 3,
  },
  propertyTypeText: {
    color: theme.colors.primaryColor,
  },
});
