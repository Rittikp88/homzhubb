import React from 'react';
import { StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';

interface IOwnProp {
  onSubmit: () => void;
}

interface IBankAccount {
  beneficiaryName: string;
  bankName: string;
  ifscCode: string;
  bankAccNum: string;
  confirmBankAccNum: string;
  panNumber: string;
}

const initialData: IBankAccount = {
  beneficiaryName: '',
  bankName: '',
  ifscCode: '',
  bankAccNum: '',
  confirmBankAccNum: '',
  panNumber: '',
};

const AddBankAccountForm = ({ onSubmit }: IOwnProp): React.ReactElement => {
  const { t } = useTranslation();

  const formSchema = (): yup.ObjectSchema<IBankAccount> => {
    return yup.object().shape({
      beneficiaryName: yup.string().required(t('moreProfile:fieldRequiredError')),
      bankName: yup.string().required(t('moreProfile:fieldRequiredError')),
      ifscCode: yup.string().required(t('moreProfile:fieldRequiredError')),
      bankAccNum: yup.string().required(t('moreProfile:fieldRequiredError')),
      confirmBankAccNum: yup.string().test({
        name: 'confirmBankAccNumTest',
        exclusive: true,
        message: t('assetFinancial:accNumMismatch'),
        test(confirmBankAccNum: string) {
          // eslint-disable-next-line react/no-this-in-sfc
          const { bankAccNum } = this.parent;
          return parseInt(confirmBankAccNum, 10) === parseInt(bankAccNum, 10);
        },
      }),
      panNumber: yup.string(),
    });
  };

  return (
    <Formik
      initialValues={initialData}
      onSubmit={onSubmit}
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
            />
            {/* Todo (Praharsh) : Add another field if Re-enter PAN feature is finalised */}
            <Divider containerStyles={styles.divider} />

            <FormButton
              // @ts-ignore
              onPress={formProps.handleSubmit}
              formProps={formProps}
              type="primary"
              title={t('assetFinancial:addBankAccount')}
              containerStyle={styles.button}
              disabled={isEqual(formProps.values, initialData)}
            />
          </>
        );
      }}
    </Formik>
  );
};

export default AddBankAccountForm;

const styles = StyleSheet.create({
  field: {
    paddingVertical: 12,
  },
  divider: {
    marginVertical: 20,
    borderColor: theme.colors.darkTint10,
  },
  button: {
    marginBottom: 20,
  },
});
