import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';

interface IProps {
  onIconPress: () => void;
}

interface IStateProps {
  userProfile: UserProfileModel;
}

type Props = IProps & IStateProps;

class MoreProfile extends Component<Props> {
  public render(): React.ReactNode {
    return <View style={styles.container}>{this.renderHeader()}</View>;
  }

  private renderHeader = (): React.ReactElement => {
    const { onIconPress, userProfile } = this.props;

    return (
      <TouchableOpacity onPress={onIconPress} style={styles.headerContainer}>
        <View style={styles.flexRow}>
          <View style={styles.initialsContainer}>
            <Text type="small" textType="regular" style={styles.initials}>
              {StringUtils.getInitials(userProfile?.fullName ?? 'User')}
            </Text>
          </View>
          <View style={styles.nameContainer}>
            <Text type="small" textType="regular">
              Hello!
            </Text>
            <Text type="regular" textType="semiBold">
              {userProfile?.fullName ?? 'User'}
            </Text>
          </View>
        </View>
        <Icon name={icons.rightArrow} size={18} color={theme.colors.lowPriority} />
      </TouchableOpacity>
    );
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserProfile } = UserSelector;
  return {
    userProfile: getUserProfile(state),
  };
};

const moreProfile = connect(mapStateToProps)(MoreProfile);
export { moreProfile as MoreProfile };

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
