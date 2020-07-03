import React from 'react';
import { StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  text: string;
}

export const TextInputSuffix = (props: IProps): React.ReactElement => {
  const { text } = props;
  return (
    <Label type="large" style={styles.textInputSuffix}>
      {text}
    </Label>
  );
};

const styles = StyleSheet.create({
  textInputSuffix: {
    position: 'absolute',
    right: 16,
    top: 14,
    bottom: 14,
    color: theme.colors.darkTint6,
  },
});
