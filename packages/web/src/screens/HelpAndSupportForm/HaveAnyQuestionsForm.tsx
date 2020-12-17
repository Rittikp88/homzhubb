import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { useTranslation } from 'react-i18next';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { User } from '@homzhub/common/src/domain/models/User';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { theme } from '@homzhub/common/src/styles/theme';

interface IFormData {
  subject: string;
  description: string;
}

const HaveAnyQuestionsForm: React.FC = () => {
  const { t } = useTranslation();
  const contact = { fullName: 'Shreya Sharma', countryCode: '+1', phoneNumber: '(217) 555-0113' } as User;

  const formData = {
    subject: '',
    description: '',
  };

  return (
    <View style={styles.content}>
      <View>
        <View>
          <Text type="small" textType="semiBold" style={styles.title}>
            {t('youContacting')}
          </Text>
          <Avatar
            fullName={contact.fullName}
            designation={t('homzhubTeam')}
            phoneCode={contact.countryCode}
            phoneNumber={contact.phoneNumber}
          />
        </View>
        <Divider />
      </View>

      <Formik initialValues={formData} onSubmit={handleFormSubmit} validate={FormUtils.validate(formSchema)}>
        {(formProps: FormikProps<IFormData>) => {
          const handleDescription = (value: string): void => {
            formProps.setFieldValue('description', value);
          };

          return (
            <View>
              <FormTextInput
                formProps={formProps}
                isMandatory
                inputType="default"
                name="subject"
                label={t('subject')}
                placeholder={t('subjectPlaceholder')}
              />

              <TextArea
                value={formProps.values.description}
                placeholder={t('typeDescription')}
                label={t('assetDescription:description')}
                containerStyle={styles.textArea}
                onMessageChange={handleDescription}
              />

              <FormButton
                // @ts-ignore
                onPress={formProps.handleSubmit}
                formProps={formProps}
                disabled={!formProps.dirty || !formProps.values.subject || !formProps.values.description}
                type="primary"
                title={t('submit')}
              />
            </View>
          );
        }}
      </Formik>
    </View>
  );
};

const formSchema = (): yup.ObjectSchema<FormikValues> => {
  return yup.object().shape({
    subject: yup.string().required('This field is required'),
    description: yup.string(),
  });
};

const handleFormSubmit = (values: IFormData, formActions: FormikHelpers<IFormData>) => {
  console.log(`Subject: ${values.subject}  Description: ${values.subject}  `);
};

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 0,
    marginHorizontal: 20,
  },

  textArea: {
    marginTop: 20,
  },
  title: {
    marginBottom: 20,
  },

  content: {
    backgroundColor: theme.colors.white,
    marginVertical: 24,
  },
});

export default HaveAnyQuestionsForm;
