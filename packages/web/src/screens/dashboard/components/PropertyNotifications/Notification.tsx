import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import IconWithBadge from '@homzhub/web/src/screens/dashboard/components/PropertyNotifications/NotificationIconBadge';

const Data = [
  {
    id: 1,
    textData: 'Visits',
    badgeData: '10',
    icon: icons.visit,
  },
  {
    id: 2,
    textData: 'Offer',
    badgeData: '10',
    icon: icons.offers,
  },
  { id: 3, textData: 'Message', badgeData: '10', icon: icons.mail },
];

const Notifications = (): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftChild}>
          <View style={styles.iconBackground}>
            <Icon name={icons.bell} size={22} color={theme.colors.green} />
          </View>
          <View style={styles.data}>
            <Text type="large" textType="semiBold" minimumFontScale={0.5} style={styles.count}>
              20
            </Text>
            <Text type="small" textType="regular" minimumFontScale={1}>
              {t('assetDashboard:notification')}
            </Text>
          </View>
        </View>
        <View>
          <Icon name={icons.rightArrow} size={25} style={styles.arrow} />
        </View>
      </View>
      <Divider />
      <View style={styles.content}>
        {Data.map((Item) => (
          <View key={Item.id}>
            <IconWithBadge
              containerStyle={styles.badgeContainer}
              textData={Item.textData}
              badgeData={Item.badgeData}
              icon={Item.icon}
              badgeColor={theme.colors.danger}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 24,
    maxHeight: 161,
    justifyContent: 'space-evenly',
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: { color: theme.colors.green },
  leftChild: {
    flexDirection: 'row',
  },
  iconBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    backgroundColor: 'rgba(44, 186, 103, 0.1)',
    borderRadius: 50,
  },
  arrow: {
    color: theme.colors.darkTint6,
  },
  data: {
    marginLeft: 10,
    marginBottom: 16,
  },
  content: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    marginBottom: 11,
    borderRadius: 50,
    marginLeft: -7,
    marginTop: -7,
  },
  badgeContainer: { alignItems: 'center', justifyContent: 'center' },
});

export default Notifications;
