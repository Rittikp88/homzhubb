import React from 'react';
import { StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Formik, FormikActions, FormikProps, FormikValues } from 'formik';
import moment from 'moment';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton, FormDropdown, FormTextInput, Text } from '@homzhub/common/src/components';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { MaintenanceDetails } from '@homzhub/mobile/src/components/molecules/MaintenanceDetails';
import { ICreateSaleTermDetails } from '@homzhub/common/src/domain/models/SaleTerms';
import { ScheduleTypes } from '@homzhub/common/src/domain/models/LeaseTerms';

interface IProps extends WithTranslation {
  currency: string;
  testID?: string;
}

interface IResaleFormState {
  expectedPrice: string;
  bookingAmount: string;
  yearOfConstruction: string;
  availableFrom: string;
  maintenanceAmount: string;
  maintenanceSchedule: ScheduleTypes;
}

export class ResaleDetailsForm extends React.PureComponent<IProps, IResaleFormState> {
  public state = {
    expectedPrice: '',
    bookingAmount: '',
    yearOfConstruction: moment().format('YYYY'),
    availableFrom: moment().format('YYYY-MM-DD'),
    maintenanceAmount: '',
    maintenanceSchedule: ScheduleTypes.ANNUALLY,
  };

  // public componentDidUpdate = (prevProps: Readonly<IProps>): void => {
  //   const { initialValues } = this.props;
  //   if (prevProps.initialValues !== initialValues && initialValues) {
  //     const {
  //       available_from_date,
  //       expected_booking_amount,
  //       expected_price,
  //       maintenance_amount,
  //       maintenance_payment_schedule,
  //       construction_year,
  //     } = initialValues;
  //
  //     // eslint-disable-next-line react/no-did-update-set-state
  //     this.setState({
  //       expectedPrice: expected_price.toString(),
  //       bookingAmount: expected_booking_amount.toString(),
  //       yearOfConstruction: construction_year.toString(),
  //       availableFrom: available_from_date,
  //       maintenanceAmount: maintenance_amount.toString(),
  //       maintenanceSchedule: maintenance_payment_schedule,
  //     });
  //   }
  // };

  public render = (): React.ReactNode => {
    const { currency, t } = this.props;
    return (
      <Formik
        enableReinitialize
        onSubmit={this.onSubmit}
        initialValues={{ ...this.state }}
        validate={FormUtils.validate(this.formSchema)}
      >
        {(formProps: FormikProps<IResaleFormState>): React.ReactElement => {
          return (
            <>
              <FormTextInput
                inputType="number"
                name="expectedPrice"
                label={t('expectedPrice')}
                placeholder={t('expectedPricePlaceholder')}
                maxLength={formProps.values.expectedPrice.includes('.') ? 13 : 12}
                formProps={formProps}
                inputGroupSuffixText={currency}
              />
              <FormTextInput
                inputType="number"
                name="bookingAmount"
                label={t('bookingAmount')}
                placeholder={t('bookingAmountPlaceholder')}
                maxLength={formProps.values.bookingAmount.includes('.') ? 13 : 12}
                formProps={formProps}
                inputGroupSuffixText={currency}
              />
              <FormDropdown
                label={t('yearOfConstruction')}
                name="yearOfConstruction"
                options={this.getYearOptions()}
                formProps={formProps}
              />
              <FormCalendar formProps={formProps} name="availableFrom" />
              <Text type="small" textType="semiBold" style={styles.headerTitle}>
                {t('maintenance')}
              </Text>
              <MaintenanceDetails
                formProps={formProps}
                currency={currency}
                maintenanceAmountKey="maintenanceAmount"
                maintenanceScheduleKey="maintenanceSchedule"
              />
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

  private onSubmit = (values: IResaleFormState, formActions: FormikActions<FormikValues>): void => {
    formActions.setSubmitting(true);
    const { currency } = this.props;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const payload: ICreateSaleTermDetails = {
      currency_code: currency,
      expected_price: parseInt(values.expectedPrice, 10),
      expected_booking_amount: parseInt(values.bookingAmount, 10),
      construction_year: parseInt(values.yearOfConstruction, 10),
      available_from_date: values.availableFrom,
      maintenance_amount: parseInt(values.maintenanceAmount, 10),
      maintenance_payment_schedule: values.maintenanceSchedule,
    };

    formActions.setSubmitting(false);
  };

  private getYearOptions = (): { value: string; label: string }[] => {
    const years = [];
    const dateStart = moment().subtract(20, 'y');
    const dateEnd = moment().add(5, 'y');
    while (dateEnd.diff(dateStart, 'years') >= 0) {
      years.push(dateStart.format('YYYY'));
      dateStart.add(1, 'year');
    }
    return years.map((year) => ({
      label: year,
      value: year,
    }));
  };

  private formSchema = (): yup.ObjectSchema<IResaleFormState> => {
    const { t } = this.props;
    return yup.object().shape({
      expectedPrice: yup
        .string()
        .min(3, t('minimumAmount'))
        .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
        .required(t('expectedPriceRequired')),
      bookingAmount: yup
        .string()
        .test({
          name: 'test-bookingAmount-greater',
          exclusive: true,
          test(bookingAmount: string) {
            const { expectedPrice } = this.parent;
            return parseInt(bookingAmount, 10) <= parseInt(expectedPrice, 10);
          },
          message: t('bookingAmountExceeded'),
        })
        .min(3, t('minimumAmount'))
        .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
        .required(t('bookingAmountRequired')),
      yearOfConstruction: yup
        .string()
        .matches(FormUtils.digitRegex, t('common:onlyNumeric'))
        .required(t('yearOfConstructionRequired')),
      maintenanceAmount: yup
        .string()
        .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
        .required(t('maintenanceAmountRequired')),
      maintenanceSchedule: yup.string<ScheduleTypes>().required(t('maintenanceScheduleRequired')),
      availableFrom: yup.string(),
    });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.property)(ResaleDetailsForm);

const styles = StyleSheet.create({
  continue: {
    flex: 0,
    marginVertical: 20,
  },
  headerTitle: {
    marginTop: 28,
    color: theme.colors.darkTint3,
  },
});
