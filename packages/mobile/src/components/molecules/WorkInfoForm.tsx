import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { IUpdateWorkInfo } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton, FormTextInput } from '@homzhub/common/src/components';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  onFormSubmitSuccess?: () => void;
  formData?: IWorkInfoForm;
}

interface IWorkInfoForm {
  name: string;
  email: string;
  workEmployeeId: string;
}

interface IState {
  workInfoForm: IWorkInfoForm;
}

export class WorkInfoForm extends React.PureComponent<IProps, IState> {
  public state = {
    workInfoForm: {
      name: '',
      email: '',
      workEmployeeId: '',
    },
  };

  public componentDidMount(): void {
    const { formData } = this.props;

    this.setState({
      workInfoForm: {
        name: (formData && formData.name) || '',
        email: (formData && formData.email) || '',
        workEmployeeId: (formData && formData.workEmployeeId) || '',
      },
    });
  }

  public render(): ReactElement {
    const { t } = this.props;
    const { workInfoForm } = this.state;

    return (
      <>
        <Formik
          onSubmit={this.onSubmit}
          initialValues={workInfoForm}
          validate={FormUtils.validate(this.formSchema)}
          enableReinitialize
        >
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            return (
              <>
                <View style={styles.container}>
                  <FormTextInput
                    name="name"
                    label={t('companyName')}
                    inputType="default"
                    placeholder={t('companyName')}
                    formProps={formProps}
                  />
                  <FormTextInput
                    name="email"
                    label={t('companyEmail')}
                    numberOfLines={1}
                    inputType="email"
                    placeholder={t('companyEmail')}
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

  private onSubmit = async (values: IWorkInfoForm, formikHelpers: FormikHelpers<IWorkInfoForm>): Promise<void> => {
    const { onFormSubmitSuccess } = this.props;
    formikHelpers.setSubmitting(true);

    const payload: IUpdateWorkInfo = {
      company_name: values.name,
      work_email: values.email,
      work_employee_id: values.workEmployeeId,
    };

    try {
      await UserRepository.updateWorkInfo(payload);
      formikHelpers.setSubmitting(false);

      if (onFormSubmitSuccess) {
        onFormSubmitSuccess();
      }
    } catch (e) {
      formikHelpers.setSubmitting(false);
      AlertHelper.error({ message: e.message });
    }
  };

  private formSchema = (): yup.ObjectSchema<IWorkInfoForm> => {
    const { t } = this.props;

    return yup.object().shape({
      name: yup.string().required(t('fieldRequiredError')),
      email: yup.string().required(t('fieldRequiredError')),
      workEmployeeId: yup.string().required(t('fieldRequiredError')),
    });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.moreProfile)(WorkInfoForm);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
