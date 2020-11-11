import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { PropertyAddress } from '@homzhub/common/src/components/molecules/PropertyAddress';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { VisitSlot } from '@homzhub/common/src/mocks/BookVisit';

interface IProps {
  primaryAddress: string;
  subAddress: string;
  startDate: string;
  endDate: string;
  comments?: string;
  isMissedVisit?: boolean;
  isCompletedVisit?: boolean;
  isRescheduleAll?: boolean;
  isFromProperty?: boolean;
  onPressSchedule?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const AddressWithVisitDetail = (props: IProps): React.ReactElement => {
  const {
    subAddress,
    primaryAddress,
    startDate,
    comments,
    isMissedVisit,
    isCompletedVisit,
    containerStyle = {},
    onPressSchedule,
    isRescheduleAll = false,
    isFromProperty = false,
  } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const dateTime = DateUtils.convertTimeFormat(startDate, 'YYYY-MM-DD HH');
  const time = VisitSlot.find((item) => item.from === Number(dateTime[1]));
  const textStyle = [styles.textColor, isMissedVisit && styles.missedColor];
  return (
    <View style={containerStyle}>
      {isFromProperty ? (
        <>
          {!!comments && (
            <Text type="small" textType="semiBold" style={styles.addressContainer}>
              {comments}
            </Text>
          )}
        </>
      ) : (
        <PropertyAddress
          primaryTextType="small"
          subAddress={subAddress}
          primaryAddress={primaryAddress}
          subAddressStyle={styles.subAddress}
          containerStyle={styles.addressContainer}
        />
      )}
      <Label type="regular" style={[styles.textColor, !comments && styles.detail]}>
        {t('visitDetails')}
      </Label>
      <View style={styles.detailContainer}>
        <View style={styles.content}>
          <Text type="small" textType="semiBold" style={textStyle}>
            {DateUtils.getDisplayDate(dateTime[0], 'DD MMM')}
          </Text>
          <Icon
            name={icons.roundFilled}
            color={isMissedVisit ? theme.colors.error : theme.colors.darkTint3}
            size={8}
            style={styles.iconStyle}
          />
          <Text type="small" textType="semiBold" style={textStyle}>
            {time?.formatted}
          </Text>
        </View>
        <TouchableOpacity style={styles.content} onPress={onPressSchedule}>
          <Icon name={icons.schedule} color={theme.colors.blue} size={20} />
          <Text type="small" style={styles.scheduleText}>
            {isCompletedVisit ? t('newVisit') : isRescheduleAll ? t('rescheduleAll') : t('reschedule')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subAddress: {
    marginLeft: 0,
  },
  addressContainer: {
    marginVertical: 12,
  },
  textColor: {
    color: theme.colors.darkTint3,
  },
  detail: {
    marginTop: 12,
  },
  missedColor: {
    color: theme.colors.error,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginTop: 6,
    marginHorizontal: 6,
  },
  scheduleText: {
    color: theme.colors.blue,
    marginStart: 6,
  },
});
