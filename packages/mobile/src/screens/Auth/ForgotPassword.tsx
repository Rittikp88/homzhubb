import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { UserService } from '@homzhub/common/src/services/UserService';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton, FormTextInput, AnimatedHeader, Text } from '@homzhub/common/src/components';
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
        <AnimatedHeader
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
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  containerStyle={styles.formButtonStyle}
                />
              </>
            )}
          </Formik>
          <Text type="small" textType="semiBold" style={styles.backToLoginLink} onPress={this.navigateToLogin}>
            {t('auth:backToLogin')}
          </Text>
        </View>
      </View>
    );
  }

  private onSubmit = (formProps: IForgotPasswordState): void => {
    const { navigation } = this.props;
    const { email } = formProps;
    const payload = {
      action: 'SEND_EMAIL',
      payload: {
        email,
      },
    };
    UserService.resetPassword(payload)
      .then((response) => {
        const { email_exists, token } = response;
        if (email_exists) {
          navigation.navigate(ScreensKeys.ResetPassword, {
            token,
            email,
          });
        } else {
          AlertHelper.error({ message: 'Email does not exists' });
        }
        return null;
      })
      .catch((err) => {
        AlertHelper.error({ message: err });
      });
  };

  public navigateToLogin = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.EmailLogin);
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private formSchema = (): yup.ObjectSchema<{ email: string }> => {
    const { t } = this.props;
    return yup.object().shape({
      email: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
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
