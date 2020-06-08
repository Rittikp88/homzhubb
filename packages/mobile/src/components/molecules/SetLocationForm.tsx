import React from 'react';
import { Formik, FormikProps, FormikValues } from 'formik';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { FormButton, FormTextInput, WithShadowView } from '@homzhub/common/src/components';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  formData: {
    projectName: string;
    unitNo: string;
    blockNo: string;
  };
  onSubmit: any;
}

const SetLocationForm = (props: IProps): React.ReactElement => {
  const { formData, onSubmit } = props;
  const [t] = useTranslation(LocaleConstants.namespacesKey.propertyPost);

  const formSchema = (): yup.ObjectSchema<{
    projectName: string;
    unitNo: string;
    blockNo: string;
  }> => {
    return yup.object().shape({
      projectName: yup.string().required(t('projectNameRequired')),
      unitNo: yup.string().required(t('unitNoRequired')),
      blockNo: yup.string(),
    });
  };

  return (
    <Formik initialValues={formData} onSubmit={onSubmit} validate={FormUtils.validate(formSchema)}>
      {(formProps: FormikProps<FormikValues>): React.ReactNode => {
        return (
          <>
            <View style={styles.fieldsView}>
              <FormTextInput
                autoFocus
                name="projectName"
                label={t('projectName')}
                inputType="default"
                maxLength={80}
                numberOfLines={1}
                placeholder={t('projectNamePlaceholder')}
                formProps={formProps}
              />
              <View style={styles.contentView}>
                <View style={styles.subContentView}>
                  <FormTextInput
                    name="unitNo"
                    label={t('unitNo')}
                    maxLength={10}
                    numberOfLines={1}
                    inputType="default"
                    formProps={formProps}
                  />
                </View>
                <View style={styles.flexOne}>
                  <FormTextInput
                    name="blockNo"
                    label={t('blockNo')}
                    maxLength={10}
                    numberOfLines={1}
                    inputType="default"
                    formProps={formProps}
                  />
                </View>
              </View>
            </View>
            <WithShadowView outerViewStyle={styles.shadowView}>
              <FormButton
                type="primary"
                title={t('saveLocation')}
                containerStyle={styles.buttonStyle}
                // @ts-ignore
                onPress={formProps.handleSubmit}
                formProps={formProps}
              />
            </WithShadowView>
          </>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  fieldsView: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  contentView: {
    flexDirection: 'row',
  },
  subContentView: {
    flex: 1,
    marginRight: 16,
  },
  flexOne: {
    flex: 1,
  },
});

export default React.memo(SetLocationForm);
