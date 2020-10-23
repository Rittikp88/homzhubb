import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { IProfileDetails, IUpdateProfileResponse } from '@homzhub/common/src/domain/repositories/interfaces';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { AnimatedProfileHeader } from '@homzhub/mobile/src/components';
import UserProfileForm from '@homzhub/mobile/src/components/molecules/UserProfileForm';
import EmergencyContactForm from '@homzhub/mobile/src/components/molecules/EmergencyContactForm';
import WorkInfoForm from '@homzhub/mobile/src/components/molecules/WorkInfoForm';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type navigationProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.UpdateUserProfileScreen>;

type libraryProps = WithTranslation & navigationProps;

interface IStateProps {
  userProfile: UserProfileModel;
}

type IOwnProps = libraryProps & IStateProps;

export enum UpdateUserFormTypes {
  EmergencyContact = 'EmergencyContact',
  WorkInfo = 'WorkInfo',
  BasicDetails = 'BasicDetails',
}

class UpdateUserProfile extends React.PureComponent<IOwnProps> {
  public render = (): React.ReactNode => {
    return (
      <AnimatedProfileHeader sectionHeader={this.renderSectionHeader()} onBackPress={this.goBack}>
        <View style={styles.container}>{this.renderFormOnType()}</View>
      </AnimatedProfileHeader>
    );
  };

  private renderFormOnType = (): React.ReactNode => {
    const {
      route: { params },
      userProfile,
    } = this.props;
    const { emergencyContact, workInfo } = userProfile;

    switch (params ? params.formType : UpdateUserFormTypes.BasicDetails) {
      case UpdateUserFormTypes.EmergencyContact:
        return (
          <EmergencyContactForm
            onFormSubmitSuccess={this.onFormSubmissionSuccess}
            formData={{
              name: emergencyContact.name,
              email: emergencyContact.email,
              phone: emergencyContact.phoneNumber,
              phoneCode: emergencyContact.phoneCode,
            }}
          />
        );
      case UpdateUserFormTypes.WorkInfo:
        return (
          <WorkInfoForm
            onFormSubmitSuccess={this.onFormSubmissionSuccess}
            formData={{
              name: workInfo.companyName,
              email: workInfo.workEmail,
              workEmployeeId: workInfo.workEmployeeId,
            }}
          />
        );
      default:
        return (
          <UserProfileForm
            formData={{
              firstName: userProfile.firstName,
              lastName: userProfile.lastName,
              phoneCode: userProfile.countryCode,
              phone: userProfile.phoneNumber,
              email: userProfile.email,
            }}
            onFormSubmitSuccess={this.onUpdateProfileSuccess}
            isPasswordVerificationRequired={userProfile.isPasswordCreated}
          />
        );
    }
  };

  private renderSectionHeader = (): string => {
    const {
      route: { params },
      t,
    } = this.props;

    if (!params) {
      return t('editProfile');
    }

    const { title, formType } = params;

    switch (formType) {
      case UpdateUserFormTypes.EmergencyContact:
        return t('editHeaderText', { title });
      case UpdateUserFormTypes.WorkInfo:
        return t('editHeaderText', { title });
      default:
        return title ? t('editHeaderText', { title: t('assetMore:profile') }) : t('editProfile');
    }
  };

  private onUpdateProfileSuccess = (
    profileDetails: IProfileDetails,
    profileUpdateResponse?: IUpdateProfileResponse
  ): void => {
    const { navigation, t } = this.props;
    const { phone_number: phone, phone_code: phoneCode } = profileDetails;

    if (!profileUpdateResponse) {
      AlertHelper.success({ message: t('profileUpdatedSuccessfully') });
      this.goBack();
      return;
    }
    const { email_otp: emailOtp, phone_otp: phoneOtp } = profileUpdateResponse;
    const otpType =
      emailOtp && phoneOtp ? OtpNavTypes.UpdateProfileByEmailPhoneOtp : OtpNavTypes.UpdateProfileByPhoneOtp;

    navigation.navigate(ScreensKeys.OTP, {
      type: otpType,
      // @ts-ignore
      title: t('otpVerificationText'),
      countryCode: phoneCode,
      phone,
      profileDetails,
    });
  };

  private onFormSubmissionSuccess = (): void => {
    const { t } = this.props;

    AlertHelper.success({ message: t('updateSuccessfulMessage') });
    this.goBack();
  };

  private goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserProfile } = UserSelector;
  return {
    userProfile: getUserProfile(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.moreProfile)(UpdateUserProfile));

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
});
