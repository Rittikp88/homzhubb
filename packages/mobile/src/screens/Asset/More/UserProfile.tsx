import React from 'react';
import { View, StyleSheet } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components';
import { AnimatedProfileHeader, DetailsCard, ProgressBar, StateAwareComponent } from '@homzhub/mobile/src/components';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { UpdateUserFormTypes } from '@homzhub/mobile/src/screens/Asset/More/UpdateUserProfile';

type libraryProps = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.UserProfileScreen>;

interface IDispatchProps {
  getUserProfile: () => void;
}

interface IStateProps {
  userProfile: UserProfileModel;
  isLoading: boolean;
}

type IOwnProps = libraryProps & IStateProps & IDispatchProps;

class UserProfile extends React.PureComponent<IOwnProps> {
  private onFocusSubscription: any;

  public componentDidMount(): void {
    const { navigation, getUserProfile } = this.props;

    if (navigation) {
      this.onFocusSubscription = navigation.addListener('focus', () => {
        getUserProfile();
      });
    }
  }

  public componentWillUnmount(): void {
    const { navigation } = this.props;
    if (navigation) {
      this.onFocusSubscription();
    }
  }

  public render = (): React.ReactElement => {
    const { isLoading } = this.props;

    return <StateAwareComponent loading={isLoading} renderComponent={this.renderComponent()} />;
  };

  public renderComponent = (): React.ReactNode => {
    const { t } = this.props;
    const { userProfile } = this.props;

    if (!userProfile) {
      return null;
    }

    const { profileProgress, fullName, basicDetailsArray, emergencyContactArray, workInfoArray } = userProfile;

    return (
      <AnimatedProfileHeader sectionHeader={t('assetMore:profile')} onBackPress={this.goBack}>
        <View style={styles.container}>
          <View style={styles.profileImage}>
            <View style={styles.initialsContainer}>
              <Text type="large" textType="regular" style={styles.initials}>
                {StringUtils.getInitials(fullName || '')}
              </Text>
            </View>
            <View style={[styles.cameraContainer, styles.roundBorder]}>
              <Icon
                size={16}
                name={icons.camera}
                color={theme.colors.white}
                style={styles.cameraIcon}
                onPress={FunctionUtils.noop}
              />
            </View>
          </View>
          <ProgressBar
            containerStyles={styles.progressBar}
            title={t('assetMore:profile')}
            progress={profileProgress || 0}
            width={theme.viewport.width > 400 ? 350 : 330}
          />
          <DetailsCard
            headerInfo={{ title: t('basicDetails'), icon: icons.noteBook, onPress: this.onUpdatePress }}
            details={basicDetailsArray}
            type={UpdateUserFormTypes.BasicDetails}
            onVerifyPress={FunctionUtils.noop}
            showDivider
          />
          <DetailsCard
            headerInfo={{ title: t('changePassword'), icon: icons.rightArrow, onPress: FunctionUtils.noop }}
            showDivider
          />
          <DetailsCard
            headerInfo={{
              title: t('emergencyContact'),
              icon: emergencyContactArray ? icons.noteBook : undefined,
              onPress: this.onUpdatePress,
            }}
            details={emergencyContactArray}
            type={UpdateUserFormTypes.EmergencyContact}
            showDivider
          />
          <DetailsCard
            headerInfo={{
              title: t('workInformation'),
              icon: workInfoArray ? icons.noteBook : undefined,
              onPress: this.onUpdatePress,
            }}
            details={workInfoArray}
            type={UpdateUserFormTypes.WorkInfo}
          />
        </View>
      </AnimatedProfileHeader>
    );
  };

  private onUpdatePress = (title: string, formType?: UpdateUserFormTypes): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.UpdateUserProfileScreen, { title, formType });
  };

  private goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.moreProfile)(UserProfile));

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
  roundBorder: {
    borderWidth: 1,
    borderColor: theme.colors.white,
    borderRadius: 50,
  },
  profileImage: {
    marginTop: 16,
    alignItems: 'center',
  },
  cameraContainer: {
    width: 24,
    height: 24,
    backgroundColor: theme.colors.primaryColor,
    bottom: 21,
    left: 24,
  },
  cameraIcon: {
    alignSelf: 'center',
    position: 'relative',
    top: 2,
  },
  progressBar: {
    marginBottom: 24,
  },
  initialsContainer: {
    ...(theme.circleCSS(80) as object),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkTint7,
    borderColor: theme.colors.white,
    borderWidth: 1,
  },
  initials: {
    color: theme.colors.white,
  },
});
