import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';

interface IProps {
  notification?: number;
  serviceTickets?: number;
  dues?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

const AssetSummary = (props: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDashboard);
  const { notification = 0, serviceTickets = 0, dues = 0, containerStyle } = props;

  return (
    <LinearGradient
      useAngle
      angle={180}
      colors={[theme.colors.white, theme.colors.background]}
      locations={[0, 1]}
      style={[styles.container, containerStyle]}
    >
      <View style={styles.summary}>
        <Icon name={icons.bell} color={theme.colors.green} size={40} />
        <Text type="small" textType="semiBold" style={styles.notification}>
          {t('notification')}
        </Text>
        <Text type="large" textType="bold" style={styles.notification}>
          {notification}
        </Text>
      </View>
      <Divider />
      <View style={styles.summary}>
        <Icon name={icons.headPhone} color={theme.colors.warning} size={40} />
        <Text type="small" textType="semiBold" style={styles.serviceTickets}>
          {t('serviceTickets')}
        </Text>
        <Text type="large" textType="bold" style={styles.serviceTickets}>
          {serviceTickets}
        </Text>
      </View>
      <Divider />
      <View style={styles.summary}>
        <Icon name={icons.decrease} color={theme.colors.danger} size={40} />
        <Text type="small" textType="semiBold" style={styles.dues}>
          {t('dues')}
        </Text>
        <Text type="large" textType="bold" style={styles.dues}>
          {dues}
        </Text>
      </View>
    </LinearGradient>
  );
};

export { AssetSummary };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'space-around',
  },
  summary: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notification: {
    color: theme.colors.green,
    marginVertical: 2,
  },
  serviceTickets: {
    color: theme.colors.warning,
    marginVertical: 2,
  },
  dues: {
    color: theme.colors.danger,
    marginVertical: 2,
  },
});
