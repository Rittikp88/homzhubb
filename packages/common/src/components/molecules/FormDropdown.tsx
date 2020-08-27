import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import React, { PureComponent } from 'react';
import { FormikProps, FormikValues } from 'formik';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { WithFieldError } from '@homzhub/common/src/components/molecules/WithFieldError';

export interface IDropdownOption {
  value: any;
  label: string;
}

export interface IFormDropdownProps {
  name: string;
  options: IDropdownOption[];
  placeholder?: string;
  label?: string;
  listTitle?: string;
  listHeight?: number;
  formProps: FormikProps<FormikValues>;
  isDisabled?: boolean;
  onBlur?: () => void;
  onChange?: (value: string, props?: FormikProps<FormikValues>) => void;
  onError?: () => void;
  optionalText?: string;
  dropdownContainerStyle?: StyleProp<ViewStyle>;
}

export class FormDropdown extends PureComponent<IFormDropdownProps, any> {
  public render(): React.ReactNode {
    const {
      name,
      options,
      isDisabled = false,
      formProps,
      placeholder,
      onChange,
      optionalText,
      label,
      listTitle,
      listHeight,
      dropdownContainerStyle = {},
    } = this.props;
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
          listTitle={listTitle}
          listHeight={listHeight}
          value={values[name]}
          onDonePress={onSelect}
          disable={isDisabled}
          placeholder={placeholder}
          iconSize={16}
          iconColor={theme.colors.darkTint7}
          containerStyle={dropdownContainerStyle}
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
