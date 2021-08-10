import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FormikProps } from 'formik';
import { FontWeightType, TextFieldType, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { WithFieldError } from '@homzhub/common/src/components/molecules/WithFieldError';

interface ITransactionProp {
  label: string;
  name: string;
  options: IDropdownOption[];
  formProps: FormikProps<any>;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
  textType?: TextFieldType;
  textSize?: TextSizeType;
  fontType?: FontWeightType;
  rightNode?: React.ReactElement;
}
// TODO: (Lakshit) - Add Dropdown for bank account selection
export const TransactionField = (props: ITransactionProp): React.ReactElement => {
  const { label, textType, textSize = 'regular', fontType, rightNode } = props;
  return (
    <WithFieldError>
      <View style={styles.rowView}>
        <Typography size={textSize} fontWeight={fontType} variant={textType}>
          {label}
        </Typography>
        {rightNode}
      </View>
    </WithFieldError>
  );
};

const styles = StyleSheet.create({
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
