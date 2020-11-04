import React, { PureComponent } from 'react';
import { Text as RNText, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { FormikProps, FormikValues } from 'formik';
import { theme } from '@homzhub/common/src/styles/theme';
import { FontWeightType, Label, Text, TextFieldType, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
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
  formProps: FormikProps<any>;
  isDisabled?: boolean;
  isMandatory?: boolean;
  onBlur?: () => void;
  onChange?: (value: string, props?: FormikProps<FormikValues>) => void;
  onError?: () => void;
  dropdownContainerStyle?: StyleProp<ViewStyle>;
  maxLabelLength?: number;
  numColumns?: number;
  textType?: TextFieldType;
  textSize?: TextSizeType;
  fontType?: FontWeightType;
}

export class FormDropdown extends PureComponent<IFormDropdownProps> {
  public render(): React.ReactNode {
    const {
      name,
      options,
      isDisabled = false,
      formProps,
      placeholder,
      onChange,
      label,
      listTitle,
      listHeight,
      dropdownContainerStyle = {},
      maxLabelLength,
      isMandatory = false,
      numColumns = 1,
      textType = 'label',
      textSize = 'regular',
      fontType = 'regular',
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

    let TextField = Text;

    if (textType === 'label') {
      TextField = Label;
    }

    return (
      <WithFieldError error={error}>
        <TextField type={textSize} textType={fontType} style={labelStyles}>
          {label}
          {isMandatory && <RNText style={styles.asterix}> *</RNText>}
        </TextField>
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
          maxLabelLength={maxLabelLength}
          numColumns={numColumns}
        />
      </WithFieldError>
    );
  }
}

const styles = StyleSheet.create({
  asterix: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
