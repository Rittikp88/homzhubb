import React, { Component, ReactElement } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text, FontWeightType } from '@homzhub/common/src/components';
import { StatusBarComponent } from '@homzhub/mobile/src/components/atoms/StatusBar';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';

interface IProps {
  children: React.ReactElement;
  title?: string;
  sectionHeader?: string;
  sectionTitleType?: FontWeightType;
  onProfileIconPress?: () => void;
  onBackPress?: () => void;
  isOuterScrollEnabled?: boolean;
}

interface IStateProps {
  userProfile: UserProfileModel;
}

type Props = IProps & IStateProps;

class AnimatedProfileHeader extends Component<Props> {
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
    const { onBackPress, sectionHeader, sectionTitleType = 'bold' } = this.props;

    return (
      <View style={styles.header}>
        <Icon
          size={24}
          name={icons.leftArrow}
          color={theme.colors.primaryColor}
          style={styles.iconStyle}
          onPress={onBackPress}
        />
        <Text type="small" textType={sectionTitleType}>
          {sectionHeader}
        </Text>
      </View>
    );
  };

  private renderHeader = (): React.ReactElement => {
    const { title = '', onProfileIconPress, userProfile } = this.props;

    return (
      <View style={styles.headerContainer}>
        <Text type="regular" textType="semiBold" style={styles.title}>
          {title}
        </Text>
        <View style={styles.initialsContainer}>
          <Text type="small" textType="regular" style={styles.initials} onPress={onProfileIconPress}>
            {StringUtils.getInitials(userProfile?.fullName ?? 'User')}
          </Text>
        </View>
      </View>
    );
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserProfile } = UserSelector;
  return {
    userProfile: getUserProfile(state),
  };
};

const animatedProfileHeader = connect(mapStateToProps)(AnimatedProfileHeader);
export { animatedProfileHeader as AnimatedProfileHeader };

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
