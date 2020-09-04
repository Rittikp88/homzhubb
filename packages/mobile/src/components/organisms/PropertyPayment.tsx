import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@homzhub/common/src/components';
import { PaymentGateway, IPersonalData } from '@homzhub/mobile/src/components';

interface IPaymentProps {
  amount?: string;
  currency?: string;
  personalData?: IPersonalData;
  onPaymentSuccess: () => void;
  testID?: string;
}

export const PropertyPayment = (props: IPaymentProps): React.ReactElement => {
  const { onPaymentSuccess } = props;
  return (
    <>
      <Text type="large">Pay Rs. 1000</Text>
      <PaymentGateway
        type="primary"
        title="Pay Now"
        containerStyle={styles.buttonStyle}
        onPaymentSuccess={onPaymentSuccess}
      />
    </>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
