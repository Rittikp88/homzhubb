import React, { PureComponent } from 'react';
import {
  StyleSheet,
  StyleProp,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
  Image,
  TextInput as RNTextInput,
} from 'react-native';
import { FormikErrors, FormikProps } from 'formik';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { DisallowedInputCharacters } from '@homzhub/common/src/utils/FormUtils';
import { CommonService } from '@homzhub/common/src/services/CommonService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { images } from '@homzhub/common/src/assets/images';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { TextInputSuffix } from '@homzhub/common/src/components/atoms/TextInputSuffix';
import { WithFieldError } from '@homzhub/common/src/components/molecules/WithFieldError';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { BottomSheetListView } from '@homzhub/mobile/src/components';

type SupportedInputType = 'email' | 'password' | 'number' | 'phone' | 'default' | 'name' | 'decimal';

export interface IFormTextInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  formProps: FormikProps<any>;
  inputType: SupportedInputType;
  labelTextType?: TextSizeType;
  name: string;
  label: string;
  helpText?: string;
  hideError?: boolean;
  isOptional?: boolean;
  inputPrefixText?: string;
  inputGroupPrefix?: React.ReactNode;
  inputGroupSuffix?: React.ReactNode;
  inputGroupSuffixText?: string;
  hidePasswordRevealer?: boolean;
  disallowedCharacters?: RegExp;
  onValueChange?: (text: string) => void;
  isTouched?: boolean;
  editable?: boolean;
  onIconPress?: () => void;
  onPhoneCodeChange?: (value: string) => void;
  phoneFieldDropdownText?: string;
}

interface IFormTextInputState {
  showCurrencySymbol: boolean;
  showPassword: boolean;
  isFocused: boolean;
  isBottomSheetVisible: boolean;
  countryCodeData: IDropdownOption[];
}

export class FormTextInput extends PureComponent<IFormTextInputProps, IFormTextInputState> {
  public inputText: RNTextInput | null = null;

  public state = {
    showCurrencySymbol: false,
    showPassword: false,
    isFocused: false,
    isBottomSheetVisible: false,
    countryCodeData: [],
  };

  public render(): React.ReactNode {
    const {
      name,
      label,
      placeholder,
      formProps,
      style = {},
      inputType,
      hidePasswordRevealer,
      inputPrefixText = '',
      inputGroupSuffixText = '',
      children,
      hideError,
      containerStyle = {},
      isOptional,
      helpText,
      isTouched = true,
      editable = true,
      maxLength = 40,
      onIconPress,
      phoneFieldDropdownText = '',
      ...rest
    } = this.props;
    let { inputGroupSuffix, inputGroupPrefix } = this.props;
    const { values, setFieldTouched } = formProps;
    const { showPassword, isFocused, showCurrencySymbol, countryCodeData, isBottomSheetVisible } = this.state;
    const optionalText: string | null = isOptional ? 'Optional' : null;

    // @ts-ignore
    const inputFieldStyles = { ...theme.form.input, ...style };
    let labelStyles = { ...theme.form.formLabel };

    let inputProps = {
      value: values[name],
      placeholder,
      placeholderTextColor: theme.form.placeholderColor,
      style: inputFieldStyles,
      autoCorrect: false,
      editable,
      maxLength,
      onChangeText: this.handleTextChange,
      onBlur: (): void => {
        setFieldTouched(name, isTouched);
        this.handleBlur();
      },
      onFocus: (): void => {
        this.handleFocus();
      },
      ...rest,
    };

    switch (inputType) {
      case 'email':
        inputProps = { ...inputProps, ...{ keyboardType: 'email-address', autoCapitalize: 'none' } };
        break;
      case 'number':
        inputProps = { ...inputProps, ...{ keyboardType: 'number-pad' } };
        if (inputPrefixText.length > 0 && showCurrencySymbol) {
          inputGroupPrefix = (
            <View style={styles.currencyPrefix}>
              <Label type="regular" style={styles.currencyPrefixText}>
                {inputPrefixText}
              </Label>
            </View>
          );

          const prefixFieldStyles = {
            ...inputProps.style,
            ...{ paddingStart: 38 },
          };

          inputProps = {
            ...inputProps,
            style: prefixFieldStyles,
          };
        }
        break;
      case 'decimal':
        inputProps = { ...inputProps, ...{ keyboardType: 'numeric' } };
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
            icon={showPassword ? icons.eyeOpen : icons.eyeClosed}
            iconColor={showPassword ? theme.colors.primaryColor : theme.colors.disabled}
            iconSize={20}
            iconStyle={styles.passwordIcon}
          />
        ) : undefined;
        break;
      }
      // TODO: (Shikha:18/05/20)- once backend is ready, refactor flag image part according data
      case 'phone':
        inputProps = { ...inputProps, ...{ keyboardType: 'number-pad' } };
        if (inputPrefixText.length > 0) {
          inputGroupPrefix = (
            <View style={styles.inputGroupPrefix}>
              <Image source={images.flag} height={12} width={18} style={styles.flagStyle} />
              <Label type="regular" style={styles.inputPrefixText}>
                {inputPrefixText}
              </Label>
              <Icon
                name={icons.downArrowFilled}
                color={theme.colors.darkTint7}
                size={12}
                style={styles.iconStyle}
                onPress={onIconPress || this.loadCountryCode}
              />
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
      labelStyles = { ...labelStyles, color: theme.colors.error };
    }
    if (isFocused) {
      inputProps.style = { ...inputProps.style, ...theme.form.fieldFocus };
      labelStyles = { ...labelStyles, color: theme.colors.primaryColor };
    }
    if (!editable) {
      inputProps.style = { ...inputProps.style, ...theme.form.fieldDisabled };
    }

    return (
      <>
        <WithFieldError error={error} hideError={hideError}>
          <View style={styles.labelsContainer}>
            <Label type="regular" style={labelStyles}>
              {label}
            </Label>
            <Label type="small" style={styles.optionalText}>
              {optionalText}
            </Label>
          </View>
          <View style={containerStyle}>
            <RNTextInput
              ref={(input): void => {
                this.inputText = input as any;
              }}
              {...inputProps}
            />
            {children}
            {inputGroupPrefix}
            {inputGroupSuffix && <View style={styles.inputGroupSuffix}>{inputGroupSuffix}</View>}
            {!!inputGroupSuffixText && <TextInputSuffix text={inputGroupSuffixText} />}
          </View>
          {helpText && (
            <Label type="small" style={styles.helpText}>
              {helpText}
            </Label>
          )}
        </WithFieldError>
        <BottomSheetListView
          data={countryCodeData}
          selectedValue={inputPrefixText}
          listTitle={phoneFieldDropdownText}
          isBottomSheetVisible={isBottomSheetVisible}
          onCloseDropDown={this.onCloseDropDown}
          onSelectItem={this.handleSelection}
        />
      </>
    );
  }

