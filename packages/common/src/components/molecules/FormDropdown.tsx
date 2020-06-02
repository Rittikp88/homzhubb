import { StyleSheet } from 'react-native';
import React, { PureComponent } from 'react';
import { FormikProps, FormikValues } from 'formik';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Dropdown, WithFieldError } from '@homzhub/common/src/components';

export interface IDropdownOption {
  value: any;
  label: string;
}

export interface IFormDropdownProps {
  name: string;
  placeholder?: string;
  label?: string;
  options?: IDropdownOption[];
  formProps: FormikProps<FormikValues>;
  isDisabled?: boolean;
  onBlur?: () => void;
  onChange?: (value: string, props?: FormikProps<FormikValues>) => void;
  onError?: () => void;
  optionalText?: string;
}

export class FormDropdown extends PureComponent<IFormDropdownProps, any> {
  public render(): React.ReactNode {
    const { name, options, isDisabled = false, formProps, placeholder, onChange, optionalText, label } = this.props;
    const { values, errors, touched, setFieldValue, setFieldTouched } = formProps;

    let labelStyles = { ...theme.form.formLabel };

    const onSelect = (value: any): void => {
      if (isDisabled) {
        return;
      }
      setFieldValue(name, value);
      setFieldTouched(name);

      if (onChange) {
        onChange(value, formProps);
      }
    };

    const containerStyles = [theme.form.dropdownContainer, isDisabled ? theme.form.inputDisabled : {}];

    const error = touched[name] && errors[name] ? errors[name] : undefined;
    if (error) {
      labelStyles = { ...labelStyles, color: theme.colors.error };
    }

    return (
      <WithFieldError error={error}>
        <Label type="regular" style={labelStyles}>
          {label}
          <Label type="small" style={styles.optionalText}>
            {optionalText}
          </Label>
        </Label>
        <Dropdown
          // @ts-ignore
          data={options}
          value={values[name]}
          onDonePress={onSelect}
          disable={isDisabled}
          placeholder={placeholder}
          containerStyle={containerStyles}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
        />
      </WithFieldError>
    );
  }
}

const styles = StyleSheet.create({
  optionalText: {
    color: theme.colors.darkTint3,
  },
});
