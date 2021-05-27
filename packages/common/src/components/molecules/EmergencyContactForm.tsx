import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { IUpdateEmergencyContact } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  onFormSubmitSuccess?: () => void;
  formData?: IEmergencyContactForm;
  basicDetails: IBasicDetails;
  updateFormLoadingState: (isLoading: boolean) => void;
}

interface IEmergencyContactForm {
  name: string;
  phone: string;
  email: string;
  phoneCode: string;
}

interface IBasicDetails {
  phone: string;
  email: string;
}

export class EmergencyContactForm extends React.PureComponent<IProps, IEmergencyContactForm> {
  public state = {
    name: '',
    phone: '',
    email: '',
    phoneCode: '',
  };

  public componentDidMount(): void {
    const { formData } = this.props;

    this.setState({
      name: (formData && formData.name) || '',
      phone: (formData && formData.phone) || '',
      email: (formData && formData.email) || '',
      phoneCode: (formData && formData.phoneCode) || '',
    });
  }

  public render(): ReactElement {
    const { t } = this.props;

    return (
      <>
        <Formik
          onSubmit={this.onSubmit}
          initialValues={{ ...this.state }}
          validate={FormUtils.validate(this.formSchema)}
          enableReinitialize
        >
          {(formProps: FormikProps<IEmergencyContactForm>): React.ReactNode => {
            return (
              <>
                <View style={styles.container}>
                  <FormTextInput
                    name="name"
                    label={t('contactName')}
                    inputType="default"
                    placeholder={t('contactName')}
                    formProps={formProps}
                    isMandatory
                  />
                  <FormTextInput
                    name="phone"
                    label={t('common:phone')}
                    inputPrefixText={formProps.values.phoneCode}
                    inputType="phone"
                    placeholder={t('common:phone')}
                    phoneFieldDropdownText={t('auth:countryRegion')}
                    formProps={formProps}
                    isMandatory
                  />
                  <FormTextInput
                    name="email"
                    label={t('common:email')}
                    numberOfLines={1}
                    inputType="email"
                    placeholder={t('common:email')}
                    formProps={formProps}
                    isMandatory
                  />
                </View>
                <FormButton
                  formProps={formProps}
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  type="primary"
                  title={t('saveChanges')}
                  containerStyle={styles.buttonStyle}
                />
              </>
            );
          }}
        </Formik>
      </>
    );
  }

  private onSubmit = async (
    values: IEmergencyContactForm,
    formikHelpers: FormikHelpers<IEmergencyContactForm>
  ): Promise<void> => {
    const { onFormSubmitSuccess, updateFormLoadingState } = this.props;
    formikHelpers.setSubmitting(true);

    const payload: IUpdateEmergencyContact = {
      emergency_contact_name: values.name,
      emergency_contact_email: values.email,
      emergency_contact_phone: values.phone,
      emergency_contact_phone_code: values.phoneCode,
    };

    try {
      updateFormLoadingState(true);
      await UserRepository.updateEmergencyContact(payload);

      formikHelpers.setSubmitting(false);
      updateFormLoadingState(false);

      if (onFormSubmitSuccess) {
        onFormSubmitSuccess();
      }
    } catch (e) {
      updateFormLoadingState(false);
      formikHelpers.setSubmitting(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private formSchema = (): yup.ObjectSchema<IEmergencyContactForm> => {
    const {
      t,
      basicDetails: { email, phone },
    } = this.props;

    return yup.object().shape({
      name: yup.string().required(t('fieldRequiredError')),
      phone: yup.string().required(t('fieldRequiredError')).notOneOf([phone], t('duplicatePhoneError')),
      email: yup.string().required(t('fieldRequiredError')).notOneOf([email], t('duplicateEmailError')),
      phoneCode: yup.string(),
    });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.moreProfile)(EmergencyContactForm);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});