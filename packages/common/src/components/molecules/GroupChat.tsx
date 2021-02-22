import React from 'react';
import { View, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { ITheme, theme } from '@homzhub/common/src/styles/theme';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';

interface IProps {
  chatData: GroupMessage;
}

const GroupChat = (props: IProps): React.ReactElement => {
  const {
    chatData: { name, unreadCount, getAlphabeticalSortedUserNames, getDate },
  } = props;
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Image source={{ uri: '' }} style={styles.avatar} />
      <View style={[styles.justifyContent, styles.heading]}>
        <Text>{name}</Text>
        <Text>{getDate}</Text>
      </View>
      <View style={styles.justifyContent}>
        <Text>{getAlphabeticalSortedUserNames}</Text>
        <Text>{unreadCount}</Text>
      </View>
    </View>
  );
};

interface IScreenStyles {
  container: ViewStyle;
  heading: ViewStyle;
  avatar: ImageStyle;
  justifyContent: ViewStyle;
}

const getStyles = (appTheme: ITheme): IScreenStyles => {
  return StyleSheet.create({
    container: {
      paddingVertical: 12,
      paddingHorizontal: 16,
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
  });
};

export default React.memo(GroupChat);
