import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikActions, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton, FormCalendar, FormTextInput, Text, TextArea } from '@homzhub/common/src/components';
import { MaintenanceDetails } from '@homzhub/mobile/src/components/molecules/MaintenanceDetails';
import { AssetListingSection } from '@homzhub/mobile/src/components/HOC/AssetListingSection';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { ICreateSaleTermDetails } from '@homzhub/common/src/domain/models/SaleTerms';
import { ScheduleTypes } from '@homzhub/common/src/domain/models/LeaseTerms';

interface IProps extends WithTranslation {
  currentAssetId: number;
  currentTermId: number;
  setTermId: (termId: number) => void;
  onNextStep: () => void;
}

interface IFormData {
  expectedPrice: string;
  bookingAmount: string;
  availableFrom: string;
  maintenanceAmount: string;
  maintenanceSchedule: ScheduleTypes;
}

interface IOwnState {
  formData: IFormData;
  description: string;
}

const MAX_DESCRIPTION_LENGTH = 600;

class SaleTermController extends React.PureComponent<IProps, IOwnState> {
  public state = {
    formData: {
      expectedPrice: '',
      bookingAmount: '',
      availableFrom: DateUtils.getCurrentDate(),
      maintenanceAmount: '',
      maintenanceSchedule: ScheduleTypes.ANNUALLY,
    },
    description: '',
  };

  public componentDidMount = async (): Promise<void> => {
    const { currentTermId, currentAssetId } = this.props;

    if (currentTermId <= -1) return;

    try {
      const response = await AssetRepository.getSaleTerms(currentAssetId, { status: 'DRAFT' });
      this.setState({
        description: response[0].description ?? '',
        formData: {
          maintenanceAmount: response[0].maintenanceAmount,
          maintenanceSchedule: response[0].maintenanceSchedule,
          expectedPrice: response[0].expectedPrice,
          availableFrom: DateUtils.getDisplayDate(response[0].availableFromDate, DateFormats.YYYYMMDD),
          bookingAmount: response[0].expectedBookingAmount,
        },
      });
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  };

  public render = (): React.ReactNode => {
    const { t } = this.props;
    const { description, formData } = this.state;

    return (
      <Formik
        enableReinitialize
        onSubmit={this.onSubmit}
        initialValues={{ ...formData }}
        validate={FormUtils.validate(this.formSchema)}
      >
        {(formProps: FormikProps<IFormData>): React.ReactElement => {
          return (
            <>
              <AssetListingSection title={t('resaleTerms')}>
                <>
                  <FormTextInput
                    inputType="number"
                    name="expectedPrice"
                    label={t('expectedPrice')}
                    placeholder={t('expectedPricePlaceholder')}
                    maxLength={formProps.values.expectedPrice.includes('.') ? 13 : 12}
                    formProps={formProps}
                    inputGroupSuffixText="₹"
                  />
                  <FormTextInput
                    inputType="number"
                    name="bookingAmount"
                    label={t('bookingAmount')}
                    placeholder={t('bookingAmountPlaceholder')}
                    maxLength={formProps.values.bookingAmount.includes('.') ? 13 : 12}
                    formProps={formProps}
                    inputGroupSuffixText="₹"
                  />
                  <FormCalendar formProps={formProps} name="availableFrom" textType="label" textSize="regular" />
                  <Text type="small" textType="semiBold" style={styles.headerTitle}>
                    {t('maintenance')}
                  </Text>
                  <MaintenanceDetails
                    formProps={formProps}
                    currency="₹"
                    maintenanceAmountKey="maintenanceAmount"
                    maintenanceScheduleKey="maintenanceSchedule"
                  />
                </>
              </AssetListingSection>
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

  private onDescriptionChange = (description: string): void => {
    this.setState({ description });
  };

  private onSubmit = async (values: IFormData, formActions: FormikActions<FormikValues>): Promise<void> => {
    formActions.setSubmitting(true);
    const { description } = this.state;
    const { onNextStep } = this.props;

    const params: ICreateSaleTermDetails = {
      expected_price: parseInt(values.expectedPrice, 10),
      expected_booking_amount: parseInt(values.bookingAmount, 10),
      available_from_date: values.availableFrom,
      maintenance_amount: parseInt(values.maintenanceAmount, 10),
      maintenance_payment_schedule: values.maintenanceSchedule,
      description,
    };

    const { setTermId, currentTermId, currentAssetId } = this.props;
    try {
      if (currentTermId <= -1) {
        const response = await AssetRepository.createSaleTerm(currentAssetId, params);
        setTermId(response.id);
      } else {
        await AssetRepository.updateSaleTerm(currentAssetId, currentTermId, params);
      }
      onNextStep();
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
    formActions.setSubmitting(false);
  };

  private formSchema = (): yup.ObjectSchema => {
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
      maintenanceAmount: yup
        .string()
        .matches(FormUtils.decimalRegex, t('common:onlyNumeric'))
        .required(t('maintenanceAmountRequired')),
      maintenanceSchedule: yup.string<ScheduleTypes>().required(t('maintenanceScheduleRequired')),
      availableFrom: yup.string(),
      description: yup.string(),
    });
  };
}

const HOC = withTranslation(LocaleConstants.namespacesKey.property)(SaleTermController);
export { HOC as SaleTermController };

const styles = StyleSheet.create({
  continue: {
    flex: 0,
    marginVertical: 20,
  },
  headerTitle: {
    marginTop: 28,
    color: theme.colors.darkTint3,
  },
  descriptionContainer: {
    marginTop: 16,
  },
});
