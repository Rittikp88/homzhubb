import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikActions, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import {
  CheckboxGroup,
  FormButton,
  FormCalendar,
  FormTextInput,
  Slider,
  Text,
  TextArea,
} from '@homzhub/common/src/components';
import { MaintenanceDetails } from '@homzhub/mobile/src/components/molecules/MaintenanceDetails';
import { ButtonGroup } from '@homzhub/mobile/src/components/molecules/ButtonGroup';
import { AssetListingSection } from '@homzhub/mobile/src/components/HOC/AssetListingSection';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import {
  FurnishingType,
  ICreateLeaseTermDetails,
  IUpdateLeaseTermDetails,
  LeaseFormKeys,
  PaidByTypes,
  ScheduleTypes,
} from '@homzhub/common/src/domain/models/LeaseTerms';
import { RecordAssetRepository } from '@homzhub/common/src/domain/repositories/RecordAssetRepository';
import { IList } from '@homzhub/common/src/domain/models/Tenant';
import { ISpaceCount } from '@homzhub/common/src/domain/models/AssetGroup';
import { Currency } from '@homzhub/common/src/domain/models/Currency';

interface IProps extends WithTranslation {
  currentAssetId: number;
  currentTermId: number;
  setTermId: (termId: number) => void;
  onNextStep: () => void;
  currencyData: Currency;
  currentAssetType: string;
}

interface IFormData {
  showMore: boolean;
  monthlyRent: string;
  securityDeposit: string;
  annualIncrement: string;
  availableFrom: string;
  maintenanceAmount: string;
  minimumLeasePeriod: number;
  maintenanceSchedule: ScheduleTypes;
  furnishingStatus: FurnishingType;
  maintenanceBy: PaidByTypes;
  utilityBy: PaidByTypes;
  rentFreePeriod: number;
}

interface IOwnState {
  formData: IFormData;
  description: string;
  preferences: IList[];
  availableSpaces: ISpaceCount[];
  selectedPreferences: number[];
  isPreferencesSelected: boolean;
}

const MAX_DESCRIPTION_LENGTH = 600;
const MINIMUM_LEASE_PERIOD = 1;
const DEFAULT_LEASE_PERIOD = 11;
const MAXIMUM_LEASE_PERIOD = 24;

// TODO: (Shikha) - Need to implement Edit flow

class LeaseTermController extends React.PureComponent<IProps, IOwnState> {
  /*eslint-disable */
  private PAID_BY_OPTIONS = [
    { title: this.props.t('owner'), value: PaidByTypes.OWNER },
    { title: this.props.t('tenant'), value: PaidByTypes.TENANT },
  ];
  /* eslint-enable */

  public state = {
    formData: {
      showMore: false,
      monthlyRent: '',
      securityDeposit: '',
      annualIncrement: '',
      minimumLeasePeriod: DEFAULT_LEASE_PERIOD,
      availableFrom: DateUtils.getCurrentDate(),
      maintenanceAmount: '',
      maintenanceSchedule: ScheduleTypes.ANNUALLY,
      furnishingStatus: FurnishingType.NONE,
      maintenanceBy: PaidByTypes.OWNER,
      utilityBy: PaidByTypes.TENANT,
      rentFreePeriod: 0,
    },
    description: '',
    preferences: [],
    availableSpaces: [],
    selectedPreferences: [],
    isPreferencesSelected: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getTenantPreferences();
    await this.getAvailableSpaces();
  };

  public render = (): React.ReactNode => {
    const { t, currencyData, currentAssetType } = this.props;
    const { description, formData, preferences, isPreferencesSelected } = this.state;

    return (
      <Formik
        enableReinitialize
        onSubmit={this.onSubmit}
        initialValues={{ ...formData }}
        validate={FormUtils.validate(this.formSchema)}
      >
        {(formProps: FormikProps<IFormData>): React.ReactElement => {
          const { setFieldValue, setFieldTouched, values } = formProps;
          const onShowMorePress = (): void => {
            setFieldValue(LeaseFormKeys.showMore, !values.showMore);
            if (!values.showMore) {
              setFieldTouched(LeaseFormKeys.annualIncrement, false);
            }
          };
          const maxDayCount = currentAssetType === 'COM' ? 180 : 60;
          return (
            <>
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
                  {this.renderNonFormikInputs(formProps)}
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
              {preferences.length > 0 && (
                <AssetListingSection title={t('tenantPreferences')} containerStyles={styles.descriptionContainer}>
                  <CheckboxGroup
                    key={`${isPreferencesSelected}-checkbox`}
                    data={preferences}
                    onToggle={this.handlePreferences}
                    containerStyle={styles.checkBox}
                  />
                </AssetListingSection>
              )}
              <AssetListingSection
                title={t('assetDescription:description')}
                containerStyles={styles.descriptionContainer}
              >
                <TextArea
                  value={description}
                  wordCountLimit={MAX_DESCRIPTION_LENGTH}
                  placeholder={t('common:typeHere')}
                  onMessageChange={this.onDescriptionChange}
                />
              </AssetListingSection>
              <FormButton
                title={t('common:continue')}
                type="primary"
                formProps={formProps}
                // @ts-ignore
                onPress={formProps.handleSubmit}
                containerStyle={styles.continue}
              />
            </>
          );
        }}
      </Formik>
    );
  };

