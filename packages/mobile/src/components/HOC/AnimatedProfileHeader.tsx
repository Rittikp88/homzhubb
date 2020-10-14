import React, { Component, ReactElement } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components';
import { StatusBarComponent } from '@homzhub/mobile/src/components/atoms/StatusBar';
import { IUser } from '@homzhub/common/src/domain/models/User';

interface IProps {
  children: React.ReactElement;
  title?: string;
  sectionHeader?: string;
  onProfileIconPress?: () => void;
  onBackPress?: () => void;
  isOuterScrollEnabled?: boolean;
}

interface IAnimatedProfileHeaderState {
  user: IUser | null;
}

type Props = IProps;

export class AnimatedProfileHeader extends Component<Props, IAnimatedProfileHeaderState> {
  public state = {
    user: {} as IUser,
  };

  public componentDidMount = async (): Promise<void> => {
    const user: IUser | null = await StorageService.get(StorageKeys.USER);
    this.setState({ user });
  };

  public render(): React.ReactNode {
    const { children, isOuterScrollEnabled, onBackPress } = this.props;
    return (
      <View style={styles.container}>
        <>
          <StatusBarComponent backgroundColor={theme.colors.primaryColor} isTranslucent barStyle="light-content" />
          {this.renderHeader()}
        </>
        <ScrollView scrollEnabled={isOuterScrollEnabled} showsVerticalScrollIndicator={false} nestedScrollEnabled>
          <>
            <View style={styles.headingView} />
            <View style={styles.scrollView}>
              {onBackPress && this.renderSectionHeader()}
              {children}
            </View>
          </>
        </ScrollView>
      </View>
    );
  }

  private renderSectionHeader = (): ReactElement => {
    const { onBackPress, sectionHeader } = this.props;

    return (
      <View style={styles.header}>
        <Icon
          size={24}
          name={icons.leftArrow}
          color={theme.colors.primaryColor}
          style={styles.iconStyle}
          onPress={onBackPress}
        />
        <Text type="small" textType="bold">
          {sectionHeader}
        </Text>
      </View>
    );
  };

  private renderHeader = (): React.ReactElement => {
    const { title = '', onProfileIconPress } = this.props;
    const { user } = this.state;
    return (
      <View style={styles.headerContainer}>
        <Text type="regular" textType="semiBold" style={styles.title}>
          {title}
        </Text>
        <View style={styles.initialsContainer}>
          <Text type="small" textType="regular" style={styles.initials} onPress={onProfileIconPress}>
            {StringUtils.getInitials(user?.full_name ?? 'User')}
          </Text>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    position: 'relative',
    paddingHorizontal: theme.layout.screenPadding,
    bottom: 85,
  },
  headingView: {
    backgroundColor: theme.colors.primaryColor,
    height: 100,
    borderBottomWidth: 8,
    borderBottomColor: theme.colors.green,
  },
  initialsContainer: {
    ...(theme.circleCSS(35) as object),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkTint7,
    borderColor: theme.colors.white,
    borderWidth: 1,
  },
  initials: {
    color: theme.colors.white,
  },
  headerContainer: {
    backgroundColor: theme.colors.primaryColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.viewport.width > 400 ? (PlatformUtils.isIOS() ? 30 : 40) : 30,
    paddingBottom: 10,
  },
  title: {
    color: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.layout.screenPaddingTop,
    backgroundColor: theme.colors.white,
  },
  iconStyle: {
    paddingRight: 12,
  },
});
