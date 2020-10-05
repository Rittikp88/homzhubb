import React from 'react';
import { StyleSheet } from 'react-native';
import { FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormCalendar, FormTextInput, Slider, Text } from '@homzhub/common/src/components';
import { ButtonGroup } from '@homzhub/mobile/src/components/molecules/ButtonGroup';
import { MaintenanceDetails } from '@homzhub/mobile/src/components/molecules/MaintenanceDetails';
import { AssetListingSection } from '@homzhub/mobile/src/components/HOC/AssetListingSection';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { LeaseFormKeys, PaidByTypes, ScheduleTypes } from '@homzhub/common/src/domain/models/LeaseTerms';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

export interface IFormData {
  showMore: boolean;
  monthlyRent: string;
  securityDeposit: string;
  annualIncrement: string;
  availableFrom: string;
  maintenanceAmount: string;
  minimumLeasePeriod: number;
  maintenanceSchedule: ScheduleTypes;
  maintenanceBy: PaidByTypes;
  utilityBy: PaidByTypes;
  rentFreePeriod: number;
}

interface IProps {
  formProps: FormikProps<IFormData>;
  currencyData: Currency;
  currentAssetType: string;
}

const MINIMUM_LEASE_PERIOD = 1;
const DEFAULT_LEASE_PERIOD = 11;
const MAXIMUM_LEASE_PERIOD = 24;

const LeaseTermForm = ({ formProps, currencyData, currentAssetType }: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);
  const { setFieldValue, setFieldTouched, values } = formProps;

  // CONSTANTS
  const PAID_BY_OPTIONS = [
    { title: t('owner'), value: PaidByTypes.OWNER },
    { title: t('tenant'), value: PaidByTypes.TENANT },
  ];
  const maxDayCount = currentAssetType === 'COM' ? 180 : 60;
  // CONSTANTS END

  // INTERACTION HANDLERS
  const onShowMorePress = (): void => {
    setFieldValue(LeaseFormKeys.showMore, !values.showMore);
    if (!values.showMore) {
      setFieldTouched(LeaseFormKeys.annualIncrement, false);
    }
  };

  const onSliderChange = (value: number): void => {
    setFieldValue(LeaseFormKeys.minimumLeasePeriod, Math.round(value));
  };

  const onUtilityChanged = (value: string): void => {
    setFieldValue(LeaseFormKeys.utilityBy, value);
  };

  const onMaintenanceChanged = (value: PaidByTypes): void => {
    setFieldValue(LeaseFormKeys.maintenanceBy, value);
    if (value === PaidByTypes.TENANT) {
      setFieldTouched(LeaseFormKeys.maintenanceAmount, false);
    }
  };
  // INTERACTION HANDLERS END

  return (
    <AssetListingSection title={t('leaseTerms')}>
      <>
        <FormTextInput
          inputType="number"
          name={LeaseFormKeys.monthlyRent}
          label={t('monthlyRent')}
          placeholder={t('monthlyRentPlaceholder')}
          maxLength={formProps.values.monthlyRent.includes('.') ? 13 : 12}
          formProps={formProps}
          inputPrefixText={currencyData.currencySymbol}
          inputGroupSuffixText={currencyData.currencyCode}
        />
        <FormTextInput
          inputType="number"
          name={LeaseFormKeys.securityDeposit}
          label={t('securityDeposit')}
          placeholder={t('securityDepositPlaceholder')}
          maxLength={formProps.values.securityDeposit.includes('.') ? 13 : 12}
          formProps={formProps}
          inputPrefixText={currencyData.currencySymbol}
          inputGroupSuffixText={currencyData.currencyCode}
        />
        <Text type="small" textType="semiBold" style={styles.showMore} onPress={onShowMorePress}>
          {values.showMore ? t('showLess') : t('showMore')}
        </Text>
        {values.showMore && (
          <FormTextInput
            inputType="decimal"
            name={LeaseFormKeys.annualIncrement}
            label={t('annualIncrement')}
            placeholder={t('annualIncrementPlaceholder')}
            maxLength={4}
            formProps={formProps}
            inputGroupSuffixText={t('annualIncrementSuffix')}
          />
        )}
        {currentAssetType === 'COM' && (
          <FormTextInput
            inputType="number"
            name={LeaseFormKeys.rentFreePeriod}
            label={t('rentFreePeriod')}
            placeholder={t('common:enter')}
            maxLength={2}
            formProps={formProps}
            inputGroupSuffixText={t('common:days')}
          />
        )}
        <Text type="small" textType="semiBold" style={styles.headerTitle}>
          {t('duration')}
        </Text>
        <FormCalendar
          formProps={formProps}
          maxDate={DateUtils.getFutureDate(maxDayCount)}
          name="availableFrom"
          textType="label"
          textSize="regular"
        />
        <>
          <Text type="small" textType="semiBold" style={styles.sliderTitle}>
            {t('minimumLeasePeriod')}
          </Text>
          <Slider
            onSliderChange={onSliderChange}
            minSliderRange={MINIMUM_LEASE_PERIOD}
            maxSliderRange={MAXIMUM_LEASE_PERIOD}
            minSliderValue={DEFAULT_LEASE_PERIOD}
            isLabelRequired
            labelText="Months"
          />
          <Text type="small" textType="semiBold" style={styles.headerTitle}>
            {t('utilityBy')}
          </Text>
          <ButtonGroup<PaidByTypes>
            data={PAID_BY_OPTIONS}
            onItemSelect={onUtilityChanged}
            selectedItem={values[LeaseFormKeys.utilityBy]}
            containerStyle={styles.buttonGroup}
          />
          <Text type="small" textType="semiBold" style={styles.headerTitle}>
            {t('maintenanceBy')}
          </Text>
          <ButtonGroup<PaidByTypes>
            data={PAID_BY_OPTIONS}
            onItemSelect={onMaintenanceChanged}
            selectedItem={values.maintenanceBy}
            containerStyle={styles.buttonGroup}
          />
        </>
        {values.maintenanceBy === PaidByTypes.TENANT && (
          <MaintenanceDetails
            formProps={formProps}
            currency={currencyData}
            maintenanceAmountKey={LeaseFormKeys.maintenanceAmount}
            maintenanceScheduleKey={LeaseFormKeys.maintenanceSchedule}
          />
        )}
      </>
    </AssetListingSection>
  );
};

const memoizedComponent = React.memo(LeaseTermForm);
export { memoizedComponent as LeaseTermForm };

const styles = StyleSheet.create({
  headerTitle: {
    marginTop: 25,
    color: theme.colors.darkTint3,
  },
  showMore: {
    marginTop: 8,
    alignSelf: 'flex-end',
    color: theme.colors.active,
  },
  buttonGroup: {
    marginTop: 14,
  },
  sliderTitle: {
    marginTop: 28,
    color: theme.colors.darkTint3,
    marginBottom: 18,
  },
});
