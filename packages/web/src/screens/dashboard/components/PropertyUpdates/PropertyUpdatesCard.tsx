import React, { FC } from 'react';
import { ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import IconWithBadge from '@homzhub/web/src/screens/dashboard/components/PropertyUpdates/IconWithBadge';
import { IPropertyNotification } from '@homzhub/common/src/constants/DashBoard';

interface IProp {
  data: IPropertyNotification;
}

const PropertyUpdatesCard: FC<IProp> = ({ data }: IProp) => {
  const { t } = useTranslation();
  const styles = propertyUpdatesCardStyle(data.iconColor);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftChild}>
          <View style={styles.iconBackground}>
            <View style={styles.overlay} />
            <Icon name={data.icon} size={22} color={data.iconColor} style={styles.icon} />
          </View>
          <View style={styles.data}>
            <Text type="large" textType="semiBold" minimumFontScale={0.5} style={styles.count}>
              {data.count}
            </Text>
            <Text type="small" textType="regular" minimumFontScale={1}>
              {t(data.title)}
            </Text>
          </View>
        </View>
        <View>
          <Icon name={icons.rightArrow} size={25} style={styles.arrow} />
        </View>
      </View>
      <Divider />
      <View style={styles.content}>
        {data.details.map((item) => (
          <View key={item.label}>
            <IconWithBadge
              containerStyle={styles.badgeContainer}
              label={item.label}
              count={item.count}
              icon={item.icon}
              badgeColor={theme.colors.notificationRed}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

interface IStyle {
  container: ViewStyle;
  header: ViewStyle;
  count: ViewStyle;
  leftChild: ViewStyle;
  iconBackground: ViewStyle;
  overlay: ViewStyle;
  icon: ImageStyle;
  arrow: ImageStyle;
  data: ViewStyle;
  content: ViewStyle;
  badgeContainer: ViewStyle;
}

const propertyUpdatesCardStyle = (iconBgColor: string): StyleSheet.NamedStyles<IStyle> =>
  StyleSheet.create<IStyle>({
    container: {
      width: '32%',
      padding: 15,
      marginVertical: 24,
      maxHeight: 161,
      justifyContent: 'space-evenly',
      backgroundColor: theme.colors.white,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    count: {
      color: iconBgColor,
    },
    leftChild: {
      flexDirection: 'row',
    },
    iconBackground: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      width: 40,
      borderRadius: 50,
    },
    overlay: {
      position: 'absolute',
      height: 40,
      width: 40,
      borderRadius: 50,
      backgroundColor: iconBgColor,
      opacity: 0.1,
    },
    icon: {
      position: 'relative',
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
      justifyContent: 'space-around',
    },
    badgeContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default PropertyUpdatesCard;