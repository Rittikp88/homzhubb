import React, { FC, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { History } from 'history';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IEmailLoginPayload, ILoginPayload, LoginTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';

interface IFormData {
  email: string;
  password: string;
}

interface IStateProps {
  isLoading: boolean;
}

interface IDispatchProps {
  login: (payload: ILoginPayload) => void;
}

interface IOwnProps {
  history: History;
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

const Login: FC<IProps> = (props: IProps) => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.auth);
  const password = useRef(null);
  const formData = {
    email: 'bishal.patnaik@nineleaps.com',
    password: 'India#123',
  };
  const navigateToHomeScreen = (): void => {
    NavigationUtils.navigate(props.history, { path: RouteNames.protectedRoutes.DASHBOARD });
  };
  const handleSubmit = (values: IFormData, formActions: FormikHelpers<IFormData>): void => {
    // TODO: remove .logoutUser after logout functionality is implemented
    StoreProviderService.logoutUser();

    formActions.setSubmitting(true);

    const emailLoginData: IEmailLoginPayload = {
      action: LoginTypes.EMAIL,
      payload: {
        email: values.email,
        password: values.password,
      },
    };

    const loginPayload: ILoginPayload = {
      data: emailLoginData,
      callback: navigateToHomeScreen,
    };
    props.login(loginPayload);
    formActions.setSubmitting(false);
  };
  return (
    <View style={styles.container}>
      <Formik initialValues={formData} onSubmit={handleSubmit}>
        {(formProps: FormikProps<IFormData>): React.ReactElement => (
          <View>
            <FormTextInput
              name="email"
              label="Email"
              inputType="email"
              placeholder={t('enterEmail')}
              isMandatory
              formProps={formProps}
            />
            <FormTextInput
              ref={password}
              name="password"
              label="Password"
              inputType="password"
              placeholder={t('enterPassword')}
              isMandatory
              formProps={formProps}
            />
            <FormButton
              // @ts-ignore
              onPress={formProps.handleSubmit}
              formProps={formProps}
              type="primary"
              title={t('common:login')}
              containerStyle={styles.submitStyle}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitStyle: {
    flex: 0,
    marginTop: 30,
  },
});

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    isLoading: UserSelector.getLoadingState(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { login } = UserActions;
  return bindActionCreators(
    {
      login,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, {}, IState>(mapStateToProps, mapDispatchToProps)(Login);
