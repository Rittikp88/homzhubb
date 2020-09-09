import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components';
import { IUser } from '@homzhub/common/src/domain/models/User';

interface IProps {
  onIconPress: () => void;
}

interface IMoreProfileState {
  user: IUser | null;
}

type Props = IProps;

export class MoreProfile extends Component<Props, IMoreProfileState> {
  public state = {
    user: {} as IUser,
  };

  public componentDidMount = async (): Promise<void> => {
    const user: IUser | null = await StorageService.get(StorageKeys.USER);
    this.setState({ user });
  };

  public render(): React.ReactNode {
    return <View style={styles.container}>{this.renderHeader()}</View>;
  }

  private renderHeader = (): React.ReactElement => {
    const { onIconPress } = this.props;
    const { user } = this.state;
    return (
      <View style={styles.headerContainer}>
        <View style={styles.flexRow}>
          <View style={styles.initialsContainer}>
            <Text type="small" textType="regular" style={styles.initials}>
              {StringUtils.getInitials(user?.full_name ?? 'User')}
            </Text>
          </View>
          <View style={styles.nameContainer}>
            <Text type="small" textType="regular">
              Hello!
            </Text>
            <Text type="regular" textType="semiBold">
              {user?.full_name ?? 'User'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onIconPress}>
          <Icon name={icons.rightArrow} size={18} color={theme.colors.lowPriority} />
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  headerContainer: {
    flex: 1,
    backgroundColor: theme.colors.moreSeparator,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.layout.screenPadding,
    height: 120,
  },
  initialsContainer: {
    ...(theme.circleCSS(60) as object),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkTint7,
    borderColor: theme.colors.white,
    borderWidth: 1,
    elevation: 10,
    shadowColor: theme.colors.shadow,
    shadowRadius: 4,
  },
  nameContainer: {
    marginStart: 12,
    justifyContent: 'center',
  },
  initials: {
    color: theme.colors.white,
  },
});
