import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import {
  IUpdateProfile,
  IUpdateProfileResponse,
  UpdateProfileTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { AnimatedProfileHeader } from '@homzhub/mobile/src/components';
import UserProfileForm, { IUserProfileForm } from '@homzhub/mobile/src/components/molecules/UserProfileForm';
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

interface IOwnState {
  personalDetails: IUserProfileForm;
  profileUpdateResponse: IUpdateProfileResponse;
}

export enum UpdateUserFormTypes {
  EmergencyContact = 'EmergencyContact',
  WorkInfo = 'WorkInfo',
  BasicDetails = 'BasicDetails',
}

class UpdateUserProfile extends React.PureComponent<IOwnProps, IOwnState> {
  public state = {
    personalDetails: {
      firstName: '',
      lastName: '',
      phoneCode: '',
      phone: '',
      email: '',
    },
    profileUpdateResponse: {
      new_phone: false,
      new_email: false,
      email_otp: false,
      phone_otp: false,
    },
  };

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
              name: workInfo ? workInfo.companyName : '',
              email: workInfo ? workInfo.workEmail : '',
              workEmployeeId: workInfo ? workInfo.workEmployeeId : '',
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
            userFullName={userProfile.fullName}
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
    profileDetails: IUserProfileForm,
    profileUpdateResponse?: IUpdateProfileResponse
  ): void => {
    const { navigation, t } = this.props;
    const { phone, phoneCode, email } = profileDetails;

    if (!profileUpdateResponse) {
      AlertHelper.success({ message: t('profileUpdatedSuccessfully') });
      this.goBack();
      return;
    }

    this.setState({ personalDetails: profileDetails, profileUpdateResponse });
    const { email_otp: emailOtp, phone_otp: phoneOtp } = profileUpdateResponse;
    const otpType = emailOtp && phoneOtp ? OtpNavTypes.UpdateProfileByEmailPhoneOtp : OtpNavTypes.UpdateProfileByOtp;

    navigation.navigate(ScreensKeys.OTP, {
      type: otpType,
      // @ts-ignore
      title: t('otpVerificationText'),
      countryCode: phoneCode,
      phone,
      email,
      updateProfileCallback: this.updateProfileDetails,
    });
  };

  private onFormSubmissionSuccess = (): void => {
    const { t } = this.props;

    AlertHelper.success({ message: t('updateSuccessfulMessage') });
    this.goBack();
  };

  private updateProfileDetails = async (phoneOrEmailOtp: string, emailOtp?: string): Promise<void> => {
    const { navigation } = this.props;
    const {
      personalDetails,
      profileUpdateResponse: { new_phone, new_email, phone_otp, email_otp },
    } = this.state;
    const { firstName, lastName, phoneCode, phone, email } = personalDetails;

    const payload: IUpdateProfile = {
      action: UpdateProfileTypes.UPDATE_BY_OTP,
      payload: {
        ...(new_phone && { new_phone }),
        ...(new_email && { new_email }),
        ...(phone_otp && { phone_otp: parseInt(phoneOrEmailOtp, 10) }),
        ...(email_otp && { email_otp: parseInt(emailOtp || '', 10) || parseInt(phoneOrEmailOtp, 10) }),
        profile_details: {
          first_name: firstName,
          last_name: lastName,
          phone_code: phoneCode,
          phone_number: phone,
          email,
        },
      },
    };

    try {
      await UserRepository.updateUserProfileByActions(payload);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreensKeys.UserProfileScreen }],
        })
      );
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
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
