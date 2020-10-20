import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { TimeUtils } from '@homzhub/common/src/utils/TimeUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import Rating from '@homzhub/common/src/components/atoms/Rating';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  fullName: string;
  designation: string;
  phoneNumber?: string;
  rating?: number;
  date?: string;
  isRightIcon?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const Avatar = (props: IProps): React.ReactElement => {
  const { fullName, designation, containerStyle = {}, phoneNumber, rating, date, isRightIcon } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftView}>
        <View style={styles.initialsContainer}>
          <Text type="small" textType="regular" style={styles.initials}>
            {StringUtils.getInitials(fullName)}
          </Text>
        </View>
        <View style={styles.nameContainer}>
          <Label textType="regular" type="large">
            {fullName}
          </Label>
          <View style={styles.container}>
            <Label textType="regular" type="regular" style={styles.designation}>
              {designation}
            </Label>
            {phoneNumber && (
              <View style={styles.numberContainer}>
                <Icon name={icons.roundFilled} color={theme.colors.disabled} size={12} style={styles.iconStyle} />
                <Label textType="regular" type="regular" style={styles.designation}>
                  {phoneNumber}
                </Label>
              </View>
            )}
            {rating && (
              <View style={styles.numberContainer}>
                <Icon name={icons.roundFilled} color={theme.colors.disabled} size={10} style={styles.iconStyle} />
                <Rating count={rating} />
              </View>
            )}
          </View>
        </View>
      </View>
      {(isRightIcon || date) && (
        <View style={styles.rightView}>
          {isRightIcon && <Icon name={icons.rightArrow} color={theme.colors.blue} size={20} style={styles.iconStyle} />}
          {date && (
            <Label textType="regular" type="regular" style={styles.designation}>
              {TimeUtils.getLocaltimeDifference(date)}
            </Label>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftView: {
    flexDirection: 'row',
  },
  rightView: {
    alignItems: 'flex-end',
  },
  initialsContainer: {
    ...(theme.circleCSS(42) as object),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkTint6,
  },
  designation: {
    color: theme.colors.darkTint5,
    marginTop: 2,
  },
  initials: {
    color: theme.colors.white,
  },
  nameContainer: {
    marginHorizontal: 12,
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginTop: 6,
    marginHorizontal: 4,
  },
});

const memoizedComponent = React.memo(Avatar);
export { memoizedComponent as Avatar };
