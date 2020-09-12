import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Progress from 'react-native-progress';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Label } from '@homzhub/common/src/components';

interface IProgressBarProps {
  progress?: number;
  fromDate?: string;
  toDate?: string;
  width?: number;
  iconColor?: string;
  filledColor?: string;
  isPropertyVacant?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const LeaseProgress = (props: IProgressBarProps): React.ReactElement => {
  const {
    progress,
    width,
    filledColor = theme.colors.highPriority,
    isPropertyVacant,
    fromDate,
    toDate,
    iconColor,
    labelStyle = {},
    containerStyle = {},
  } = props;

  const { t } = useTranslation(LocaleConstants.namespacesKey.assetPortfolio);

  return (
    <View style={containerStyle}>
      <View style={styles.leaseHeading}>
        <Icon
          name={isPropertyVacant ? icons.house : icons.calendar}
          color={iconColor || theme.colors.darkTint3}
          size={22}
          style={styles.calendarIcon}
        />
        <Label type="large" style={[styles.label, labelStyle]}>
          {isPropertyVacant ? t('listingScore') : t('leasePeriod')}
        </Label>
      </View>
      <Progress.Bar
        progress={progress}
        width={width}
        color={isPropertyVacant ? theme.colors.green : filledColor}
        style={styles.barStyle}
        unfilledColor={isPropertyVacant ? theme.colors.background : theme.colors.green}
        borderRadius={5}
      />
      {isPropertyVacant ? (
        <Label type="regular" style={styles.helperMsg}>
          {t('addPropertyHighlights')}
        </Label>
      ) : (
        <View style={styles.container}>
          <Label type="regular" style={styles.date}>
            {fromDate}
          </Label>
          <Label type="regular" style={styles.date}>
            {toDate}
          </Label>
        </View>
      )}
    </View>
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
  label: {
    color: theme.colors.darkTint3,
  },
});
