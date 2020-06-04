import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { UserService } from '@homzhub/common/src/services/UserService';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { FormButton, FormTextInput, DetailedHeader } from '@homzhub/common/src/components';
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
        <DetailedHeader
          icon={icons.close}
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
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  containerStyle={styles.formButtonStyle}
                />
              </>
            )}
          </Formik>
        </View>
      </View>
    );
  }

  private onSubmit = (formProps: IResetPasswordState): void => {
    const { password } = formProps;
    const {
      navigation,
      route: {
        params: { token },
      },
    } = this.props;
    const payload = {
      action: 'SET_PASSWORD',
      payload: {
        token,
        password,
      },
    };
    UserService.resetPassword(payload)
      .then(() => {
        navigation.navigate(ScreensKeys.SuccessResetPassword);
        return null;
      })
      .catch((err) => {
        AlertHelper.error({ message: err });
      });
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.EmailLogin);
  };

  private formSchema = (): yup.ObjectSchema<{ password: string }> => {
    const { t } = this.props;
    return yup.object().shape({
      password: yup
        .string()
        .matches(FormUtils.passwordRegex, t('auth:passwordValidation'))
        .min(8, t('auth:minimumCharacters'))
        .required(t('auth:passwordRequired')),
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
});
