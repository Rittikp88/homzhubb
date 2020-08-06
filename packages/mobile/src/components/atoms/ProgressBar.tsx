import React from 'react';
import { StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { theme } from '@homzhub/common/src/styles/theme';

interface IProgressBarProps {
  progress: number;
  width?: number;
  filledColor?: string;
}

const ProgressBar = (props: IProgressBarProps): React.ReactElement => {
  const { progress, width, filledColor = theme.colors.green } = props;
  return (
    <Progress.Bar progress={progress} width={width} color={filledColor} style={styles.barStyle} borderRadius={5} />
  );
};

export { ProgressBar };

const styles = StyleSheet.create({
  barStyle: {
    borderColor: theme.colors.disabled,
  },
});
