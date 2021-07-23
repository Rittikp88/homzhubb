import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import DisplayDate from '@homzhub/common/src/components/atoms/DisplayDate';
import { FlagHOC, flagName } from '@homzhub/common/src/components/atoms/Flag';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Reminder } from '@homzhub/common/src/domain/models/Reminder';

interface IProps {
  reminder: Reminder;
}

const ReminderCard = (props: IProps): React.ReactElement => {
  const {
    reminder: { startDate, title, description, asset },
  } = props;

  const countryFlag = (iso2Code: string): React.ReactElement | null =>
    iso2Code.length > 0 ? FlagHOC(flagName[iso2Code], 12) : null;

  const AddressView = (): React.ReactElement | null => {
    if (!asset) return null;
    return (
      <PropertyAddressCountry
        primaryAddress={asset?.projectName ?? ''}
        countryFlag={countryFlag(asset?.country.iso2Code ?? '')}
        primaryAddressTextStyles={{
          size: 'regular',
          variant: 'label',
          fontWeight: 'regular',
          style: styles.addressText,
        }}
        containerStyle={styles.addressContainer}
      />
    );
  };

  return (
    <View style={styles.container}>
      <DisplayDate date={startDate} containerStyle={styles.dateContainer} />
      <View style={styles.flexOne}>
        <AddressView />
        <Label type="large" textType="bold">
          {title}
        </Label>
        <Label type="large">{description}</Label>
      </View>
    </View>
  );
};

export default React.memo(ReminderCard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexOne: {
    flex: 1,
  },
  addressContainer: {
    marginBottom: 7,
  },
  addressText: {
    color: theme.colors.darkTint4,
  },
});
