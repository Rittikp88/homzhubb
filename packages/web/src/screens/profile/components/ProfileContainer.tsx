import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import BasicInformations from '@homzhub/web/src/screens/profile/components/BasicInformations';
import ProfilePhoto from '@homzhub/web/src/screens/profile/components/ProfilePhoto';
import WorkDetails from '@homzhub/web/src/screens/profile/components/WorkDetails';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IDispatchProps {
  getUserProfile: () => void;
}
interface IStateProps {
  userProfile: UserProfileModel;
  isLoading: boolean;
}
type IProps = IStateProps & IDispatchProps;

const ProfileContainer: FC<IProps> = (props: IProps) => {
  const { getUserProfile, userProfile } = props;
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();
  useEffect(() => {
    getUserProfile();
  }, []);

  if (!userProfile) {
    return null;
  }

  return (
    <View style={[styles.container, (isTablet || isMobile) && styles.containerTab]}>
      <ProfilePhoto userProfileInfo={userProfile} />
      <View style={isTablet && styles.subContainerTab}>
        <View style={isTablet && styles.basicInfoTab}>
          <BasicInformations userProfileInfo={userProfile} />
          <View style={[styles.changePassword, isTablet && styles.changePasswordTab]}>
            <View
              style={[
                styles.innerContainer,
                isTablet && styles.innerContainerTab,
                isMobile && styles.innerContainerMob,
              ]}
            >
              <Text type="small" textType="semiBold">
                {t('moreProfile:changePassword')}
              </Text>
              <Icon size={20} name={icons.rightArrow} color={theme.colors.primaryColor} />
            </View>
          </View>
        </View>
        <View style={isTablet && styles.workDetailTab}>
          <WorkDetails userProfileInfo={userProfile} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 359,
  },
  containerTab: {
    width: '100%',
  },

  innerContainerTab: {
    marginVertical: 16,
  },
  innerContainerMob: {
    marginHorizontal: 16,
  },
  changePassword: {
    backgroundColor: theme.colors.white,
  },
  changePasswordTab: {
    top: 16,
  },
  innerContainer: {
    marginHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subContainerTab: {
    flexDirection: 'row',
    top: 16,
  },

  basicInfoTab: {
    width: '48.7%',
  },
  workDetailTab: {
    width: '48.7%',
    left: 18,
  },
});
const mapStateToProps = (state: IState): IStateProps => {
  const { getUserProfile, isUserProfileLoading } = UserSelector;
  return {
    userProfile: getUserProfile(state),
    isLoading: isUserProfileLoading(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getUserProfile } = UserActions;
  return bindActionCreators({ getUserProfile }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
