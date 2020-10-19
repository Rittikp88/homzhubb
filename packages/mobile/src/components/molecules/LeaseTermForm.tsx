import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import * as yup from 'yup';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { FormCalendar, FormTextInput, Slider, Text, TextArea, WithFieldError } from '@homzhub/common/src/components';
import { ButtonGroup } from '@homzhub/mobile/src/components/molecules/ButtonGroup';
import { MaintenanceDetails } from '@homzhub/mobile/src/components/molecules/MaintenanceDetails';
import { AssetListingSection } from '@homzhub/mobile/src/components/HOC/AssetListingSection';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { PaidByTypes, ScheduleTypes } from '@homzhub/common/src/constants/Terms';

export interface IFormData {
  [LeaseFormKeys.showMore]: boolean;
  [LeaseFormKeys.monthlyRent]: string;
  [LeaseFormKeys.securityDeposit]: string;
  [LeaseFormKeys.annualIncrement]: string;
  [LeaseFormKeys.availableFrom]: string;
  [LeaseFormKeys.maintenanceBy]: PaidByTypes;
  [LeaseFormKeys.maintenanceAmount]: string;
  [LeaseFormKeys.maintenanceSchedule]: ScheduleTypes;
  [LeaseFormKeys.maintenanceUnit]: number;
  [LeaseFormKeys.minimumLeasePeriod]: number;
  [LeaseFormKeys.maximumLeasePeriod]: number;
  [LeaseFormKeys.utilityBy]: PaidByTypes;
  [LeaseFormKeys.rentFreePeriod]: string;
  [LeaseFormKeys.description]: string;
}

enum LeaseFormKeys {
  monthlyRent = 'monthlyRent',
  securityDeposit = 'securityDeposit',
  showMore = 'showMore',
  annualIncrement = 'annualIncrement',
  maintenanceAmount = 'maintenanceAmount',
  maintenanceSchedule = 'maintenanceSchedule',
  maintenanceBy = 'maintenanceBy',
  maintenanceUnit = 'maintenanceUnit',
  availableFrom = 'availableFrom',
  utilityBy = 'utilityBy',
  minimumLeasePeriod = 'minimumLeasePeriod',
  maximumLeasePeriod = 'maximumLeasePeriod',
  rentFreePeriod = 'rentFreePeriod',
  description = 'description',
}

interface IProps {
  formProps: any;
  currencyData: Currency;
  assetGroupType: string;
  isFromManage?: boolean;
  isSplitAsUnits?: boolean;
  children?: React.ReactNode;
}

const MINIMUM_LEASE_PERIOD = 1;
const MAXIMUM_LEASE_PERIOD = 24;
const MINIMUM_TOTAL_LEASE_PERIOD = 0;
const MAXIMUM_TOTAL_LEASE_PERIOD = 60;
const DEFAULT_LEASE_PERIOD = 11;
export const initialLeaseFormValues = {
  showMore: false,
  monthlyRent: '',
  securityDeposit: '',
  annualIncrement: '',
  description: '',
  minimumLeasePeriod: DEFAULT_LEASE_PERIOD,
  maximumLeasePeriod: DEFAULT_LEASE_PERIOD,
  availableFrom: DateUtils.getCurrentDate(),
  utilityBy: PaidByTypes.TENANT,
  rentFreePeriod: '',
  maintenanceBy: PaidByTypes.OWNER,
  maintenanceAmount: '',
  maintenanceSchedule: ScheduleTypes.MONTHLY,
  maintenanceUnit: -1,
};
const MAX_DESCRIPTION_LENGTH = 600;

