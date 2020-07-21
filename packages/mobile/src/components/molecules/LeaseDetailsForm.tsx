import React from 'react';
import { StyleSheet } from 'react-native';
import { Formik, FormikActions, FormikProps, FormikValues } from 'formik';
import { withTranslation, WithTranslation } from 'react-i18next';
import moment from 'moment';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormTextInput, Text, FormButton, Slider } from '@homzhub/common/src/components';
import { ButtonGroup } from '@homzhub/mobile/src/components/molecules/ButtonGroup';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { MaintenanceDetails } from '@homzhub/mobile/src/components/molecules/MaintenanceDetails';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import {
  FurnishingType,
  ICreateLeaseTermDetails,
  ILeaseTermDetails,
  PaidByTypes,
  ScheduleTypes,
} from '@homzhub/common/src/domain/models/LeaseTerms';

interface IState {
  showMore: boolean;
  monthlyRent: string;
  securityDeposit: string;
  annualIncrement: string;
  maintenanceAmount: string;
  maintenanceSchedule: ScheduleTypes;
  minimumLeasePeriod: number;
  availableFrom: string;
  furnishingStatus: FurnishingType;
  maintenanceBy: PaidByTypes;
  utilityBy: PaidByTypes;
}

interface IProps extends WithTranslation {
  initialValues: ILeaseTermDetails | null;
  currency: string;
  onSubmit: (data: ICreateLeaseTermDetails) => void;
}

export enum LeaseFormKeys {
  monthlyRent = 'monthlyRent',
  securityDeposit = 'securityDeposit',
  showMore = 'showMore',
  annualIncrement = 'annualIncrement',
  maintenanceAmount = 'maintenanceAmount',
  maintenanceSchedule = 'maintenanceSchedule',
  maintenanceBy = 'maintenanceBy',
  availableFrom = 'availableFrom',
  furnishingStatus = 'furnishingStatus',
  utilityBy = 'utilityBy',
  minimumLeasePeriod = 'minimumLeasePeriod',
}
const MINIMUM_LEASE_PERIOD = 1;
const DEFAULT_LEASE_PERIOD = 11;
const MAXIMUM_LEASE_PERIOD = 24;

class LeaseDetailsForm extends React.PureComponent<IProps, IState> {
  /*eslint-disable */
  private PAID_BY_OPTIONS = [
    { title: this.props.t('owner'), value: PaidByTypes.OWNER },
    { title: this.props.t('tenant'), value: PaidByTypes.TENANT },
  ];
  private FURNISHING_STATUS = [
    { title: this.props.t('fullyFurnished'), value: FurnishingType.FULL },
    { title: this.props.t('semiFurnished'), value: FurnishingType.SEMI },
    { title: this.props.t('none'), value: FurnishingType.NONE },
  ];
  /* eslint-enable */

  public state = {
    showMore: false,
    monthlyRent: '',
    securityDeposit: '',
    annualIncrement: '',
    maintenanceAmount: '',
    maintenanceSchedule: ScheduleTypes.ANNUALLY,
    minimumLeasePeriod: DEFAULT_LEASE_PERIOD,
    availableFrom: moment().format('YYYY-MM-DD'),
    furnishingStatus: FurnishingType.NONE,
    maintenanceBy: PaidByTypes.OWNER,
    utilityBy: PaidByTypes.TENANT,
  };

