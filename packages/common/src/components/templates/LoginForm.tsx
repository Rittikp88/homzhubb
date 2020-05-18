import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik, FormikProps, FormikValues } from 'formik';
import { theme } from '@homzhub/common/src/styles/theme';
import { Logger } from '@homzhub/common/src/utils/Logger';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormField } from '@homzhub/common/src/components/molecules/FormField';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';

interface ILoginFormState {
  email: string;
  password: string;
}

export class LoginForm extends Component<{}, ILoginFormState> {
  public state = {
    email: '',
    password: '',
  };

  public render(): React.ReactNode {
    const formData = { ...this.state };

    return (
      <View style={styles.container}>
        <Formik initialValues={formData} onSubmit={this.handleSubmit}>
          {(formProps: FormikProps<FormikValues>): React.ReactElement => (
            <>
              <FormField label="Email" name="email" formProps={formProps}>
                <FormTextInput name="email" inputType="email" placeholder="Enter Your Email" formProps={formProps} />
              </FormField>
              <FormField label="Password" name="password" formProps={formProps}>
                <FormTextInput
                  name="password"
                  inputType="password"
                  placeholder="Enter Your Password"
                  formProps={formProps}
                />
              </FormField>
              <FormField label="Phone" name="phone" helpText="Will send you OTP" formProps={formProps}>
                <FormTextInput
                  name="phone"
                  inputType="phone"
                  inputPrefixText="+91"
                  placeholder="9876543210"
                  formProps={formProps}
                />
              </FormField>
              <FormButton formProps={formProps} type="primary" title="Sign-in" />
            </>
          )}
        </Formik>
      </View>
    );
  }

  public handleSubmit = (): void => {
    Logger.info('on submit');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: theme.layout.screenPadding,
  },
});
