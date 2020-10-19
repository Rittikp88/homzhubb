import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { AnimatedProfileHeader } from '@homzhub/mobile/src/components';
import EmergencyContactForm from '@homzhub/mobile/src/components/molecules/EmergencyContactForm';
import WorkInfoForm from '@homzhub/mobile/src/components/molecules/WorkInfoForm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { UserProfile as UserProfileModel } from '@homzhub/common/src/domain/models/UserProfile';

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
      route: {
        params: { formType },
      },
      userProfile: { emergencyContact, workInfo },
    } = this.props;

    switch (formType) {
      case UpdateUserFormTypes.EmergencyContact:
        return (
          <EmergencyContactForm
            onFormSubmitSuccess={this.onFormSubmissionSuccess}
            formData={{
              name: emergencyContact.name,
              email: emergencyContact.email,
              phone: emergencyContact.phoneNumber,
            }}
            phoneCode={emergencyContact.phoneCode}
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
        return null;
    }
  };

  private renderSectionHeader = (): string => {
    const {
      route: {
        params: { title, formType },
      },
      t,
    } = this.props;

    switch (formType) {
      case UpdateUserFormTypes.EmergencyContact:
        return t('editHeaderText', { title });
      case UpdateUserFormTypes.WorkInfo:
        return t('editHeaderText', { title });
      default:
        return t('basicDetails');
    }
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
