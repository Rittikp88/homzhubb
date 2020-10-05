import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { CheckboxGroup, FormButton, TextArea } from '@homzhub/common/src/components';
import {
  LeaseTermForm,
  DEFAULT_LEASE_PERIOD,
  IFormData,
  LeaseFormKeys,
  LeaseFormSchema,
} from '@homzhub/mobile/src/components/molecules/LeaseTermForm';
import { AssetListingSection } from '@homzhub/mobile/src/components/HOC/AssetListingSection';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import {
  ICreateLeaseTermDetails,
  IUpdateLeaseTermDetails,
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

interface IOwnState {
  formData: IFormData;
  description: string;
  preferences: IList[];
  availableSpaces: ISpaceCount[];
  selectedPreferences: number[];
  isPreferencesSelected: boolean;
}

const MAX_DESCRIPTION_LENGTH = 600;

// TODO: (Shikha) - Need to implement Edit flow

class LeaseTermController extends React.PureComponent<IProps, IOwnState> {
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
          return (
            <>
              <AssetListingSection title={t('leaseTerms')}>
                <LeaseTermForm formProps={formProps} currencyData={currencyData} currentAssetType={currentAssetType} />
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

  private onDescriptionChange = (description: string): void => {
    this.setState({ description });
  };

  private onSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
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
      ...LeaseFormSchema(t),
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
  descriptionContainer: {
    marginTop: 16,
  },
  checkBox: {
    paddingVertical: 10,
  },
});
