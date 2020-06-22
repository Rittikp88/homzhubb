import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik, FormikActions, FormikProps, FormikValues } from 'formik';
import { withTranslation, WithTranslation } from 'react-i18next';
import moment from 'moment';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton, FormTextInput, Label, RNSlider, Text } from '@homzhub/common/src/components';
import { CalendarComponent } from '@homzhub/common/src/components/atoms/CalendarComponent';
import { ButtonGroup } from '@homzhub/mobile/src/components/molecules/ButtonGroup';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';
import { MaintenanceDetails } from '@homzhub/mobile/src/components/molecules/MaintenanceDetails';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import {
  FurnishingType,
  ICreateLeaseTermDetails,
  PaidByTypes,
  ScheduleTypes,
} from '@homzhub/common/src/domain/models/LeaseTerms';

interface IState {
  showMore: boolean;
  leaseFormDetails: {
    monthlyRent: string;
    securityDeposit: string;
    annualIncrement: string;
    maintenanceAmount: string;
    maintenanceSchedule: string;
  };
  minimumLeasePeriod: number;
  availableFrom: string;
  furnishingStatus: FurnishingType;
  maintenanceBy: PaidByTypes;
  utilityBy: PaidByTypes;
  isCalendarVisible: boolean;
}

interface IProps extends WithTranslation {
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
}

