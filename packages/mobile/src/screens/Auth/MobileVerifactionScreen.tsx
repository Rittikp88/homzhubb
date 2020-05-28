import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormTextInput, Header, Text, FormButton } from '@homzhub/common/src/components';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';

interface IVerificationState {
  phone: string;
}

type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.MobileVerification>;

class MobileVerificationScreen extends Component<Props, IVerificationState> {
  public state = {
    phone: '',
  };

  public render(): React.ReactNode {
    const {
      t,
      route: {
        params: { icon, title, subTitle, buttonTitle, message },
      },
    } = this.props;
    const formData = { ...this.state };
    return (
      <View style={styles.container}>
        <Header icon={icon} title={title} subTitle={subTitle} onIconPress={this.handleIconPress} />
        <View style={styles.content}>
          <Text type="small" style={styles.message}>
            {message}
          </Text>
          <Formik onSubmit={this.onSubmit} validate={FormUtils.validate(this.formSchema)} initialValues={formData}>
            {(formProps: FormikProps<FormikValues>): React.ReactElement => (
              <>
                <FormTextInput
                  formProps={formProps}
                  inputType="phone"
                  name="phone"
                  label="Phone"
                  inputPrefixText="+91"
                  placeholder={t('auth:yourNumber')}
                  helpText={t('auth:otpVerification')}
                />
                <FormButton
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  formProps={formProps}
                  type="primary"
                  title={buttonTitle}
                  containerStyle={styles.formButtonStyle}
                />
              </>
            )}
          </Formik>
        </View>
      </View>
    );
  }

  private onSubmit = (): void => {
    // TOD0: Add logic
  };

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private formSchema = (): yup.ObjectSchema<{ phone: string }> => {
    const { t } = this.props;
    return yup.object().shape({
      phone: yup.string().required(t('auth:numberRequired')),
    });
  };
}

export default withTranslation()(MobileVerificationScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  message: {
    color: theme.colors.darkTint3,
    marginBottom: 12,
  },
  formButtonStyle: {
    flex: 0,
    marginVertical: 30,
  },
});