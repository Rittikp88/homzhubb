import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
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
}

interface IEmergencyContactForm {
  name: string;
  phone: string;
  email: string;
  phoneCode: string;
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
                  />
                  <FormTextInput
                    name="phone"
                    label={t('common:phone')}
                    maxLength={10}
                    inputPrefixText={formProps.values.phoneCode}
                    inputType="phone"
                    placeholder={t('common:phone')}
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
    formikHelpers.setSubmitting(true);

    const payload: IUpdateEmergencyContact = {
      emergency_contact_name: values.name,
      emergency_contact_email: values.email,
      emergency_contact_phone: values.phone,
      emergency_contact_phone_code: values.phoneCode,
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

  private formSchema = (): yup.ObjectSchema<IEmergencyContactForm> => {
    const { t } = this.props;

    return yup.object().shape({
      name: yup.string().required(t('fieldRequiredError')),
      phone: yup.string().required(t('fieldRequiredError')),
      email: yup.string().required(t('fieldRequiredError')),
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
