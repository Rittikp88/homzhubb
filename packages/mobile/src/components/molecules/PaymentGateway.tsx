import React from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, IButtonProps } from '@homzhub/common/src/components/atoms/Button';
import { Loader } from '@homzhub/mobile/src/components/atoms/Loader';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { IPaymentSuccess } from '@homzhub/common/src/domain/repositories/interfaces';

let options = {
  image: '',
  key: ConfigHelper.getRazorApiKey(),
  theme: { color: theme.colors.primaryColor },
  method: {
    netbanking: true,
    card: true,
    upi: true,
    wallet: true,
  },
};

interface IRazorPayError {
  code: number;
  description: string;
}

interface IProps extends IButtonProps {
  initiatePayment: () => Promise<Payment>;
  onPaymentSuccess: (paymentSuccessData: IPaymentSuccess) => void;
  onPaymentFailure?: (error: IRazorPayError) => void;
}

interface IOwnState {
  loading: boolean;
}

export class PaymentGateway extends React.PureComponent<IProps, IOwnState> {
  public state = {
    loading: false,
  };

  public render = (): React.ReactElement => {
    const { loading } = this.state;
    return (
      <>
        <Button {...this.props} onPress={this.onPress} containerStyle={styles.button} />
        <Loader visible={loading} />
      </>
    );
  };

  private onPress = (): void => {
    const { initiatePayment } = this.props;

    this.setState({ loading: true });
    initiatePayment()
      .then(this.onPayment)
      .catch((e) => {
        this.setState({ loading: false });
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  private onPayment = (paymentDetails: Payment): void => {
    const { onPaymentFailure, onPaymentSuccess } = this.props;
    const { description, name, currency, amount, prefill, notes, orderId: order_id } = paymentDetails;

    options = {
      ...options,
      ...{
        name,
        description,
        currency,
        amount,
        order_id,
        prefill: ObjectMapper.serialize(prefill),
        notes: ObjectMapper.serialize(notes),
      },
    };

    this.setState({ loading: false });
    RazorpayCheckout.open(options)
      .then(onPaymentSuccess)
      .catch((error: IRazorPayError) => {
        if (onPaymentFailure) {
          onPaymentFailure(error);
        }
        AlertHelper.error({ message: error.description });
      });
  };
}

const styles = StyleSheet.create({
  button: {
    flex: 0,
    marginHorizontal: 16,
  },
});
