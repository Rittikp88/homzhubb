import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { FormButton, FormTextInput, Text } from '@homzhub/common/src/components';
import { theme } from '@homzhub/common/src/styles/theme';
import { AnimatedProfileHeader } from '@homzhub/mobile/src/components';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IUpdatePassword, UpdateTypes } from '@homzhub/common/src/domain/repositories/interfaces';

interface IChangePasswordForm {
  currentPassword: string;
  newPassword: string;
}

interface IScreenState {
  formData: IChangePasswordForm;
}

type navigationProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.UpdatePassword>;

type Props = WithTranslation & navigationProps;

class UpdatePassword extends Component<Props, IScreenState> {
  public state = {
    formData: {
      currentPassword: '',
      newPassword: '',
    },
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    return (
      <AnimatedProfileHeader
        title={t('assetMore:more')}
        sectionHeader={t('moreProfile:changePassword')}
        sectionTitleType="semiBold"
        onBackPress={this.goBack}
      >
        {this.renderForm()}
      </AnimatedProfileHeader>
    );
  }

  private renderForm = (): React.ReactElement => {
    const { formData } = this.state;
    const { t } = this.props;
    const initialFormValues = { ...formData };
    return (
      <>
        <Formik
          onSubmit={this.handleSubmit}
          initialValues={initialFormValues}
          validate={FormUtils.validate(this.formSchema)}
          enableReinitialize
        >
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            const { currentPassword, newPassword } = formProps.values;
            return (
              <View style={styles.formikView}>
                <FormTextInput
                  name="currentPassword"
                  label={t('currentPassword')}
                  inputType="password"
                  formProps={formProps}
                  isMandatory
                />
                <FormTextInput
                  name="newPassword"
                  label={t('createNewPassword')}
                  inputType="password"
                  helpText={t('passwordValidation')}
                  formProps={formProps}
                  isMandatory
                />
                <FormButton
                  formProps={formProps}
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  type="primary"
                  title={t('updatePassword')}
                  disabled={!currentPassword && !newPassword}
                  containerStyle={styles.button}
                />
                <Text type="small" textType="semiBold" style={styles.forgotText}>
                  {t('forgotPassword')}
                </Text>
              </View>
            );
          }}
        </Formik>
      </>
    );
  };

  private goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handleSubmit = async (
    values: IChangePasswordForm,
    formActions: FormikHelpers<IChangePasswordForm>
  ): Promise<void> => {
    const { t } = this.props;
    formActions.setSubmitting(true);
    const { currentPassword, newPassword } = values;
    if (currentPassword === newPassword) {
      AlertHelper.error({ message: t('moreProfile:uniquePassword') });
      return;
    }

    const updatePayload: IUpdatePassword = {
      action: UpdateTypes.UPDATE_PASSWORD,
      payload: {
        old_password: currentPassword,
        new_password: newPassword,
      },
    };

    try {
      await UserRepository.updatePassword(updatePayload);
      AlertHelper.success({ message: t('moreProfile:passwordChanged') });
      this.goBack();
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private formSchema = (): yup.ObjectSchema<IChangePasswordForm> => {
    const { t } = this.props;
    return yup.object().shape({
      currentPassword: yup
        .string()
        .matches(FormUtils.passwordRegex, t('passwordValidation'))
        .min(8, t('minimumCharacters'))
        .required(t('passwordRequired')),
      newPassword: yup
        .string()
        .matches(FormUtils.passwordRegex, t('passwordValidation'))
        .min(8, t('minimumCharacters'))
        .required(t('passwordRequired')),
    });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.auth)(UpdatePassword);

const styles = StyleSheet.create({
  formikView: {
    backgroundColor: theme.colors.white,
    padding: theme.layout.screenPadding,
    height: 600,
  },
  button: {
    marginTop: 30,
    flex: 0,
  },
  forgotText: {
    alignSelf: 'center',
    color: theme.colors.blue,
    marginTop: 20,
  },
});
