import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import {
  IFormData,
  initialLeaseFormValues,
  LeaseFormKeys,
  LeaseFormSchema,
  LeaseTermForm,
} from '@homzhub/common/src/components/molecules/LeaseTermForm';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { TransactionDetail } from '@homzhub/common/src/domain/models/TransactionDetail';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.UpdateLeaseScreen>;
type Props = libraryProps;

const UpdateLeaseTerm = (props: Props): React.ReactElement => {
  const {
    navigation,
    route: {
      params: { transactionId, assetGroup, user },
    },
  } = props;

  const { t } = useTranslation();
  const [leaseData, setLeaseData] = useState<TransactionDetail>();

  useEffect(() => {
    AssetRepository.getLeaseTransaction(transactionId)
      .then((res) => {
        setLeaseData(res);
      })
      .catch((err) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
      });
  }, []);

  // FORMATTED INITIAL VALUES
  const formattedValues = (detail: TransactionDetail): IFormData => {
    return {
      ...initialLeaseFormValues,
      availableFrom: detail.leaseStartDate,
      monthlyRent: detail.rent.toString(),
      maintenanceAmount: detail.maintenanceAmount?.toString() ?? '',
      securityDeposit: detail.securityDeposit.toString(),
      minimumLeasePeriod: detail.minimumLeasePeriod,
      maximumLeasePeriod: detail.leasePeriod,
      utilityBy: detail.utilityPaidBy,
      maintenanceBy: detail.maintenancePaidBy,
      maintenanceSchedule: detail.maintenancePaymentSchedule,
      annualIncrement: detail.annualRentIncrementPercentage ? detail.annualRentIncrementPercentage.toString() : '',
    };
  };

  const onSubmit = async (values: IFormData): Promise<void> => {
    if (!leaseData) return;
    const { tentativeEndDate, currency } = leaseData;

    // FORMATTED PAYLOAD
    const payload = {
      rent: Number(values[LeaseFormKeys.monthlyRent]),
      security_deposit: Number(values[LeaseFormKeys.securityDeposit]),
      lease_period: Number(values[LeaseFormKeys.maximumLeasePeriod]),
      annual_rent_increment_percentage: Number(values[LeaseFormKeys.annualIncrement]),
      maintenance_paid_by: values[LeaseFormKeys.maintenanceBy],
      utility_paid_by: values[LeaseFormKeys.utilityBy],
      lease_start_date: DateUtils.getDisplayDate(values[LeaseFormKeys.availableFrom], DateFormats.ISO),
      tentative_end_date: tentativeEndDate,
      currency: currency.currencyCode,
      minimum_lease_period: Number(values[LeaseFormKeys.minimumLeasePeriod]),
      maintenance_amount: Number(values[LeaseFormKeys.maintenanceAmount]) || null,
    };

    try {
      await AssetRepository.updateLeaseTransaction({ transactionId, data: payload });
      AlertHelper.success({ message: t('property:leaseUpdated') });
      navigation.goBack();
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  // FORM VALIDATIONS
  const formSchema = useCallback((): yup.ObjectSchema => {
    return yup.object().shape({
      ...LeaseFormSchema(t),
    });
  }, [t]);
  // FORM VALIDATIONS END

  if (!leaseData) return <Loader visible />;
  const { currency, leaseEndDate, leaseStartDate } = leaseData;

  return (
    <UserScreen title={t('assetMore:more')} pageTitle={t('property:editLeaseTerm')} onBackPress={navigation.goBack}>
      <View style={styles.container}>
        <Avatar fullName={user?.name ?? ''} designation="Tenant" />
        <Divider containerStyles={styles.divider} />
      </View>
      <Formik
        initialValues={{ ...formattedValues(leaseData) }}
        onSubmit={onSubmit}
        validate={FormUtils.validate(formSchema)}
      >
        {(formProps: FormikProps<IFormData>): React.ReactElement => {
          return (
            <>
              <LeaseTermForm
                isTitleRequired={false}
                isFromEdit
                formProps={formProps}
                currencyData={currency}
                assetGroupType={assetGroup}
                leaseEndDate={leaseEndDate}
                leaseStartDate={leaseStartDate}
              />
              <FormButton
                title={t('common:update')}
                type="primary"
                formProps={formProps}
                // @ts-ignore
                onPress={formProps.handleSubmit}
                containerStyle={styles.button}
              />
            </>
          );
        }}
      </Formik>
    </UserScreen>
  );
};

export default UpdateLeaseTerm;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 22,
  },
  divider: {
    marginTop: 14,
    borderColor: theme.colors.background,
  },
  button: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
});
