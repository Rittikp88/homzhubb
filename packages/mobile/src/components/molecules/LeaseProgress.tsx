import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, Label } from '@homzhub/common/src/components';
import Icon, { icons } from '@homzhub/common/src/assets/icon';

interface IProgressBarProps {
  progress: number;
  width?: number;
  filledColor?: string;
}

const LeaseProgress = (props: IProgressBarProps): React.ReactElement => {
  const { progress, width, filledColor = theme.colors.highPriority } = props;
  return (
    <>
      <View style={styles.leaseHeading}>
        <Icon name={icons.calendar} color={theme.colors.darkTint3} size={18} style={styles.calendarIcon} />
        <Label type="large">Lease Period</Label>
      </View>
      <Progress.Bar
        progress={progress / 100}
        width={width}
        color={filledColor}
        style={styles.barStyle}
        unfilledColor={theme.colors.background}
        borderRadius={5}
      />
      <View style={styles.container}>
        <Label type="regular" style={styles.date}>
          02/01/2020
        </Label>
        <Label type="regular" style={styles.date}>
          02/01/2020
        </Label>
      </View>
      <Button type="primary" containerStyle={styles.buttonStyle} title="RENEW" titleStyle={styles.buttonTitle} />
    </>
  );
};

export { LeaseProgress };

const styles = StyleSheet.create({
  leaseHeading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginRight: 8,
  },
  barStyle: {
    borderColor: theme.colors.background,
    marginTop: 8,
    marginLeft: 26,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginLeft: 28,
  },
  date: {
    color: theme.colors.darkTint6,
    marginTop: 6,
  },
  buttonStyle: {
    flex: 0,
    backgroundColor: theme.colors.error,
    alignSelf: 'flex-end',
    borderRadius: 2,
    marginTop: 12,
  },
  buttonTitle: {
    marginVertical: 1,
    marginHorizontal: 18,
  },
});
