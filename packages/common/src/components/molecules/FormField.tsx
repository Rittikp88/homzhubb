import React, { PureComponent } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { FormikErrors, FormikProps, FormikValues } from 'formik';

export interface IFormFieldProps {
  label: string;
  name: string;
  children: string | React.ReactNode;
  formProps: FormikProps<FormikValues>;
  helpText?: string;
  alignHelpTextWithLabel?: boolean;
  isOptional?: boolean;
  hideLabel?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  labelTextType?: 'normal' | 'medium' | 'bold';
}

export class FormField extends PureComponent<IFormFieldProps> {
  public render(): React.ReactNode {
    const { children, label, isOptional = false, containerStyle = {}, helpText = '' } = this.props;

    let { labelStyle = {} } = this.props;

    const optionalText: string | null = isOptional ? '(optional)' : null;
    const error = this.getFieldError();
    if (error) {
      labelStyle = { color: theme.colors.error };
    }

    return (
      <View style={[styles.container, containerStyle]}>
        <Label type="regular" style={[theme.form.formLabel, labelStyle]}>
          {label}
          <Label type="small" style={styles.optionalText}>
            {optionalText}
          </Label>
        </Label>
        {children}
        <Label type="small" style={styles.helpText}>
          {helpText}
        </Label>
      </View>
    );
  }

  private getFieldError = (): string | FormikErrors<any> | void => {
    const { formProps, name } = this.props;
    if (formProps) {
      const { errors, touched } = formProps;
      return touched[name] && errors[name] ? errors[name] : undefined;
    }
    return undefined;
  };
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  optionalText: {
    color: theme.colors.darkTint3,
  },
  helpText: {
    color: theme.colors.darkTint4,
    marginBottom: 12,
  },
});
