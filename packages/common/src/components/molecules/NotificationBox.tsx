import React from 'react';
import { FlatList, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Notifications } from '@homzhub/common/src/domain/models/AssetNotifications';

interface IProps {
  data: Notifications[];
  onPress: (id: number) => void;
  onLoadMore: () => void;
  unreadCount: number;
  isTitle?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const NotificationBox = (props: IProps): React.ReactElement => {
  const { data, onPress, isTitle = true, containerStyle, unreadCount, onLoadMore } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDashboard);

  const renderItem = ({ item }: { item: Notifications }): React.ReactElement => {
    let notificationStyle = {};

    if (!item.isRead) {
      notificationStyle = styles.unreadNotification;
    } else {
      notificationStyle = {
        borderColor: theme.colors.darkTint10,
        borderWidth: 1,
      };
    }

    const onBubblePress = (): void => {
      onPress(item.id);
    };

    return (
      <TouchableOpacity style={[styles.container, notificationStyle]} onPress={onBubblePress}>
        {isTitle && (
          <Label type="large" textType="semiBold">
            {item.title}
          </Label>
        )}
        <View style={styles.infoContainer}>
          <View style={styles.initialsContainer}>
            <Icon name={icons.alert} size={20} color={theme.colors.primaryColor} testID="icnBack" />
          </View>
          <View style={styles.description}>
            <View style={styles.nameAndTimeContainer}>
              <Label type="regular" textType="regular" style={styles.labels}>
                {item.notificationType}
              </Label>
              <Label type="regular" textType="regular" style={styles.labels}>
                {DateUtils.timeDifference(item.createdAt)}
              </Label>
            </View>
            <Label type="large" textType="regular" style={styles.descriptionText}>
              {item.message}
            </Label>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item: Notifications, index: number): string => index.toString();

  return (
    <View style={[styles.notificationsContainer, containerStyle]}>
      <Label type="large" textType="regular" style={styles.notificationsCount}>
        {t('newNotification', { count: unreadCount })}
      </Label>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        nestedScrollEnabled
      />
    </View>
  );
};

export { NotificationBox };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 100,
    marginVertical: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  initialsContainer: {
    ...(theme.circleCSS(40) as object),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    backgroundColor: theme.colors.reminderBackground,
    borderColor: theme.colors.white,
    borderWidth: 1,
  },
  description: {
    justifyContent: 'center',
    flex: 1,
    marginStart: 10,
  },
  nameAndTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  unreadNotification: {
    backgroundColor: theme.colors.unreadNotification,
  },
  notificationsContainer: {
    flex: 1,
    padding: theme.layout.screenPadding,
  },
  notificationsCount: {
    color: theme.colors.darkTint6,
  },
  labels: {
    color: theme.colors.darkTint3,
  },
  descriptionText: {
    color: theme.colors.darkTint2,
  },
});