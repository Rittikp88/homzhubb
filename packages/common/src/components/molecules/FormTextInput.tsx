import React, { PureComponent } from 'react';
import {
  StyleSheet,
  StyleProp,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
  TextInput as RNTextInput,
} from 'react-native';
import { FormikErrors, FormikProps, FormikValues } from 'formik';
import { theme } from '@homzhub/common/src/styles/theme';
import { DisallowedInputCharacters } from '@homzhub/common/src/utils/FormUtils';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { WithFieldError } from '@homzhub/common/src/components/molecules/WithFieldError';
import { Label } from '@homzhub/common/src/components/atoms/Text';

type SupportedInputType = 'email' | 'password' | 'number' | 'phone' | 'default';

export interface IFormTextInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  formProps: FormikProps<FormikValues>;
  inputType: SupportedInputType;
  name: string;
  hideError?: boolean;
  inputPrefixText?: string;
  inputGroupPrefix?: React.ReactNode;
  inputGroupSuffix?: React.ReactNode;
  hidePasswordRevealer?: boolean;
  disallowedCharacters?: RegExp;
  onValueChange?: (text: string) => void;
}

interface IFormTextInputState {
  showPassword: boolean;
}

export class FormTextInput extends PureComponent<IFormTextInputProps, IFormTextInputState> {
  public inputText: RNTextInput | null = null;

  public state = {
    showPassword: false,
  };

  public render(): React.ReactNode {
    const {
      name,
      placeholder,
      formProps,
      style = {},
      inputType,
      hidePasswordRevealer,
      inputPrefixText = '',
      children,
      hideError,
      containerStyle = {},
      ...rest
    } = this.props;
    let { inputGroupSuffix, inputGroupPrefix } = this.props;
    const { values } = formProps;
    const { showPassword } = this.state;

    // @ts-ignore
    const inputFieldStyles = { ...theme.form.input, ...style };

    let inputProps = {
      value: values[name],
      placeholder,
      placeholderTextColor: theme.form.placeholderColor,
      style: inputFieldStyles,
      autoCorrect: false,
      onChangeText: this.handleTextChange,
      ...rest,
    };

    switch (inputType) {
      case 'email':
        inputProps = { ...inputProps, ...{ keyboardType: 'email-address' } };
        break;
      case 'number':
        inputProps = { ...inputProps, ...{ keyboardType: 'number-pad' } };
        break;
      case 'password': {
        const passwordFieldStyles = hidePasswordRevealer ? {} : { ...inputProps.style, ...theme.form.inputPassword };
        inputProps = {
          ...inputProps,
          style: passwordFieldStyles,
          secureTextEntry: !showPassword,
        };
        inputGroupSuffix = !hidePasswordRevealer ? (
          <Button
            type="secondary"
            onPress={this.toggleShowPassword}
            containerStyle={styles.passwordButton}
            icon={showPassword ? 'eye-open' : 'eye-close'}
            iconColor={showPassword ? theme.colors.primaryColor : theme.colors.disabled}
            iconSize={20}
            iconStyle={styles.passwordIcon}
          />
        ) : undefined;
        break;
      }
      case 'phone':
        inputProps = { ...inputProps, ...{ keyboardType: 'number-pad' } };
        if (inputPrefixText.length > 0) {
          inputGroupPrefix = (
            <View style={styles.inputGroupPrefix}>
              <Label type="regular" style={styles.inputPrefixText}>
                {inputPrefixText}
              </Label>
            </View>
          );

          const prefixFieldStyles = {
            ...inputProps.style,
            ...theme.form.inputPrefix,
          };

          inputProps = {
            ...inputProps,
            style: prefixFieldStyles,
          };
        }
        break;
      default:
        break;
    }

    const error = this.getFieldError();
    if (error) {
      inputProps.style = { ...inputProps.style, ...theme.form.fieldError };
    }

    return (
      <WithFieldError error={error} hideError={hideError}>
        <View style={[styles.container, containerStyle]}>
          <RNTextInput
            ref={(input): void => {
              this.inputText = input as any;
            }}
            {...inputProps}
          />
          {children}
          {inputGroupPrefix}
          {inputGroupSuffix && <View style={styles.inputGroupSuffix}>{inputGroupSuffix}</View>}
        </View>
      </WithFieldError>
    );
  }

  private handleTextChange = (text: string): void => {
    const { formProps, inputType, name, onValueChange } = this.props;
    const { setFieldValue } = formProps;
    const regExp = /^\s/;
    if (inputType === 'number' || inputType === 'phone') {
      text.replace(/\D/g, '');
    } else if (inputType === 'email') {
      text.replace(DisallowedInputCharacters.email, '');
    }
    /*
    RegExp added to remove trailing white space from the text
     */
    setFieldValue(name, text.replace(regExp, ''));
    if (onValueChange) {
      onValueChange(text);
    }
  };

  private getFieldError = (): string | FormikErrors<any> | undefined => {
    const { name, formProps } = this.props;
    const { errors, touched } = formProps;
    return touched[name] && errors[name] ? errors[name] : undefined;
  };

  private toggleShowPassword = (): void => {
    const { showPassword } = this.state;
    this.setState({
      showPassword: !showPassword,
    });
  };
}

const styles = StyleSheet.create({
  inputGroupPrefix: {
    position: 'absolute',
    left: 0,
    bottom: 6,
    width: 60,
    height: 34,
    paddingBottom: 4,
    justifyContent: 'center',
    paddingStart: 14,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: theme.colors.disabled,
  },
  inputPrefixText: {
    color: theme.colors.dark,
  },
  inputGroupSuffix: {
    position: 'absolute',
    right: 6,
    bottom: 10,
  },
  passwordButton: {
    paddingVertical: 10,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 10,
    borderWidth: 0,
  },
  passwordIcon: {
    height: 16,
    width: 20,
    opacity: 0.4,
  },
  container: {
    marginBottom: 4,
  },
});
