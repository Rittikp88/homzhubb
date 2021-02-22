import React from 'react';
import { View, StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { ITheme, theme } from '@homzhub/common/src/styles/theme';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';

interface IProps {
  chatData: GroupMessage;
}

const GroupChat = (props: IProps): React.ReactElement => {
  const {
    chatData: { name, unreadCount, getAlphabeticalSortedUserNames, getDate },
  } = props;
  const styles = getStyles(theme);

  // TODO: (Shivam: 22/2/21: replace image with avatar component)
  return (
    <View style={styles.container}>
      <Image source={{ uri: '' }} style={styles.avatar} width={50} height={50} />
      <View style={{ flex: 1 }}>
        <View style={[styles.justifyContent, styles.heading]}>
          <Label type="large" textType="bold">
            {name}
          </Label>
          <Label type="regular" textType="regular" style={styles.tintColor}>
            {getDate}
          </Label>
        </View>
        <View style={styles.justifyContent}>
          <Label type="regular" textType="regular" style={styles.tintColor}>
            {getAlphabeticalSortedUserNames}
          </Label>
          <View style={styles.unreadCountContainer}>
            <Label type="regular" textType="regular" style={styles.unreadCount}>
              {unreadCount}
            </Label>
          </View>
        </View>
      </View>
    </View>
  );
};

interface IScreenStyles {
  container: ViewStyle;
  heading: ViewStyle;
  avatar: ImageStyle;
  justifyContent: ViewStyle;
  tintColor: TextStyle;
  unreadCount: TextStyle;
  unreadCountContainer: ViewStyle;
}

const getStyles = (appTheme: ITheme): IScreenStyles => {
  const {
    colors: { darkTint5, blue, white, background },
  } = appTheme;

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: background,
    },
    avatar: {
      marginEnd: 12,
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
      color: darkTint5,
    },
    unreadCountContainer: {
      minWidth: 18,
      paddingHorizontal: 6,
      borderRadius: 12,
      backgroundColor: blue,
      alignContent: 'center',
    },
    unreadCount: {
      color: white,
      alignSelf: 'center',
    },
  });
};

export default React.memo(GroupChat);