const LeaseTermForm = ({
  formProps,
  currencyData,
  assetGroupType,
  children,
  isSplitAsUnits = false,
  isFromManage = false,
}: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);
  const { setFieldValue, setFieldTouched, values } = formProps;
  const dispatch = useDispatch();
  const maintenanceUnits = useSelector(RecordAssetSelectors.getMaintenanceUnits);

  // CONSTANTS
  const PAID_BY_OPTIONS = [
    { title: t('owner'), value: PaidByTypes.OWNER },
    { title: t('tenant'), value: PaidByTypes.TENANT },
  ];

  let dateLabel;
  let maxDate: string | undefined = DateUtils.getFutureDate(assetGroupType === AssetGroupTypes.COM ? 180 : 60);
  if (isFromManage) {
    maxDate = undefined;
    dateLabel = t('common:startingFrom');
  }
  // CONSTANTS END

  // EFFECT
  useEffect(() => {
    if (maintenanceUnits.length <= 0) {
      dispatch(RecordAssetActions.getMaintenanceUnits());
    }
  }, []);

  // INTERACTION HANDLERS
  const onShowMorePress = useCallback((): void => {
    setFieldValue(LeaseFormKeys.showMore, !values.showMore);
    if (!values.showMore) {
      setFieldTouched(LeaseFormKeys.annualIncrement, false);
    }
  }, [values.showMore]);

  const onSliderChange = useCallback((value: number): void => {
    setFieldValue(LeaseFormKeys.minimumLeasePeriod, Math.round(value));
  }, []);

  const onTotalSliderChange = useCallback((value: number): void => {
    setFieldValue(LeaseFormKeys.maximumLeasePeriod, Math.round(value));
  }, []);

  const onUtilityChanged = useCallback((value: string): void => {
    setFieldValue(LeaseFormKeys.utilityBy, value);
  }, []);

  const onMaintenanceChanged = useCallback((value: PaidByTypes): void => {
    setFieldValue(LeaseFormKeys.maintenanceBy, value);
    if (value === PaidByTypes.TENANT) {
      setFieldTouched(LeaseFormKeys.maintenanceAmount, false);
    }
  }, []);

  const onDescriptionChange = useCallback((value: string) => {
    setFieldValue(LeaseFormKeys.description, value);
  }, []);
  // INTERACTION HANDLERS END

  return (
    <>
      <AssetListingSection title={t('leaseTerms')}>
        <>
          {isFromManage && children}
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
          <Text type="small" textType="semiBold" style={styles.headerTitle}>
            {t('duration')}
          </Text>
          <FormCalendar
            formProps={formProps}
            label={dateLabel}
            allowPastDates={isFromManage}
            maxDate={maxDate}
            name={LeaseFormKeys.availableFrom}
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
              minSliderValue={formProps.values[LeaseFormKeys.minimumLeasePeriod]}
              isLabelRequired
              labelText="Months"
            />
            <Text type="small" textType="semiBold" style={styles.sliderTitle}>
              {t('maximumLeasePeriod')}
            </Text>
            <WithFieldError error={formProps.errors[LeaseFormKeys.maximumLeasePeriod]}>
              <Slider
                onSliderChange={onTotalSliderChange}
                minSliderRange={MINIMUM_TOTAL_LEASE_PERIOD}
                maxSliderRange={MAXIMUM_TOTAL_LEASE_PERIOD}
                minSliderValue={formProps.values[LeaseFormKeys.maximumLeasePeriod]}
                isLabelRequired
                labelText="Months"
              />
            </WithFieldError>
            <Text type="small" textType="semiBold" style={styles.headerTitle}>
              {t('utilityBy')}
            </Text>
            <ButtonGroup<PaidByTypes>
              data={PAID_BY_OPTIONS}
              onItemSelect={onUtilityChanged}
              selectedItem={values[LeaseFormKeys.utilityBy]}
              containerStyle={styles.buttonGroup}
            />
            <View
              pointerEvents={isSplitAsUnits ? 'none' : undefined}
              style={isSplitAsUnits ? styles.disabled : undefined}
            >
              <Text type="small" textType="semiBold" style={styles.headerTitle}>
                {t('maintenanceBy')}
              </Text>
              <ButtonGroup<PaidByTypes>
                data={PAID_BY_OPTIONS}
                onItemSelect={onMaintenanceChanged}
                selectedItem={values.maintenanceBy}
                containerStyle={styles.buttonGroup}
              />
            </View>
          </>
          {values.maintenanceBy === PaidByTypes.TENANT && (
            <MaintenanceDetails
              formProps={formProps}
              currencyData={currencyData}
              assetGroupType={assetGroupType}
              maintenanceAmountKey={LeaseFormKeys.maintenanceAmount}
              maintenanceScheduleKey={LeaseFormKeys.maintenanceSchedule}
              maintenanceUnitKey={LeaseFormKeys.maintenanceUnit}
            />
          )}
          {assetGroupType === AssetGroupTypes.COM && (
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
        </>
      </AssetListingSection>
      {!isFromManage && children}
      <AssetListingSection title={t('assetDescription:description')} containerStyles={styles.descriptionContainer}>
        <TextArea
          value={formProps.values[LeaseFormKeys.description]}
          wordCountLimit={MAX_DESCRIPTION_LENGTH}
          placeholder={t('common:typeHere')}
          onMessageChange={onDescriptionChange}
        />
      </AssetListingSection>
    </>
  );
};

const LeaseFormSchema = (t: TFunction): object => {
  return {
    [LeaseFormKeys.maintenanceBy]: yup.string(),
    [LeaseFormKeys.showMore]: yup.boolean(),
    [LeaseFormKeys.monthlyRent]: yup
      .string()
      .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
      .required(t('monthlyRentRequired')),
    [LeaseFormKeys.securityDeposit]: yup
      .string()
      .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
      .required(t('securityDepositRequired')),
    [LeaseFormKeys.annualIncrement]: yup.string().when('showMore', {
      is: true,
      then: yup
        .string()
        .matches(FormUtils.percentageRegex, t('common:onlyNumeric'))
        .required(t('annualIncrementRequired')),
    }),
    [LeaseFormKeys.maintenanceAmount]: yup.string().when('maintenanceBy', {
      is: PaidByTypes.TENANT,
      then: yup
        .string()
        .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
        .required(t('maintenanceAmountRequired')),
    }),
    [LeaseFormKeys.maintenanceSchedule]: yup.string<ScheduleTypes>().required(t('maintenanceScheduleRequired')),
    [LeaseFormKeys.availableFrom]: yup.string(),
    [LeaseFormKeys.minimumLeasePeriod]: yup.number(),
    [LeaseFormKeys.maximumLeasePeriod]: yup
      .number()
      .when(LeaseFormKeys.minimumLeasePeriod, (min: number, schema: yup.MixedSchema<any>) => {
        return schema.test({
          test: (value: number) => value >= min,
          message: t('maximumLeaseError'),
        });
      }),
  };
};

const memoizedComponent = React.memo(LeaseTermForm);
export { memoizedComponent as LeaseTermForm, DEFAULT_LEASE_PERIOD, LeaseFormKeys, LeaseFormSchema };

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
  descriptionContainer: {
    marginTop: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
