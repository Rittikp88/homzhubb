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
        <Icon name={icons.bell} color={theme.colors.notificationGreen} size={25} />
        <Text type="small" textType="semiBold" style={styles.notification} minimumFontScale={0.5} adjustsFontSizeToFit>
          {t('notification')}
        </Text>
        <Text type="regular" textType="bold" style={styles.notification}>
          {notification}
        </Text>
      </View>
      <Divider />
      <View style={styles.summary}>
        <Icon name={icons.headPhone} color={theme.colors.orange} size={25} />
        <Text
          type="small"
          textType="semiBold"
          style={styles.serviceTickets}
          minimumFontScale={0.5}
          adjustsFontSizeToFit
        >
          {t('tickets')}
        </Text>
        <Text type="regular" textType="bold" style={styles.serviceTickets}>
          {serviceTickets}
        </Text>
      </View>
      <Divider />
      <View style={styles.summary}>
        <Icon name={icons.decrease} color={theme.colors.danger} size={25} />
        <Text type="small" textType="semiBold" style={styles.dues} minimumFontScale={0.5} adjustsFontSizeToFit>
          {t('dues')}
        </Text>
        <Text type="regular" textType="bold" style={styles.dues}>
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
    borderRadius: 4,
    justifyContent: 'space-around',
  },
  summary: {
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.viewport.width / 3.5,
  },
  notification: {
    color: theme.colors.notificationGreen,
  },
  serviceTickets: {
    color: theme.colors.orange,
  },
  dues: {
    color: theme.colors.danger,
  },
});