class LeaseDetailsForm extends React.PureComponent<IProps, IState> {
  private MINIMUM_LEASE_PERIOD = 1;
  private DEFAULT_LEASE_PERIOD = 11;
  private MAXIMUM_LEASE_PERIOD = 24;

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
    leaseFormDetails: {
      monthlyRent: '',
      securityDeposit: '',
      annualIncrement: '',
      maintenanceAmount: '',
      maintenanceSchedule: ScheduleTypes.ANNUALLY,
    },
    minimumLeasePeriod: this.DEFAULT_LEASE_PERIOD,
    availableFrom: moment().format('YYYY-MM-DD'),
    furnishingStatus: FurnishingType.NONE,
    maintenanceBy: PaidByTypes.OWNER,
    utilityBy: PaidByTypes.TENANT,
    isCalendarVisible: false,
  };

  public render(): React.ReactNode {
    const { t, currency } = this.props;
    const { leaseFormDetails, showMore, maintenanceBy, isCalendarVisible, availableFrom } = this.state;

    return (
      <>
        <Formik
          onSubmit={this.onSubmit}
          initialValues={{ ...leaseFormDetails, maintenanceBy, showMore }}
          validate={FormUtils.validate(this.formSchema)}
        >
          {(formProps: FormikProps<FormikValues>): React.ReactElement => {
            const { setFieldValue, setFieldTouched } = formProps;
            const onShowMorePress = (): void => {
              setFieldValue(LeaseFormKeys.showMore, !showMore);
              if (!showMore) {
                setFieldTouched(LeaseFormKeys.annualIncrement, false);
              }
              this.onShowMorePress();
            };
            const onMaintenanceChanged = (value: PaidByTypes): void => {
              setFieldValue(LeaseFormKeys.maintenanceBy, value);
              if (value === PaidByTypes.TENANT) {
                setFieldTouched(LeaseFormKeys.maintenanceAmount, false);
              }
              this.onMaintenanceChanged(value);
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
                  {showMore ? t('showLess') : t('showMore')}
                </Text>
                {showMore && (
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
                {this.renderNonFormikInputs()}
                <Text type="small" textType="semiBold" style={styles.headerTitle}>
                  {t('maintenanceBy')}
                </Text>
                <ButtonGroup<PaidByTypes>
                  data={this.PAID_BY_OPTIONS}
                  onItemSelect={onMaintenanceChanged}
                  selectedItem={maintenanceBy}
                />
                {maintenanceBy === PaidByTypes.TENANT && (
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
        <BottomSheet
          visible={isCalendarVisible}
          onCloseSheet={this.closeBottomSheet}
          headerTitle={t('common:availableFrom')}
          isShadowView
          sheetHeight={580}
        >
          <CalendarComponent onSelect={this.handleCalendar} selectedDate={availableFrom} />
        </BottomSheet>
      </>
    );
  }

  private renderNonFormikInputs = (): React.ReactNode => {
    const { t } = this.props;
    const { minimumLeasePeriod, utilityBy, furnishingStatus, availableFrom } = this.state;
    const availableDate = availableFrom === moment().format('YYYY-MM-DD') ? 'Today' : availableFrom;

    return (
      <>
        <Text type="small" textType="semiBold" style={styles.headerTitle}>
          {t('duration')}
        </Text>
        <View style={styles.dateView}>
          <View style={styles.dateLeft}>
            <Icon name={icons.calendar} color={theme.colors.darkTint5} size={18} onPress={this.handleOnPress} />
            <Text type="small" textType="regular" style={styles.dateText}>
              {availableDate}
            </Text>
          </View>
          <Icon name={icons.downArrowFilled} color={theme.colors.darkTint7} size={16} onPress={this.handleOnPress} />
        </View>
        <>
          <Text type="small" textType="semiBold" style={styles.headerTitle}>
            {t('minimumLeasePeriod')}
          </Text>
          <View style={styles.currentMonth}>
            <Text type="regular" textType="regular">
              {minimumLeasePeriod}
            </Text>
            <Label type="regular" textType="regular">
              {` ${minimumLeasePeriod === 1 ? t('common:month') : t('common:months')}`}
            </Label>
          </View>
          <RNSlider
            minimumValue={this.MINIMUM_LEASE_PERIOD}
            maximumValue={this.MAXIMUM_LEASE_PERIOD}
            minimumTrackTintColor={theme.colors.active}
            thumbTintColor={theme.colors.active}
            maximumTrackTintColor={theme.colors.disabled}
            onValueChange={this.onSliderChange}
            value={minimumLeasePeriod}
          />
        </>
        <Text type="small" textType="semiBold" style={styles.headerTitle}>
          {t('furnishing')}
        </Text>
        <ButtonGroup<FurnishingType>
          data={this.FURNISHING_STATUS}
          onItemSelect={this.onFurnishingStatusChange}
          selectedItem={furnishingStatus}
        />
        <Text type="small" textType="semiBold" style={styles.headerTitle}>
          {t('utilityBy')}
        </Text>
        <ButtonGroup<PaidByTypes>
          data={this.PAID_BY_OPTIONS}
          onItemSelect={this.onUtilityChanged}
          selectedItem={utilityBy}
        />
      </>
    );
  };

  private onShowMorePress = (): void => {
    const { showMore } = this.state;
    this.setState({ showMore: !showMore });
  };

  private onSliderChange = (data: number): void => {
    this.setState({
      minimumLeasePeriod: Math.floor(data),
    });
  };

  private onUtilityChanged = (value: PaidByTypes): void => {
    this.setState({ utilityBy: value });
  };

  private onMaintenanceChanged = (value: PaidByTypes): void => {
    this.setState({ maintenanceBy: value });
  };

  private onFurnishingStatusChange = (value: FurnishingType): void => {
    this.setState({ furnishingStatus: value });
  };

  private onSubmit = (values: FormikValues, formActions: FormikActions<FormikValues>): void => {
    formActions.setSubmitting(true);
    const { onSubmit, currency } = this.props;
    const { utilityBy, maintenanceBy, minimumLeasePeriod, availableFrom, furnishingStatus, showMore } = this.state;

    let maintenance_amount: number | null = parseInt(values[LeaseFormKeys.maintenanceAmount], 10);
    let maintenance_schedule = values[LeaseFormKeys.maintenanceSchedule];
    let annual_increment_percentage: number | null = parseFloat(values[LeaseFormKeys.annualIncrement]);
    if (maintenanceBy === PaidByTypes.OWNER) {
      maintenance_amount = null;
      maintenance_schedule = null;
    }
    if (!showMore) {
      annual_increment_percentage = null;
    }

    const leaseTerms: ICreateLeaseTermDetails = {
      currency_code: currency,
      monthly_rent_price: parseInt(values[LeaseFormKeys.monthlyRent], 10),
      security_deposit_price: parseInt(values[LeaseFormKeys.securityDeposit], 10),
      annual_increment_percentage,
      minimum_lease_period: minimumLeasePeriod,
      available_from_date: availableFrom,
      maintenance_paid_by: maintenanceBy,
      utility_paid_by: utilityBy,
      furnishing_status: furnishingStatus,
      maintenance_amount,
      maintenance_schedule,
    };
    onSubmit(leaseTerms);
  };

  private handleOnPress = (): void => {
    const { isCalendarVisible } = this.state;
    this.setState({ isCalendarVisible: !isCalendarVisible });
  };

  private closeBottomSheet = (): void => {
    this.setState({ isCalendarVisible: false });
  };

  private handleCalendar = (day: string): void => {
    this.setState({ isCalendarVisible: false, availableFrom: day });
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
        .required(t('securityDepositRentRequired')),
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
          .required(t('maintenanceAmountRentRequired')),
      }),
      [LeaseFormKeys.maintenanceSchedule]: yup.string(),
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
  currentMonth: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
  dateView: {
    borderWidth: 1,
    borderColor: theme.colors.disabled,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
  },
  dateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 16,
    color: theme.colors.darkTint1,
  },
});