  private onCloseDropDown = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };

  private loadCountryCode = (): void => {
    const { isBottomSheetVisible } = this.state;
    CommonService.getCountryWithCode()
      .then((res) => {
        this.setState({ countryCodeData: res });
      })
      .catch((e) => {
        AlertHelper.error({ message: e.message });
      });
    this.setState({ isBottomSheetVisible: !isBottomSheetVisible });
  };

  public focus = (): void => {
    this.inputText?.focus();
  };

  private handleTextChange = (text: string): void => {
    const { formProps, inputType, name, onValueChange } = this.props;
    const { setFieldValue } = formProps;
    const regExp = /^\s/;
    let inputValue = text;
    if (inputType === 'phone') {
      inputValue = text.replace(/\D/g, '');
    } else if (inputType === 'number') {
      inputValue = text.replace(/[^0-9.]/g, '');
      if (inputValue.split('.').length > 2) {
        inputValue = inputValue.replace(/\.+$/, '');
      }
      this.setState({ showCurrencySymbol: text.length > 0 });
    } else if (inputType === 'name') {
      inputValue = text.replace(/\d/g, '');
    } else if (inputType === 'email') {
      inputValue = text.replace(DisallowedInputCharacters.email, '');
    }
    /*
    RegExp added to remove trailing white space from the text
     */
    setFieldValue(name, inputValue.replace(regExp, ''));
    if (onValueChange) {
      onValueChange(inputValue);
    }
  };

  private handleFocus = (): void => this.setState({ isFocused: true });

  private handleBlur = (): void => this.setState({ isFocused: false });

  private handleSelection = (value: string): void => {
    const { isBottomSheetVisible } = this.state;
    const { onPhoneCodeChange } = this.props;

    if (onPhoneCodeChange) {
      onPhoneCodeChange(value);
    }

    this.setState({ isBottomSheetVisible: !isBottomSheetVisible });
  };

  private getFieldError = (): FormikErrors<any>[] | string | string[] | FormikErrors<any> | undefined => {
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
    left: 1,
    marginTop: 2,
    right: 5,
    width: 90,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: theme.colors.disabled,
  },
  currencyPrefix: {
    position: 'absolute',
    left: 1,
    marginTop: 5,
    width: 46,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  currencyPrefixText: {
    fontSize: 18,
  },
  inputPrefixText: {
    color: theme.colors.darkTint4,
  },
  inputGroupSuffix: {
    position: 'absolute',
    right: 6,
  },
  passwordButton: {
    flex: 0,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 0,
    backgroundColor: theme.colors.transparent,
  },
  passwordIcon: {
    height: 16,
    width: 20,
    opacity: 0.4,
  },
  helpText: {
    color: theme.colors.darkTint4,
    marginTop: 6,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionalText: {
    ...theme.form.formLabel,
  },
  flagStyle: {
    marginEnd: 6,
  },
  iconStyle: {
    marginStart: 6,
  },
});
