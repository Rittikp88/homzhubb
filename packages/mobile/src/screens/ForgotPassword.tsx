import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton, FormTextInput, Header, Label, Text } from '@homzhub/common/src/components';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';

interface IForgotPasswordState {
  email: string;
}

type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.ForgotPassword>;

class ForgotPassword extends Component<Props, IForgotPasswordState> {
  public state = {
    email: '',
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const formData = { ...this.state };
    return (
      <View style={styles.container}>
        <Header
          icon="left-arrow"
          title={t('auth:forgotPassword')}
          subTitle={t('auth:forgotPasswordDescription')}
          onIconPress={this.handleIconPress}
          headerContainerStyle={styles.headerContainer}
        />
        <View style={styles.content}>
          <Formik onSubmit={this.onSubmit} validate={FormUtils.validate(this.formSchema)} initialValues={formData}>
            {(formProps: FormikProps<FormikValues>): React.ReactElement => (
              <>
                <FormTextInput
                  formProps={formProps}
                  inputType="email"
                  name="email"
                  label="Email"
                  placeholder={t('auth:enterEmail')}
                />
                <FormButton
                  formProps={formProps}
                  type="primary"
                  title={t('auth:forgotPasswordRequestLink')}
                  onPress={formProps.handleSubmit}
                  containerStyle={styles.formButtonStyle}
                />
              </>
            )}
          </Formik>
          <Text type="small" textType="semiBold" style={styles.backToLoginLink} onPress={this.navigateToLogin}>
            {t('auth:backToLogin')}
          </Text>
          {/* TODO: Remove the use of Reset Password from here */}
          <Label type="large" textType="bold" style={styles.backToLoginLink} onPress={this.navigateToResetPassword}>
            Reset Password
          </Label>
        </View>
      </View>
    );
  }

  private onSubmit = (): void => {
    // TODO: Add the login on submit of Form
    AlertHelper.success({ message: 'Some message title' });
  };

  public navigateToLogin = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.EmailLogin);
  };

  public navigateToResetPassword = (): void => {
    const { navigation } = this.props;
    // TODO: Remove this navigation from here once the actual implementation is done
    navigation.navigate(ScreensKeys.ResetPassword);
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private formSchema = (): yup.ObjectSchema<{ email: string }> => {
    const { t } = this.props;
    return yup.object().shape({
      email: yup.string().required(t('auth:emailRequired')),
    });
  };
}

export default withTranslation()(ForgotPassword);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerContainer: {
    borderBottomWidth: 0,
  },
  formButtonStyle: {
    flex: 0,
    marginVertical: 30,
  },
  backToLoginLink: {
    color: theme.colors.blue,
    alignSelf: 'center',
  },
});
