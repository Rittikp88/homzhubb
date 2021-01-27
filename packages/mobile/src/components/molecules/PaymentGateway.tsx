import React from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { IPaymentParams, PaymentFailureResponse } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, IButtonProps } from '@homzhub/common/src/components/atoms/Button';
import { Loader } from '@homzhub/mobile/src/components/atoms/Loader';
import { Payment } from '@homzhub/common/src/domain/models/Payment';

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
  error?: {
    description: string;
  }
}

interface IProps extends IButtonProps {
  initiatePayment: () => Promise<Payment>;
  paymentApi: (paymentSuccessData: IPaymentParams) => void;
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
    const { paymentApi } = this.props;
    const {
      description,
      name,
      currency,
      amount,
      prefill,
      notes,
      orderId: order_id,
      paymentTransactionId: payment_transaction_id,
      userInvoiceId: user_invoice_id,
    } = paymentDetails;

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
      .then(paymentApi)
      .catch((error: IRazorPayError) => {
        paymentApi({
          error_code: this.getErrorResponse(error.code),
          payment_transaction_id,
          user_invoice_id,
        });
        if(this.getErrorResponse(error.code) === PaymentFailureResponse.PAYMENT_CANCELLED && error.error) {
          AlertHelper.error({ message: error.error.description });
        } else {
          AlertHelper.error({ message: error.description });
        }
      });
  };

  // eslint-disable-next-line consistent-return
  private getErrorResponse = (errorCode: number): PaymentFailureResponse | undefined => {
    if ((PlatformUtils.isAndroid && errorCode === 0) || (PlatformUtils.isIOS && errorCode === 2)) {
      return PaymentFailureResponse.PAYMENT_CANCELLED;
    }
  };
}

const styles = StyleSheet.create({
  button: {
    flex: 0,
    marginHorizontal: 16,
  },
});
