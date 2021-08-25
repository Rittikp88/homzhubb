import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { PanNumber } from '@homzhub/common/src/domain/models/PanNumber';
import { IBankAccountPayload } from '@homzhub/common/src/domain/repositories/interfaces';

interface IOwnProps {
  onSubmit?: () => void;
  userId: number;
  setLoading: (loading: boolean) => void;
  isEditFlow: boolean;
}
interface IBankAccount {
  beneficiaryName: string;
  bankName: string;
  ifscCode: string;
  bankAccNum: string;
  confirmBankAccNum: string;
  panNumber: string;
}

const AddBankAccountForm = ({ onSubmit, userId, setLoading, isEditFlow }: IOwnProps): React.ReactElement => {
  const { t } = useTranslation();
  const [panDetail, setPanDetail] = useState(new PanNumber());
  const currentBankId = useSelector(UserSelector.getCurrentBankId);
  const currentBank = useSelector(UserSelector.getCurrentBankAccountSelected);

  const getInitialData = (): IBankAccount => {
    if (isEditFlow && currentBank) {
      const { beneficiaryName, bankName, ifscCode, panNumber, accountNumber } = currentBank;
      const prefilledData: IBankAccount = {
        beneficiaryName,
        bankName,
        ifscCode,
        bankAccNum: accountNumber,
        confirmBankAccNum: '',
        panNumber: panNumber ?? '',
      };
      return prefilledData;
    }
    const emptyData: IBankAccount = {
      beneficiaryName: '',
      bankName: '',
      ifscCode: '',
      bankAccNum: '',
      confirmBankAccNum: '',
      panNumber: panDetail.panNumber,
    };
    return emptyData;
  };

  const fetchPanDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await UserRepository.getPanDetails(userId);
      setPanDetail(response);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  useEffect(() => {
    fetchPanDetails().then();
  }, []);

  const formSchema = (): yup.ObjectSchema<IBankAccount> => {
    return yup.object().shape({
      beneficiaryName: yup.string().required(t('moreProfile:fieldRequiredError')),
      bankName: yup.string().required(t('moreProfile:fieldRequiredError')),
      ifscCode: yup
        .string()
        .required(t('moreProfile:fieldRequiredError'))
        .test({
          name: 'hasIfscTest',
          message: t('assetFinancial:ifscFormatError'),
          test(ifsc: string) {
            if (ifsc.length > 0) return StringUtils.isValidIfsc(ifsc);
            return true;
          },
        }),
      bankAccNum: yup.string().required(t('moreProfile:fieldRequiredError')),
      confirmBankAccNum: yup.string().test({
        name: 'confirmBankAccNumTest',
        exclusive: true,
        message: t('assetFinancial:accNumMismatch'),
        test(confirmBankAccNum: string) {
          // eslint-disable-next-line react/no-this-in-sfc
          const { bankAccNum } = this.parent;
          return confirmBankAccNum === bankAccNum;
        },
      }),
      panNumber: yup.string().test({
        name: 'hasIfscTest',
        message: t('assetFinancial:panFormatError'),
        test(pan: string) {
          return pan.length > 0 ? StringUtils.isValidPan(pan) : true;
        },
      }),
    });
  };

  const onFormSubmit = async (values: IBankAccount): Promise<void> => {
    const { beneficiaryName, bankName, bankAccNum, ifscCode, panNumber } = values;
    try {
      setLoading(true);
      const payload = {
        beneficiary_name: beneficiaryName,
        bank_name: bankName,
        account_number: bankAccNum,
        pan_number: panNumber.length > 0 ? panNumber : undefined,
        ifsc_code: ifscCode,
      } as IBankAccountPayload;
      if (isEditFlow && currentBankId !== -1) {
        await UserRepository.editBankDetails(userId, currentBankId, payload);
        AlertHelper.success({ message: t('assetFinancial:bankAccountEditedSuccessfully') });
      } else {
        await UserRepository.addBankDetails(userId, payload);
        AlertHelper.success({ message: t('assetFinancial:addBankDetailsSuccess') });
      }
      setLoading(false);
      if (onSubmit) onSubmit();
    } catch (e) {
      setLoading(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  return (
    <Formik
      initialValues={getInitialData()}
      onSubmit={onFormSubmit}
      validate={FormUtils.validate(formSchema)}
      enableReinitialize
    >
      {(formProps): React.ReactNode => {
        return (
          <>
            <FormTextInput
              formProps={formProps}
              inputType="default"
              name="beneficiaryName"
              label={t('assetFinancial:beneficiaryName')}
              placeholder={t('assetFinancial:enterBeneficiaryName')}
              fontWeightType="semiBold"
            />
            <FormTextInput
              formProps={formProps}
              inputType="default"
              name="bankName"
              label={t('assetFinancial:bankName')}
              placeholder={t('assetFinancial:enterBankName')}
              fontWeightType="semiBold"
            />
            <FormTextInput
              formProps={formProps}
              inputType="default"
              name="ifscCode"
              label={t('assetFinancial:ifscCode')}
              placeholder={t('assetFinancial:ifscCode')}
              fontWeightType="semiBold"
            />
            <FormTextInput
              formProps={formProps}
              inputType="default"
              name="bankAccNum"
              label={t('assetFinancial:bankAccountNumber')}
              placeholder={t('assetFinancial:bankAccountNumber')}
              fontWeightType="semiBold"
              secureTextEntry
            />
            <FormTextInput
              formProps={formProps}
              inputType="default"
              name="confirmBankAccNum"
              label={t('assetFinancial:confirmBankAccountNumber')}
              placeholder={t('assetFinancial:confirmBankAccountNumber')}
              fontWeightType="semiBold"
            />
            <FormTextInput
              formProps={formProps}
              inputType="default"
              name="panNumber"
              label={t('assetFinancial:panNumber')}
              placeholder={t('assetFinancial:enterPanNumber')}
              fontWeightType="semiBold"
              optionalText={t('common:optional')}
              editable={panDetail.canEdit}
            />
            <FormButton
              // @ts-ignore
              onPress={formProps.handleSubmit}
              formProps={formProps}
              type="primary"
              title={isEditFlow && currentBank ? t('assetFinancial:updateDetails') : t('assetFinancial:addBankAccount')}
              containerStyle={styles.button}
              disabled={isEqual(formProps.values, getInitialData())}
            />
          </>
        );
      }}
    </Formik>
  );
};
export default AddBankAccountForm;
const styles = StyleSheet.create({
  button: {
    marginVertical: 30,
  },
});
