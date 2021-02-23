import React from 'react';
import { View, StyleSheet, ViewStyle, ImageStyle, TextStyle, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import GroupChatAvatar from '@homzhub/common/src/components/atoms/GroupChatAvatar';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';

interface IProps {
  chatData: GroupMessage;
  onChatPress: () => void;
}

const GroupChat = (props: IProps): React.ReactElement => {
  const {
    chatData: { name, unreadCount, getAlphabeticalSortedUserNames, getDate, users },
    onChatPress,
  } = props;

  return (
    <TouchableOpacity style={styles.container} onPress={onChatPress}>
      <GroupChatAvatar faces={users} isHeader={false} containerStyle={styles.avatar} />
      <View style={styles.subContainer}>
        <View style={[styles.justifyContent, styles.heading]}>
          <Label type="large" textType="bold">
            {name}
          </Label>
          <Label type="regular" textType="regular" style={styles.tintColor}>
            {getDate}
          </Label>
        </View>
        <View style={styles.justifyContent}>
          <Label numberOfLines={1} type="regular" textType="regular" style={[styles.tintColor, styles.userNames]}>
            {getAlphabeticalSortedUserNames}
          </Label>
          <View style={styles.unreadCountContainer}>
            <Label type="regular" textType="regular" style={styles.unreadCount}>
              {unreadCount}
            </Label>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface IScreenStyles {
  container: ViewStyle;
  subContainer: ViewStyle;
  heading: ViewStyle;
  avatar: ImageStyle;
  justifyContent: ViewStyle;
  tintColor: TextStyle;
  unreadCount: TextStyle;
  userNames: TextStyle;
  unreadCountContainer: ViewStyle;
}

const styles: IScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.background,
  },
  subContainer: {
    flex: 3,
  },
  avatar: {
    marginEnd: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: -20,
  },
  justifyContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    marginBottom: 5,
  },
  tintColor: {
    color: theme.colors.darkTint5,
  },
  unreadCountContainer: {
    minWidth: 18,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: theme.colors.blue,
    alignContent: 'center',
  },
  unreadCount: {
    flex: 1,
    color: theme.colors.white,
    alignSelf: 'center',
  },
  userNames: {
    flex: 2,
  },
});

export default React.memo(GroupChat);