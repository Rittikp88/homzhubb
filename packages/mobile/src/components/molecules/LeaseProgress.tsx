import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Progress from 'react-native-progress';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, Label } from '@homzhub/common/src/components';

interface IProgressBarProps {
  progress: number;
  width?: number;
  filledColor?: string;
  isPropertyCompleted: boolean;
}

const LeaseProgress = (props: IProgressBarProps): React.ReactElement => {
  const { progress, width, filledColor = theme.colors.highPriority, isPropertyCompleted } = props;
  return (
    <>
      <View style={styles.leaseHeading}>
        <Icon
          name={isPropertyCompleted ? icons.calendar : icons.house}
          color={theme.colors.darkTint3}
          size={20}
          style={styles.calendarIcon}
        />
        <Label type="large">{isPropertyCompleted ? 'Lease Period' : 'Listing Score'}</Label>
      </View>
      <Progress.Bar
        progress={progress / 100}
        width={width}
        color={isPropertyCompleted ? filledColor : theme.colors.green}
        style={styles.barStyle}
        unfilledColor={theme.colors.background}
        borderRadius={5}
      />
      {isPropertyCompleted ? (
        <View style={styles.container}>
          <Label type="regular" style={styles.date}>
            02/01/2020
          </Label>
          <Label type="regular" style={styles.date}>
            02/01/2020
          </Label>
        </View>
      ) : (
        <Label type="regular" style={styles.helperMsg}>
          Add Property highlights for +10%
        </Label>
      )}
      <Button
        type="primary"
        textType="label"
        textSize="regular"
        fontType="semiBold"
        containerStyle={styles.buttonStyle}
        title={isPropertyCompleted ? 'RENEW' : 'COMPLETE'}
        titleStyle={styles.buttonTitle}
      />
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
  helperMsg: {
    color: theme.colors.darkTint6,
    marginTop: 6,
    marginLeft: 28,
  },
  buttonStyle: {
    flex: 0,
    backgroundColor: theme.colors.green,
    alignSelf: 'flex-end',
    borderRadius: 2,
    marginTop: 12,
  },
  buttonTitle: {
    marginVertical: 1,
    marginHorizontal: 18,
  },
});
