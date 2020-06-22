import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from '@homzhub/common/src/components';
import { PaymentSuccess } from '@homzhub/mobile/src/components/organisms/PaymentSuccess';
import { MarkdownType } from '@homzhub/mobile/src/navigation/interfaces';

interface IPaymentProps {
  onPayNow: () => void;
  isSuccess: boolean;
  navigateToPropertyHelper: (markdownKey: MarkdownType) => void;
}

export const PropertyPayment = (props: IPaymentProps): React.ReactElement => {
  const { isSuccess, onPayNow, navigateToPropertyHelper } = props;
  return (
    <>
      {isSuccess ? (
        <PaymentSuccess onClickLink={navigateToPropertyHelper} />
      ) : (
        <Button type="primary" title="Pay Now" containerStyle={styles.buttonStyle} onPress={onPayNow} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});