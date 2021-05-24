import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import UserProfileForm, { IUserProfileForm } from '@homzhub/mobile/src/components/molecules/UserProfileForm';
import EmergencyContactForm from '@homzhub/common/src/components/molecules/EmergencyContactForm';
import WorkInfoForm from '@homzhub/common/src/components/molecules/WorkInfoForm';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { CommonParamList } from '@homzhub/mobile/src/navigation/Common';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import {
  IUpdateProfile,
  IUpdateProfileResponse,
  UpdateProfileTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';

type navigationProps = NavigationScreenProps<CommonParamList, ScreensKeys.UpdateUserProfileScreen>;

type libraryProps = WithTranslation & navigationProps;

interface IStateProps {
  userProfile: UserProfileModel;
}

type IOwnProps = libraryProps & IStateProps;

interface IOwnState {
  personalDetails: IUserProfileForm;
  profileUpdateResponse: IUpdateProfileResponse;
  isFormLoading: boolean;
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
      address: '',
      postalCode: '',
      cityName: '',
      stateName: '',
      country: '',
      countryIsoCode: '',
    },
    profileUpdateResponse: {
      new_phone: false,
      new_email: false,
      email_otp: false,
      phone_otp: false,
    },
    isFormLoading: false,
  };

  public render = (): React.ReactNode => {
    const { t } = this.props;
    const { isFormLoading } = this.state;

    if (isFormLoading) {
      return <Loader visible={isFormLoading} />;
    }

    return (
      <UserScreen title={t('assetMore:more')} pageTitle={this.renderSectionHeader()} onBackPress={this.goBack}>
        <View style={styles.container}>{this.renderFormOnType()}</View>
      </UserScreen>
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
            basicDetails={{ email: userProfile.email, phone: userProfile.phoneNumber }}
            updateFormLoadingState={this.changeLoadingStatus}
          />
        );
      case UpdateUserFormTypes.WorkInfo:
        return (
          <WorkInfoForm
            onFormSubmitSuccess={this.onFormSubmissionSuccess}
            formData={{
              name: workInfo ? workInfo.companyName : '',
              email: workInfo && workInfo.workEmail ? workInfo.workEmail : '',
            }}
            updateFormLoadingState={this.changeLoadingStatus}
          />
        );
      default:
        return (
          <UserProfileForm
            userData={userProfile}
            onFormSubmitSuccess={this.onUpdateProfileSuccess}
            updateFormLoadingState={this.changeLoadingStatus}
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
        return t('editContactDetails');
      case UpdateUserFormTypes.WorkInfo:
        return t('editHeaderText', { title });
      default:
        return title as string;
    }
  };

  private onUpdateProfileSuccess = (
    profileDetails: IUserProfileForm,
    profileUpdateResponse?: IUpdateProfileResponse,
    isAddressRequired?: boolean
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
    let paramsObj = {};

    if (phoneOtp) {
      paramsObj = {
        otpSentTo: phone,
        countryCode: phoneCode,
      };
    } else if (emailOtp) {
      paramsObj = {
        otpSentTo: email,
      };
    }

    navigation.navigate(ScreensKeys.OTP, {
      type: otpType,
      // @ts-ignore
      title: t('otpVerificationText'),
      phone,
      email,
      updateProfileCallback: (phoneOrEmailOtp: string, emailOTP?: string) =>
        this.updateProfileDetails(phoneOrEmailOtp, emailOTP, isAddressRequired),
      ...paramsObj,
    });
  };

  private onFormSubmissionSuccess = (): void => {
    const { t } = this.props;

    AlertHelper.success({ message: t('profileUpdatedSuccessfully') });
    this.goBack();
  };

  private changeLoadingStatus = (isFormLoading: boolean): void => {
    this.setState({ isFormLoading });
  };

  private updateProfileDetails = async (
    phoneOrEmailOtp: string,
    emailOtp?: string,
    isAddressRequired?: boolean
  ): Promise<void> => {
    const { t } = this.props;
    const {
      personalDetails,
      profileUpdateResponse: { new_phone, new_email, phone_otp, email_otp },
    } = this.state;
    const {
      firstName,
      lastName,
      phoneCode,
      phone,
      email,
      address,
      cityName,
      country,
      stateName,
      countryIsoCode,
      postalCode,
    } = personalDetails;

    const userAddress = {
      address,
      postal_code: postalCode,
      city_name: cityName,
      state_name: stateName,
      country_name: country,
      country_iso2_code: countryIsoCode,
    };

    const payload: IUpdateProfile = {
      action: UpdateProfileTypes.UPDATE_BY_OTP,
      payload: {
        ...(new_phone && { new_phone }),
        ...(new_email && { new_email }),
        ...(phone_otp && { phone_otp: phoneOrEmailOtp }),
        ...(email_otp && { email_otp: emailOtp || phoneOrEmailOtp }),
        profile_details: {
          first_name: firstName,
          last_name: lastName,
          phone_code: phoneCode,
          phone_number: phone,
          email,
          user_address: isAddressRequired ? userAddress : null,
        },
      },
    };

    try {
      await UserRepository.updateUserProfileByActions(payload);

      AlertHelper.success({ message: t('profileUpdatedSuccessfully') });
      this.goBack();
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
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
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
});
