import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import PromoCode from '@homzhub/mobile/src/components/molecules/PromoCode';
import { PaymentGateway } from '@homzhub/mobile/src/components/molecules/PaymentGateway';

interface IPaymentProps {
  handleNextStep: () => void;
}

export const PropertyPayment = (props: IPaymentProps): React.ReactElement => {
  return (
    <View style={styles.container}>
      <PromoCode />
      <PaymentGateway type="primary" title="Pay Now" onPaymentSuccess={FunctionUtils.noop} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
