/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import EmergencyContactForm from '@homzhub/common/src/components/molecules/EmergencyContactForm';
import { IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import PhoneCodePrefix from '@homzhub/web/src/components/molecules/PhoneCodePrefix';
import WorkInfoForm from '@homzhub/common/src/components/molecules/WorkInfoForm';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { OtpNavTypes } from '@homzhub/web/src/components/organisms/OtpVerification';
import {
  IUpdateProfile,
  IUpdateProfileResponse,
  UpdateProfileTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IUserProfileForm } from '@homzhub/mobile/src/components/molecules/UserProfileForm';
import { ProfileUserFormTypes } from '@homzhub/web/src/screens/profile/components/ProfilePopover';

interface ICompProps {
  formType: ProfileUserFormTypes;
  handlePopupClose: () => void;
}

interface IStateProps {
  userProfile?: UserProfileModel;
}
interface IDispatchProps {
  getUserProfile: () => void;
}

type Props = WithTranslation & IStateProps & ICompProps & IDispatchProps;

interface IOwnState {
  personalDetails: IUserProfileForm;
  profileUpdateResponse: IUpdateProfileResponse;
  isFormLoading: boolean;
}

export class ProfileModalContent extends React.PureComponent<Props, IOwnState> {
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
    const { isFormLoading } = this.state;

    if (isFormLoading) {
      return <Loader visible={isFormLoading} />;
    }

    return <View style={styles.container}>{this.renderFormOnType()}</View>;
  };

  private renderFormOnType = (): React.ReactNode => {
    const { userProfile, formType, handlePopupClose } = this.props;
    if (!userProfile) {
      return null;
    }
    const { emergencyContact, workInfo } = userProfile;
    const handleWebView = (params: IWebProps): React.ReactElement => {
      return <PhoneCodePrefix {...params} />;
    };
    switch (formType || ProfileUserFormTypes.BasicDetails) {
      case ProfileUserFormTypes.EmergencyContact:
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
            handlePopupClose={handlePopupClose}
            webGroupPrefix={handleWebView}
          />
        );
      case ProfileUserFormTypes.WorkInfo:
        return (
          <WorkInfoForm
            onFormSubmitSuccess={this.onFormSubmissionSuccess}
            formData={{
              name: workInfo ? workInfo.companyName : '',
              email: workInfo && workInfo.workEmail ? workInfo.workEmail : '',
            }}
            updateFormLoadingState={this.changeLoadingStatus}
            handlePopupClose={handlePopupClose}
          />
        );
      default:
        return <View />; // TODO: Mohak - UserProfile Component
    }
  };

  private onUpdateProfileSuccess = (
    profileDetails: IUserProfileForm,
    profileUpdateResponse?: IUpdateProfileResponse,
    isAddressRequired?: boolean
  ): void => {
    const { t } = this.props;
    const { phone, phoneCode, email } = profileDetails;

    if (!profileUpdateResponse) {
      AlertHelper.success({ message: t('profileUpdatedSuccessfully') });
      // Navigation Logic
      return;
    }
    this.setState({ personalDetails: profileDetails, profileUpdateResponse });
    const { email_otp: emailOtp, phone_otp: phoneOtp } = profileUpdateResponse;
    // eslint-disable-next-line no-unused-vars
    const otpType = emailOtp && phoneOtp ? OtpNavTypes.UpdateProfileByEmailPhoneOtp : OtpNavTypes.UpdateProfileByOtp;
    let paramsObj = {};

    if (phoneOtp) {
      paramsObj = {
        otpSentTo: phone,
        countryCode: phoneCode,
      };
    } else if (emailOtp) {
      // eslint-disable-next-line no-unused-vars
      paramsObj = {
        otpSentTo: email,
      };
    }
    // Logic to navigate to OTPVerification
  };

  private onFormSubmissionSuccess = (): void => {
    const { getUserProfile } = this.props;
    getUserProfile();
    // Navigation Logic
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
      // Navigate Logic
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserProfile } = UserSelector;
  return {
    userProfile: getUserProfile(state),
  };
};
export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getUserProfile } = UserActions;
  return bindActionCreators({ getUserProfile }, dispatch);
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.moreProfile)(ProfileModalContent));
