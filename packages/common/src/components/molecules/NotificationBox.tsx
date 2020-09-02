import React from 'react';
import { FlatList, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';

interface INotificationData {
  id: number;
  project_name: string;
  user: string;
  posted_at: string;
  description: string;
  is_read: boolean;
}

interface IProps {
  data: INotificationData[];
  onPress: (id: number) => void;
  isTitle?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const NotificationBox = (props: IProps): React.ReactElement => {
  const { data, onPress, isTitle = true, containerStyle } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDashboard);

  const count = data.filter((obj: any) => obj.is_read).length;

  const renderItem = ({ item }: { item: any }): React.ReactElement => {
    const { id, project_name, user, posted_at, description, is_read } = item;
    let notificationStyle = {};

    if (!is_read) {
      notificationStyle = styles.unreadNotification;
    } else {
      notificationStyle = {
        borderColor: theme.colors.darkTint10,
        borderWidth: 1,
      };
    }

    const onBubblePress = (): void => {
      onPress(id);
    };

    return (
      <TouchableOpacity style={[styles.container, notificationStyle]} onPress={onBubblePress}>
        {isTitle && (
          <Label type="large" textType="semiBold">
            {project_name}
          </Label>
        )}
        <View style={styles.infoContainer}>
          <View style={styles.initialsContainer}>
            <Text type="small" textType="regular" style={styles.initials}>
              {StringUtils.getInitials(user ?? 'User')}
            </Text>
          </View>
          <View style={styles.description}>
            <View style={styles.nameAndTimeContainer}>
              <Label type="regular" textType="regular" style={styles.labels}>
                {user}
              </Label>
              <Label type="regular" textType="regular" style={styles.labels}>
                {DateUtils.timeDifference(posted_at)}
              </Label>
            </View>
            <Label type="large" textType="regular" style={styles.descriptionText}>
              {description}
            </Label>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item: any, index: number): string => index.toString();

  return (
    <View style={[styles.notificationsContainer, containerStyle]}>
      <Label type="large" textType="regular" style={styles.notificationsCount}>
        {t('newNotification', { count })}
      </Label>
      <FlatList data={data} renderItem={renderItem} keyExtractor={keyExtractor} />
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
  initials: {
    color: theme.colors.shadow,
  },
  initialsContainer: {
    ...(theme.circleCSS(40) as object),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    backgroundColor: theme.colors.darkTint7,
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
