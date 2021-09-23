import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import AddBankAccountForm from '@homzhub/common/src/components/organisms/AddBankAccountForm';
import { ISocietyPayload } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  onSubmit: () => void;
  isTermsAccepted: boolean;
  onSubmitSuccess: () => void;
}

const AddSocietyBank = ({ onSubmit, isTermsAccepted, onSubmitSuccess }: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const societyData = useSelector(PropertyPaymentSelector.getSocietyFormData);
  const bankData = useSelector(PropertyPaymentSelector.getSocietyBankData);
  const asset = useSelector(PropertyPaymentSelector.getSelectedAsset);

  useEffect(() => {
    handleSocietySubmit();
  }, [isTermsAccepted]);

  const onPressSubmit = (): void => {
    if (asset.society) {
      // TODO: (Shikha) - Handle Update Call;
      onSubmitSuccess();
      return;
    }
    onSubmit();
  };

  const handleSocietySubmit = (): void => {
    if (isTermsAccepted && asset.project && bankData) {
      const payload: ISocietyPayload = {
        name: societyData.societyName,
        asset: asset.id,
        project: asset.project.id,
        contact_email: societyData.email,
        contact_name: societyData.name,
        contact_number: societyData.contactNumber,
        society_bank_info: bankData,
        is_terms_accepted: isTermsAccepted,
      };
      dispatch(PropertyPaymentActions.createSociety(payload));
      onSubmitSuccess();
    }
  };

  return (
    <View style={styles.container}>
      <AddBankAccountForm isSocietyAccount onSubmit={onPressSubmit} />
    </View>
  );
};

export default AddSocietyBank;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
});
