import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components';

interface IProgressBarProps {
  progress: number;
  width?: number;
  filledColor?: string;
}

const ProgressBar = (props: IProgressBarProps): React.ReactElement => {
  const { progress, width, filledColor = theme.colors.green } = props;
  return (
    <>
      <View style={styles.container}>
        <Label type="large" style={styles.progressTitle}>
          Progress
        </Label>
        <Label type="large" style={styles.status}>
          {progress}%
        </Label>
      </View>
      <Progress.Bar
        progress={progress / 100}
        width={width}
        color={filledColor}
        style={styles.barStyle}
        borderRadius={5}
      />
    </>
  );
};

export { ProgressBar };

const styles = StyleSheet.create({
  barStyle: {
    borderColor: theme.colors.disabled,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  status: {
    color: theme.colors.gray2,
    marginTop: 6,
  },
  progressTitle: {
    color: theme.colors.gray3,
    marginTop: 6,
  },
});
