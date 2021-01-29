import React from 'react';
import { StyleSheet, View } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { EmailVerificationActions, IEmailVerification } from '@homzhub/common/src/domain/repositories/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { UpdateUserFormTypes } from '@homzhub/mobile/src/screens/Asset/More/UpdateUserProfile';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { DetailsCard, Loader } from '@homzhub/mobile/src/components';
import { Progress } from '@homzhub/common/src/components/atoms/Progress/Progress';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type libraryProps = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.UserProfileScreen>;

interface IDispatchProps {
  getUserProfile: () => void;
}

interface IStateProps {
  userProfile: UserProfileModel;
  isLoading: boolean;
}

interface IOwnState {
  isBottomSheetOpen: boolean;
  isEmailVerified: boolean;
  isLocalViewLoading: boolean;
  verificationId: string;
}

type IOwnProps = libraryProps & IStateProps & IDispatchProps;

class UserProfile extends React.PureComponent<IOwnProps, IOwnState> {
  private onFocusSubscription: any;

  public state = {
    isBottomSheetOpen: false,
    isEmailVerified: false,
    isLocalViewLoading: false,
    verificationId: '',
  };

  public componentDidMount(): void {
    const { navigation, getUserProfile } = this.props;
    if (navigation) {
      this.onFocusSubscription = navigation.addListener('focus', () => {
        getUserProfile();
      });
    }
  }

  public async componentDidUpdate(prevProps: Readonly<IOwnProps>, prevState: Readonly<IOwnState>): Promise<void> {
    const {
      route: { params },
    } = this.props;
    const { verificationId } = prevState;

    if (params && params.verification_id && !verificationId) {
      await this.verifyEmail();
    }
  }

  public componentWillUnmount = (): void => {
    this.onFocusSubscription();
  };

  public render = (): React.ReactElement => {
    const { isLoading } = this.props;
    const { isLocalViewLoading } = this.state;

    return (
      <>
        {this.renderComponent()}
        <Loader visible={isLoading || isLocalViewLoading} />
      </>
    );
  };

  public renderComponent = (): React.ReactNode => {
    const { t, userProfile, navigation } = this.props;
    const { isBottomSheetOpen, isEmailVerified } = this.state;

    if (!userProfile) {
      return null;
    }

    const {
      profileProgress,
      fullName,
      basicDetailsArray,
      emergencyContactArray,
      workInfoArray,
      profilePicture,
    } = userProfile;

    return (
      <>
        <UserScreen title={t('assetMore:more')} pageTitle={t('assetMore:profile')} onBackPress={navigation.goBack}>
          <View style={styles.container}>
            <View style={styles.profileImage}>
              <Avatar
                isOnlyAvatar
                fullName={fullName || ''}
                imageSize={80}
                onPressCamera={(): void => this.onUpdatePress(t('basicDetails'))}
                image={profilePicture}
              />
            </View>
            <Progress
              containerStyles={styles.progressBar}
              title={t('assetMore:profile')}
              progress={profileProgress || 0}
            />
            <DetailsCard
              headerInfo={{ title: t('basicDetails'), icon: icons.noteBook, onPress: this.onUpdatePress }}
              details={basicDetailsArray}
              type={UpdateUserFormTypes.BasicDetails}
              onVerifyPress={this.onVerifyPress}
              showDivider
            />
            <DetailsCard
              headerInfo={{ title: t('changePassword'), icon: icons.rightArrow, onPress: this.onChangePassword }}
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
              onVerifyPress={this.onVerifyPress}
              type={UpdateUserFormTypes.WorkInfo}
            />
          </View>
        </UserScreen>
        <BottomSheet sheetHeight={400} visible={isBottomSheetOpen} onCloseSheet={this.closeBottomSheet}>
          <View>
            <Text style={styles.commonTextStyle} type="large" textType="semiBold">
              {isEmailVerified ? t('emailVerifiedText') : t('emailNotVerifiedText')}
            </Text>
            <Text style={styles.commonTextStyle} type="small" textType="regular">
              {isEmailVerified ? t('emailVerifiedDescription') : t('emailNotVerifiedDescription')}
            </Text>
            <Icon
              style={[styles.commonTextStyle, styles.iconStyles]}
              size={80}
              name={isEmailVerified ? icons.doubleCheck : icons.filledWarning}
              color={isEmailVerified ? theme.colors.completed : theme.colors.error}
            />

            <Button
              type="primary"
              title={t('common:done')}
              containerStyle={styles.buttonStyle}
              onPress={this.closeBottomSheet}
            />
          </View>
        </BottomSheet>
      </>
    );
  };

  private onUpdatePress = (title?: string, formType?: UpdateUserFormTypes): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.UpdateUserProfileScreen, { title, formType });
  };

  private onVerifyPress = async (email: string, type: UpdateUserFormTypes): Promise<void> => {
    const { t } = this.props;

    const payload: IEmailVerification = {
      action: EmailVerificationActions.GET_VERIFICATION_EMAIL,
      payload: {
        email,
        is_work_email: type !== UpdateUserFormTypes.BasicDetails,
      },
    };

    try {
      await UserRepository.sendOrVerifyEmail(payload);
      AlertHelper.info({ message: t('emailVerificationSetAlert', { email }) });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private onChangePassword = (): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.UpdatePassword);
  };

  private verifyEmail = async (): Promise<void> => {
    const {
      route: {
        params: { verification_id },
      },
      getUserProfile,
    } = this.props;
    this.setState({ isLocalViewLoading: true, verificationId: verification_id });

    const payload: IEmailVerification = {
      action: EmailVerificationActions.VERIFY_EMAIL,
      payload: {
        verification_id,
      },
    };

    try {
      await UserRepository.sendOrVerifyEmail(payload);
      getUserProfile();
      this.setState({ isBottomSheetOpen: true, isEmailVerified: true, isLocalViewLoading: false });
    } catch (e) {
      this.setState({ isBottomSheetOpen: true, isEmailVerified: false, isLocalViewLoading: false });
    }
  };

  private closeBottomSheet = (): void => {
    this.setState({ isBottomSheetOpen: false, verificationId: '' });
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
  profileImage: {
    marginTop: 18,
    alignItems: 'center',
  },
  progressBar: {
    marginBottom: 24,
  },
  buttonStyle: {
    flex: 0,
    marginHorizontal: theme.layout.screenPadding,
  },
  commonTextStyle: {
    textAlign: 'center',
  },
  iconStyles: {
    paddingTop: 30,
    paddingBottom: 60,
  },
});
