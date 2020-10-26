import React from 'react';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, IButtonProps } from '@homzhub/common/src/components';
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

export class PaymentGateway extends React.PureComponent<IProps> {
  public render = (): React.ReactElement => <Button {...this.props} onPress={this.onPress} />;

  private onPress = (): void => {
    const { initiatePayment } = this.props;

    initiatePayment()
      .then(this.onPayment)
      .catch((e) => {
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

    RazorpayCheckout.open(options)
      .then(onPaymentSuccess)
      .catch((error: IRazorPayError) => {
        if (onPaymentFailure) {
          onPaymentFailure(error);
        }
      });
  };
}
