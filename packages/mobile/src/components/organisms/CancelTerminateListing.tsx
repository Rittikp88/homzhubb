import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik, FormikProps, FormikValues } from 'formik';
import { WithTranslation, withTranslation } from 'react-i18next';
import * as yup from 'yup';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormCalendar } from '@homzhub/mobile/src/components/molecules/FormCalendar';
import { FormDropdown } from '@homzhub/common/src/components/molecules/FormDropdown';

interface IFormData {
  reasonId: number;
  terminationDate: string;
  description: string;
  isTerminate: boolean;
}

interface IScreenState {
  formData: IFormData;
}

interface IProps extends WithTranslation {
  isTerminate?: boolean;
}

class CancelTerminateListing extends Component<IProps, IScreenState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      formData: {
        reasonId: 0,
        terminationDate: '',
        description: '',
        isTerminate: props.isTerminate ?? false,
      },
    };
  }

  public render(): React.ReactNode {
    const { formData } = this.state;
    const { t, isTerminate = true } = this.props;
    return (
      <View style={styles.form}>
        <Formik
          onSubmit={FunctionUtils.noop}
          initialValues={{ ...formData }}
          validate={FormUtils.validate(this.formSchema)}
        >
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            const handleDescription = (value: string): void => {
              formProps.setFieldValue('description', value);
            };

            return (
              <>
                <FormDropdown
                  name="reasonId"
                  placeholder={t('common:reasonExample')}
                  label={t('common:reason')}
                  isMandatory
                  options={[]}
                  formProps={formProps}
                  dropdownContainerStyle={styles.dropdownStyle}
                />
                {isTerminate && (
                  <FormCalendar
                    allowPastDates
                    maxDate={DateUtils.getCurrentDate()}
                    formProps={formProps}
                    name="date"
                    textType="label"
                    label={t('property:terminationDate')}
                    calendarTitle={t('property:selectMoveInDate')}
                    placeHolder={t('property:selectMoveInDate')}
                    isMandatory
                  />
                )}
                <TextArea
                  value={formProps.values.description}
                  placeholder={t('common:typeDescriptionHere')}
                  label={t('assetDescription:description')}
                  wordCountLimit={500}
                  containerStyle={styles.textArea}
                  onMessageChange={handleDescription}
                />
                <Label type="large" style={styles.message}>
                  {t('common:actionNotDone')}
                </Label>
                <FormButton
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  containerStyle={{ backgroundColor: theme.colors.error }}
                  formProps={formProps}
                  disabled={!formProps.values.subject || !formProps.values.category}
                  type="primary"
                  title={isTerminate ? t('common:terminate') : t('property:deleteListing')}
                />
              </>
            );
          }}
        </Formik>
      </View>
    );
  }

  private formSchema = (): yup.ObjectSchema<IFormData> => {
    const { t } = this.props;

    return yup.object().shape({
      isTerminate: yup.boolean(),
      terminationDate: yup.string().when('isTerminate', {
        is: true,
        then: yup.string().required(t('moreProfile:fieldRequiredError')),
      }),
      reasonId: yup.number().required(t('moreProfile:fieldRequiredError')),
      description: yup.string(),
    });
  };
}

export default withTranslation()(CancelTerminateListing);

const styles = StyleSheet.create({
  form: {
    paddingVertical: 14,
  },
  dropdownStyle: {
    paddingVertical: 12,
  },
  textArea: {
    marginTop: 10,
    marginBottom: 50,
  },
  message: {
    alignSelf: 'center',
    color: theme.colors.darkTint5,
    marginVertical: 12,
  },
});
