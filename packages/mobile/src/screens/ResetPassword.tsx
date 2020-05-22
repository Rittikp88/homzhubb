import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton, FormTextInput, Header, Label } from '@homzhub/common/src/components';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';

type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.ResetPassword>;

interface IResetPasswordState {
  password: string;
}

class ResetPassword extends Component<Props, IResetPasswordState> {
  public state = {
    password: '',
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const formData = { ...this.state };
    return (
      <View style={styles.container}>
        <Header
          icon="close"
          subTitle={t('auth:resetPassword')}
          subTitleType="large"
          subTitleColor={theme.colors.dark}
          onIconPress={this.handleIconPress}
          headerContainerStyle={styles.headerContainer}
        />
        <View style={styles.content}>
          <Formik onSubmit={this.onSubmit} validate={FormUtils.validate(this.formSchema)} initialValues={formData}>
            {(formProps: FormikProps<FormikValues>): React.ReactElement => (
              <>
                <FormTextInput
                  formProps={formProps}
                  inputType="password"
                  name="password"
                  label="Password"
                  helpText={t('auth:passwordValidation')}
                  placeholder={t('auth:enterPassword')}
                />
                <FormButton
                  formProps={formProps}
                  type="primary"
                  title={t('auth:resetPasswordButtonTitle')}
                  onPress={formProps.handleSubmit}
                  containerStyle={styles.formButtonStyle}
                />
              </>
            )}
          </Formik>
          {/* TODO: Remove the use of Success Password Reset Label from here */}
          <Label
            type="large"
            textType="bold"
            style={styles.successResetPasswordLink}
            onPress={this.navigateToSuccessResetPassword}
          >
            Success Password Reset
          </Label>
        </View>
      </View>
    );
  }

  private onSubmit = (): void => {
    // TODO: Add the login on submit of Form
    AlertHelper.success({ message: 'Some message title' });
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.EmailLogin);
  };

  public navigateToSuccessResetPassword = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.SuccessResetPassword);
  };

  private formSchema = (): yup.ObjectSchema<{ password: string }> => {
    const { t } = this.props;
    return yup.object().shape({
      password: yup.string().required(t('auth:emailRequired')),
    });
  };
}

export default withTranslation()(ResetPassword);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    paddingHorizontal: 24,
  },
  headerContainer: {
    borderBottomWidth: 0,
  },
  formButtonStyle: {
    flex: 0,
    marginVertical: 30,
  },
  successResetPasswordLink: {
    color: theme.colors.blue,
    alignSelf: 'center',
  },
});
