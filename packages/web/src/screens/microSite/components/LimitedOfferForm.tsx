import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IFormData {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
}
interface IProp {
  onUserSubscription: () => void;
}
const LimitedOfferForm: FC<IProp> = ({ onUserSubscription }: IProp) => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.auth);
  const isDesktop = useDown(deviceBreakpoint.DESKTOP);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const formStyles = formStyle(isMobile, isDesktop);
  const formData = {
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
  };

  const handleSubmit = (values: IFormData, formActions: FormikHelpers<IFormData>): void => {
    formActions.setSubmitting(true);
    CommonRepository.subscribeToNewsLetter({
      email: values.emailAddress,
      name: values.fullName,
      phone_number: values.phoneNumber,
      origin: 'maharashtra_connect',
    })
      .then(() => {
        onUserSubscription();
        formActions.setSubmitting(false);
      })
      .catch((error) => {
        const errorMessage = ErrorUtils.getErrorMessage(error.details);
        AlertHelper.error({ message: errorMessage });
      });
  };

  const LimitedOfferFormSchema = (): yup.ObjectSchema<IFormData> => {
    return yup.object().shape({
      fullName: yup.string().required(t('auth:nameRequired')),
      emailAddress: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
      phoneNumber: yup
        .string()
        .required(t('auth:numberRequired'))
        .min(5, t('auth:minimumDigits', { number: 5 })),
    });
  };
  return (
    <View style={formStyles.container}>
      <Formik initialValues={formData} onSubmit={handleSubmit} validate={FormUtils.validate(LimitedOfferFormSchema)}>
        {(formProps: FormikProps<IFormData>): React.ReactElement => (
          <View style={formStyles.formContent}>
            <FormTextInput
              name="fullName"
              label=""
              inputType="name"
              placeholder={t('auth:enterName')}
              formProps={formProps}
              style={formStyles.emailStyles}
              placeholderTextColor={theme.colors.darkTint7}
              containerStyle={formStyles.emailStylesView}
            />
            <FormTextInput
              name="emailAddress"
              label=""
              inputType="email"
              placeholder={t('auth:enterEmailText')}
              formProps={formProps}
              style={formStyles.emailStyles}
              placeholderTextColor={theme.colors.darkTint7}
              containerStyle={formStyles.emailStylesView}
            />
            <FormTextInput
              name="phoneNumber"
              label=""
              inputType="phone"
              maxLength={10}
              placeholder={t('auth:phoneWithCode')}
              formProps={formProps}
              style={formStyles.emailStyles}
              placeholderTextColor={theme.colors.darkTint7}
              containerStyle={formStyles.emailStylesView}
            />
            <FormButton
              // @ts-ignore
              onPress={formProps.handleSubmit}
              formProps={formProps}
              type="primary"
              title={t('microSite:limitedPopupButton')}
              containerStyle={formProps.isValid ? formStyles.button : formStyles.disabledButton}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

interface IFormItemSTyle {
  container: ViewStyle;
  button: ViewStyle;
  disabledButton: ViewStyle;
  formContent: ViewStyle;
  titleStyle: ViewStyle;
  emailStyles: ViewStyle;
  emailStylesView: ViewStyle;
}

const formStyle = (isMobile: boolean, isDesktop: boolean): StyleSheet.NamedStyles<IFormItemSTyle> =>
  StyleSheet.create<IFormItemSTyle>({
    container: {
      width: '100%',
    },
    formContent: {
      margin: isMobile ? 0 : 10,
      width: isMobile ? '90%' : '60%',
      alignSelf: 'center',
      marginTop: 36,
    },
    button: {
      backgroundColor: theme.colors.blue,
      marginVertical: 20,
    },
    disabledButton: {
      backgroundColor: theme.colors.disabled,
      marginVertical: 20,
    },
    titleStyle: {
      color: theme.colors.white,
      marginHorizontal: isMobile ? 8 : 36,
    },
    emailStyles: {
      margin: 0,
    },
    emailStylesView: {
      backgroundColor: theme.colors.background,
      textAlign: 'center',
      justifyContent: 'center',
      marginBottom: '3%',
    },
  });

export default LimitedOfferForm;