  public componentDidUpdate = (prevProps: Readonly<IProps>, prevState: Readonly<IState>): void => {
    const { initialValues } = this.props;
    if (prevProps.initialValues !== initialValues && initialValues) {
      const {
        maintenance_schedule,
        monthly_rent_price,
        security_deposit_price,
        annual_increment_percentage,
        maintenance_amount,
        minimum_lease_period,
        available_from_date,
        furnishing_status,
        maintenance_paid_by,
        utility_paid_by,
      } = initialValues;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        showMore: !!annual_increment_percentage,
        monthlyRent: monthly_rent_price.toString(),
        securityDeposit: security_deposit_price.toString(),
        annualIncrement: annual_increment_percentage?.toString() ?? '',
        maintenanceAmount: maintenance_amount?.toString() ?? '',
        maintenanceSchedule: maintenance_schedule ?? ScheduleTypes.ANNUALLY,
        minimumLeasePeriod: minimum_lease_period,
        availableFrom: available_from_date,
        furnishingStatus: furnishing_status,
        maintenanceBy: maintenance_paid_by,
        utilityBy: utility_paid_by,
      });
    }
  };

  public render(): React.ReactNode {
    const { t, currency } = this.props;
    return (
      <>
        <Formik
          enableReinitialize
          onSubmit={this.onSubmit}
          initialValues={{ ...this.state }}
          validate={FormUtils.validate(this.formSchema)}
        >
          {(formProps: FormikProps<IState>): React.ReactElement => {
            const { setFieldValue, setFieldTouched, values } = formProps;
            const onShowMorePress = (): void => {
              setFieldValue(LeaseFormKeys.showMore, !values.showMore);
              if (!values.showMore) {
                setFieldTouched(LeaseFormKeys.annualIncrement, false);
              }
            };
            const onMaintenanceChanged = (value: PaidByTypes): void => {
              setFieldValue(LeaseFormKeys.maintenanceBy, value);
              if (value === PaidByTypes.TENANT) {
                setFieldTouched(LeaseFormKeys.maintenanceAmount, false);
              }
            };

            return (
              <>
                <FormTextInput
                  inputType="number"
                  name={LeaseFormKeys.monthlyRent}
                  label={t('monthlyRent')}
                  placeholder={t('monthlyRentPlaceholder')}
                  maxLength={12}
                  formProps={formProps}
                  inputGroupSuffixText={currency}
                />
                <FormTextInput
                  inputType="number"
                  name={LeaseFormKeys.securityDeposit}
                  label={t('securityDeposit')}
                  placeholder={t('securityDepositPlaceholder')}
                  maxLength={12}
                  formProps={formProps}
                  inputGroupSuffixText={currency}
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
                {this.renderNonFormikInputs(formProps)}
                <Text type="small" textType="semiBold" style={styles.headerTitle}>
                  {t('maintenanceBy')}
                </Text>
                <ButtonGroup<PaidByTypes>
                  data={this.PAID_BY_OPTIONS}
                  onItemSelect={onMaintenanceChanged}
                  selectedItem={values.maintenanceBy}
                />
                {values.maintenanceBy === PaidByTypes.TENANT && (
                  <MaintenanceDetails
                    formProps={formProps}
                    currency={currency}
                    maintenanceAmountKey={LeaseFormKeys.maintenanceAmount}
                    maintenanceScheduleKey={LeaseFormKeys.maintenanceSchedule}
                  />
                )}
                <FormButton
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  formProps={formProps}
                  type="primary"
                  title={t('common:continue')}
                  containerStyle={styles.continue}
                />
              </>
            );
          }}
        </Formik>
      </>
    );
  }

  private renderNonFormikInputs = (formProps: FormikProps<IState>): React.ReactNode => {
    const { t } = this.props;
    const { minimumLeasePeriod } = this.state;
    const { values, setFieldValue } = formProps;

    const onSliderChange = (value: number): void => {
      setFieldValue(LeaseFormKeys.minimumLeasePeriod, Math.round(value));
    };

    const onFurnishingStatusChange = (value: string): void => {
      setFieldValue(LeaseFormKeys.furnishingStatus, value);
    };

    const onUtilityChanged = (value: string): void => {
      setFieldValue(LeaseFormKeys.utilityBy, value);
    };

    return (
      <>
        <Text type="small" textType="semiBold" style={styles.headerTitle}>
          {t('duration')}
        </Text>
        <FormCalendar name="availableFrom" formProps={formProps} containerStyle={styles.dateContainer} />
        <>
          <Text type="small" textType="semiBold" style={styles.headerTitle}>
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
          {t('furnishing')}
        </Text>
        <ButtonGroup<FurnishingType>
          data={this.FURNISHING_STATUS}
          onItemSelect={onFurnishingStatusChange}
          selectedItem={values[LeaseFormKeys.furnishingStatus]}
        />
        <Text type="small" textType="semiBold" style={styles.headerTitle}>
          {t('utilityBy')}
        </Text>
        <ButtonGroup<PaidByTypes>
          data={this.PAID_BY_OPTIONS}
          onItemSelect={onUtilityChanged}
          selectedItem={values[LeaseFormKeys.utilityBy]}
        />
      </>
    );
  };

  private onSubmit = (values: IState, formActions: FormikActions<FormikValues>): void => {
    formActions.setSubmitting(true);
    const { onSubmit, currency } = this.props;

    let maintenance_amount: number | null = parseInt(values[LeaseFormKeys.maintenanceAmount], 10);
    let maintenance_schedule: ScheduleTypes | null = values[LeaseFormKeys.maintenanceSchedule];
    let annual_increment_percentage: number | null = parseFloat(values[LeaseFormKeys.annualIncrement]);
    if (values[LeaseFormKeys.maintenanceBy] === PaidByTypes.OWNER) {
      maintenance_amount = null;
      maintenance_schedule = null;
    }
    if (!values[LeaseFormKeys.showMore]) {
      annual_increment_percentage = null;
    }

    const leaseTerms: ICreateLeaseTermDetails = {
      currency_code: currency,
      monthly_rent_price: parseInt(values[LeaseFormKeys.monthlyRent], 10),
      security_deposit_price: parseInt(values[LeaseFormKeys.securityDeposit], 10),
      annual_increment_percentage,
      minimum_lease_period: values[LeaseFormKeys.minimumLeasePeriod],
      available_from_date: values[LeaseFormKeys.availableFrom],
      maintenance_paid_by: values[LeaseFormKeys.maintenanceBy],
      utility_paid_by: values[LeaseFormKeys.utilityBy],
      furnishing_status: values[LeaseFormKeys.furnishingStatus],
      maintenance_amount,
      maintenance_schedule,
    };
    onSubmit(leaseTerms);
    formActions.setSubmitting(false);
  };

  private formSchema = (): yup.ObjectSchema => {
    const { t } = this.props;
    return yup.object().shape({
      [LeaseFormKeys.maintenanceBy]: yup.string(),
      [LeaseFormKeys.showMore]: yup.boolean(),
      [LeaseFormKeys.monthlyRent]: yup
        .string()
        .matches(FormUtils.digitRegex, t('common:onlyNumeric'))
        .required(t('monthlyRentRequired')),
      [LeaseFormKeys.securityDeposit]: yup
        .string()
        .matches(FormUtils.digitRegex, t('common:onlyNumeric'))
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
          .matches(FormUtils.digitRegex, t('common:onlyNumeric'))
          .required(t('maintenanceAmountRequired')),
      }),
      [LeaseFormKeys.maintenanceSchedule]: yup.string<ScheduleTypes>().required(t('maintenanceScheduleRequired')),
    });
  };
}

const HOC = withTranslation(LocaleConstants.namespacesKey.property)(LeaseDetailsForm);
export { HOC as LeaseDetailsForm };

const styles = StyleSheet.create({
  continue: {
    flex: 0,
    marginVertical: 28,
  },
  showMore: {
    marginTop: 8,
    alignSelf: 'flex-end',
    color: theme.colors.active,
  },
  headerTitle: {
    marginTop: 28,
    marginBottom: 16,
    color: theme.colors.darkTint3,
  },
  dateContainer: {
    marginTop: 0,
  },
});
