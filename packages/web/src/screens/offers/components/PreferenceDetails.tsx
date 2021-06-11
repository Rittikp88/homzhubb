import React, { FC } from 'react';
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import TextWithIcon from '@homzhub/common/src/components/atoms/TextWithIcon';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { LeaseTerm } from '@homzhub/common/src/domain/models/LeaseTerm';
import { SaleTerm } from '@homzhub/common/src/domain/models/SaleTerm';
import { TenantPreference } from '@homzhub/common/src/domain/models/TenantInfo';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  isCardExpanded?: boolean;
  property: Asset;
  onViewOffer?: () => void;
  isDetailView?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
  colunm?: number;
}

interface IExpectation {
  title: string;
  value: string | number | TenantPreference[] | null;
}

const leaseListingExpectationData = (
  listingData: LeaseTerm | null,
  currencySymbol: string,
  t: TFunction
): IExpectation[] | null => {
  if (!listingData) {
    return null;
  }

  const {
    expectedPrice,
    securityDeposit,
    annualRentIncrementPercentage,
    availableFromDate,
    minimumLeasePeriod,
    maximumLeasePeriod,
    tenantPreferences,
  } = listingData;

  return [
    {
      title: t('offers:rentalPrice'),
      value: `${currencySymbol} ${expectedPrice}`,
    },
    {
      title: t('offers:proposedSecurityDeposit'),
      value: `${currencySymbol} ${securityDeposit}`,
    },
    {
      title: t('property:annualIncrementSuffix'),
      value: annualRentIncrementPercentage ? `${annualRentIncrementPercentage}%` : 'NA',
    },
    {
      title: t('property:moveInDate'),
      value: DateUtils.getDisplayDate(availableFromDate, DateFormats.D_MMM_YYYY),
    },
    {
      title: t('property:minimumLeasePeriod'),
      value: `${minimumLeasePeriod} ${t('common:months')}`,
    },
    {
      title: t('property:maximumLeasePeriod'),
      value: `${maximumLeasePeriod} ${t('common:months')}`,
    },
    {
      title: t('moreSettings:preferencesText'),
      value: tenantPreferences,
    },
  ];
};

const saleListingExpectationData = (
  listingData: SaleTerm | null,
  currencySymbol: string,
  t: TFunction
): IExpectation[] | null => {
  if (!listingData) {
    return null;
  }

  const { expectedPrice, expectedBookingAmount } = listingData;

  return [
    {
      title: t('offers:sellPrice'),
      value: `${currencySymbol} ${expectedPrice}`,
    },
    {
      title: t('property:bookingAmount'),
      value: `${currencySymbol} ${expectedBookingAmount}`,
    },
  ];
};
const PreferenceDetails: FC<IProps> = (props: IProps) => {
  const {
    property: { isLeaseListing, leaseTerm, saleTerm, currencySymbol, projectName },
    colunm = 2,
  } = props;
  const { t } = useTranslation();
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const isTab = useOnly(deviceBreakpoint.TABLET);

  const expectationData = isLeaseListing
    ? leaseListingExpectationData(leaseTerm, currencySymbol, t)
    : saleListingExpectationData(saleTerm, currencySymbol, t);
  const filteredData = expectationData?.filter((item) => item.value);

  const renderExpectedItem = ({ item, index }: { item: IExpectation; index: number }): React.ReactElement | null => {
    const { title, value } = item;
    if (!value) {
      return null;
    }
    if (title === t('moreSettings:preferencesText')) {
      const preferences = value as TenantPreference[];
      if (!preferences.length) return null;
      return (
        <View>
          <Label textType="regular" type="small" style={styles.tintColor}>
            {title}
          </Label>
          <View style={styles.preferenceView}>
            {!!preferences.length &&
              preferences.map((preference, valueIndex) => {
                return (
                  <TextWithIcon
                    key={valueIndex}
                    icon={icons.check}
                    text={preference.name}
                    variant="label"
                    textSize="large"
                    iconColor={theme.colors.green}
                    containerStyle={styles.preferenceContent}
                  />
                );
              })}
          </View>
        </View>
      );
    }
    return (
      <View key={index} style={styles.expectedItem}>
        <Label textType="regular" type="small" style={styles.tintColor}>
          {title}
        </Label>
        <Label textType="semiBold" type="large" style={styles.tintColor}>
          {value}
        </Label>
      </View>
    );
  };

  const renderKeyExtractor = (item: IExpectation, index: number): string => `${item.title}-${index}`;

  const renderItemSeparator = (): React.ReactElement => <View style={styles.separator} />;

  return (
    <>
      <View style={[styles.container, isMobile && styles.containerMobile, isTab && styles.containerTab]}>
        <Label textType="semiBold" type="large" style={[styles.expectationHeading, styles.tintColor]}>
          {`${t('offers:yourExpectationFor')} ${projectName}`}
        </Label>
        {filteredData && (
          <FlatList
            data={filteredData}
            renderItem={renderExpectedItem}
            keyExtractor={renderKeyExtractor}
            numColumns={colunm}
            ItemSeparatorComponent={renderItemSeparator}
          />
        )}
      </View>
    </>
  );
};

export default PreferenceDetails;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    width: 540,
  },
  containerMobile: {
    width: '100%',
    marginHorizontal: 0,
    top: 16,
  },
  containerTab: {
    width: '100%',
    paddingBottom: 16,
  },
  button: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: theme.colors.reminderBackground,
  },
  innerContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    height: '210px',
  },
  expectationHeading: {
    marginBottom: 20,
  },
  offerText: {
    color: theme.colors.blue,
    marginLeft: 6,
  },
  tintColor: {
    color: theme.colors.darkTint3,
  },
  preferenceContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  offerCount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 16,
    borderColor: theme.colors.darkTint10,
  },

  separator: {
    width: 60,
    height: 24,
  },
  viewOfferButton: {
    marginTop: 24,
  },
  expectedItem: {
    flex: 2,
  },
  countWithIcon: {
    marginBottom: 15,
  },
  preferenceView: {
    flexDirection: 'row',
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  preferenceContent: {
    flexDirection: 'row-reverse',
    marginEnd: 14,
  },
});