  private renderNonFormikInputs = (formProps: FormikProps<IFormData>): React.ReactNode => {
    const { t } = this.props;
    const {
      formData: { minimumLeasePeriod },
    } = this.state;
    const { values, setFieldValue, setFieldTouched } = formProps;

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

    return (
      <>
        <>
          <Text type="small" textType="semiBold" style={styles.sliderTitle}>
            {t('minimumLeasePeriod')}
          </Text>
          <Slider
            onSliderChange={onSliderChange}
            minSliderRange={MINIMUM_LEASE_PERIOD}
            maxSliderRange={MAXIMUM_LEASE_PERIOD}
            minSliderValue={minimumLeasePeriod}
            isLabelRequired
            labelText="Months"
          />
        </>
        <Text type="small" textType="semiBold" style={styles.headerTitle}>
          {t('utilityBy')}
        </Text>
        <ButtonGroup<PaidByTypes>
          data={this.PAID_BY_OPTIONS}
          onItemSelect={onUtilityChanged}
          selectedItem={values[LeaseFormKeys.utilityBy]}
          containerStyle={styles.buttonGroup}
        />
        <Text type="small" textType="semiBold" style={styles.headerTitle}>
          {t('maintenanceBy')}
        </Text>
        <ButtonGroup<PaidByTypes>
          data={this.PAID_BY_OPTIONS}
          onItemSelect={onMaintenanceChanged}
          selectedItem={values.maintenanceBy}
          containerStyle={styles.buttonGroup}
        />
      </>
    );
  };

  private onDescriptionChange = (description: string): void => {
    this.setState({ description });
  };

  private onSubmit = async (values: IFormData, formActions: FormikActions<FormikValues>): Promise<void> => {
    formActions.setSubmitting(true);
    const { onNextStep, currentAssetType } = this.props;
    const { description, availableSpaces, selectedPreferences } = this.state;

    let maintenance_amount: number | null = parseInt(values[LeaseFormKeys.maintenanceAmount], 10);
    let maintenance_payment_schedule: ScheduleTypes | null = values[LeaseFormKeys.maintenanceSchedule];
    let annual_rent_increment_percentage: number | null = parseFloat(values[LeaseFormKeys.annualIncrement]);
    if (values[LeaseFormKeys.maintenanceBy] === PaidByTypes.OWNER) {
      maintenance_amount = null;
      maintenance_payment_schedule = null;
    }
    if (!values[LeaseFormKeys.showMore]) {
      annual_rent_increment_percentage = null;
    }

    const leaseTerms: ICreateLeaseTermDetails | IUpdateLeaseTermDetails = {
      expected_monthly_rent: parseInt(values[LeaseFormKeys.monthlyRent], 10),
      security_deposit: parseInt(values[LeaseFormKeys.securityDeposit], 10),
      annual_rent_increment_percentage,
      minimum_lease_period: values[LeaseFormKeys.minimumLeasePeriod],
      available_from_date: values[LeaseFormKeys.availableFrom],
      maintenance_paid_by: values[LeaseFormKeys.maintenanceBy],
      utility_paid_by: values[LeaseFormKeys.utilityBy],
      furnishing: values[LeaseFormKeys.furnishingStatus],
      maintenance_amount,
      maintenance_payment_schedule,
      ...(description && { description }),
      tenant_preferences: selectedPreferences,
      ...(currentAssetType === 'COM' && { rent_free_period: Number(values[LeaseFormKeys.rentFreePeriod]) }),
      lease_unit: {
        name: 'Unit 1',
        spaces: availableSpaces,
      },
    };

    const { setTermId, currentTermId, currentAssetId } = this.props;
    try {
      if (currentTermId <= -1) {
        const response = await AssetRepository.createLeaseTerms(currentAssetId, [
          leaseTerms,
        ] as ICreateLeaseTermDetails[]);
        setTermId(response.id);
      } else {
        await AssetRepository.updateLeaseTerms(currentAssetId, currentTermId, leaseTerms as IUpdateLeaseTermDetails);
      }
      onNextStep();
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
    formActions.setSubmitting(false);
  };

  private getTenantPreferences = async (): Promise<void> => {
    const { currentAssetId } = this.props;
    try {
      const response = await RecordAssetRepository.getTenantPreferences(currentAssetId);
      const preferenceList = response.map((item) => {
        return item.menuItem;
      });
      this.setState({ preferences: preferenceList });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private getAvailableSpaces = async (): Promise<void> => {
    const { currentAssetId } = this.props;
    try {
      const response = await AssetRepository.getAssetAvailableSpaces(currentAssetId);
      const spaces = response.map((item) => {
        return item.spaceList;
      });
      this.setState({ availableSpaces: spaces });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private handlePreferences = (id: number, isChecked: boolean): void => {
    const { preferences, isPreferencesSelected } = this.state;
    const selectedValues: number[] = [];

    preferences.forEach((detail: IList) => {
      if (detail.id === id) {
        detail.isSelected = isChecked;
      }
      if (detail.isSelected) {
        selectedValues.push(detail.id);
      }
    });

    this.setState({ preferences, selectedPreferences: selectedValues, isPreferencesSelected: !isPreferencesSelected });
  };

  private formSchema = (): yup.ObjectSchema => {
    const { t } = this.props;
    return yup.object().shape({
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
      availableFrom: yup.string(),
      description: yup.string(),
    });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.property)(LeaseTermController);

const styles = StyleSheet.create({
  continue: {
    flex: 0,
    marginTop: 20,
    marginBottom: 50,
  },
  showMore: {
    marginTop: 8,
    alignSelf: 'flex-end',
    color: theme.colors.active,
  },
  headerTitle: {
    marginTop: 25,
    color: theme.colors.darkTint3,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  buttonGroup: {
    marginTop: 14,
  },
  sliderTitle: {
    marginTop: 28,
    color: theme.colors.darkTint3,
    marginBottom: 18,
  },
  checkBox: {
    paddingVertical: 10,
  },
});
