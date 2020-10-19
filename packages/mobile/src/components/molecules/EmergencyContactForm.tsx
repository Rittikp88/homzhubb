import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { IUpdateEmergencyContact } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton, FormTextInput } from '@homzhub/common/src/components';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  onFormSubmitSuccess?: () => void;
  formData?: IEmergencyContactForm;
  phoneCode: string;
}

interface IEmergencyContactForm {
  name: string;
  phone: string;
  email: string;
}

interface IState {
  emergencyContactForm: IEmergencyContactForm;
  phoneCode: string;
}

export class EmergencyContactForm extends React.PureComponent<IProps, IState> {
  public state = {
    emergencyContactForm: {
      name: '',
      phone: '',
      email: '',
    },
    phoneCode: '',
  };

  public componentDidMount(): void {
    const { formData, phoneCode } = this.props;

    this.setState({
      emergencyContactForm: {
        name: (formData && formData.name) || '',
        phone: (formData && formData.name) || '',
        email: (formData && formData.email) || '',
      },
      phoneCode: phoneCode || '+91',
    });
  }

  public render(): ReactElement {
    const { t } = this.props;
    const { emergencyContactForm, phoneCode } = this.state;

    return (
      <>
        <Formik
          onSubmit={this.onSubmit}
          initialValues={emergencyContactForm}
          validate={FormUtils.validate(this.formSchema)}
          enableReinitialize
        >
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            return (
              <>
                <View style={styles.container}>
                  <FormTextInput
                    name="name"
                    label={t('contactName')}
                    inputType="default"
                    placeholder={t('contactName')}
                    formProps={formProps}
                  />
                  <FormTextInput
                    name="phone"
                    label={t('common:phone')}
                    maxLength={10}
                    inputPrefixText={phoneCode}
                    inputType="phone"
                    placeholder={t('common:phone')}
                    onPhoneCodeChange={this.handlePhoneCodeChange}
                    phoneFieldDropdownText={t('auth:countryRegion')}
                    formProps={formProps}
                  />
                  <FormTextInput
                    name="email"
                    label={t('common:email')}
                    numberOfLines={1}
                    inputType="email"
                    placeholder={t('common:email')}
                    formProps={formProps}
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
    const { onFormSubmitSuccess } = this.props;
    const { phoneCode } = this.state;
    formikHelpers.setSubmitting(true);

    const payload: IUpdateEmergencyContact = {
      emergency_contact_name: values.name,
      emergency_contact_email: values.email,
      emergency_contact_phone: values.phone,
      emergency_contact_phone_code: phoneCode,
    };

    try {
      await UserRepository.updateEmergencyContact(payload);
      formikHelpers.setSubmitting(false);

      if (onFormSubmitSuccess) {
        onFormSubmitSuccess();
      }
    } catch (e) {
      formikHelpers.setSubmitting(false);
      AlertHelper.error({ message: e.message });
    }
  };

  private handlePhoneCodeChange = (phoneCode: string): void => {
    this.setState({ phoneCode });
  };

  private formSchema = (): yup.ObjectSchema<IEmergencyContactForm> => {
    const { t } = this.props;

    return yup.object().shape({
      name: yup.string().required(t('fieldRequiredError')),
      phone: yup.string().required(t('fieldRequiredError')),
      email: yup.string().required(t('fieldRequiredError')),
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
