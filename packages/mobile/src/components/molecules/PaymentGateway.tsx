import React from 'react';
// @ts-ignore
import RazorpayCheckout from 'react-native-razorpay';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';
import { Button, IButtonProps } from '@homzhub/common/src/components';

let options = {
  name: 'Title',
  description: 'Some random description',
  image: images.landingScreenLogo,
  key: ConfigHelper.getRazorApiKey(),
  method: {
    netbanking: true,
    card: true,
    upi: true,
    wallet: true,
  },
  theme: { color: theme.colors.primaryColor },
  /* Dynamic content */
  currency: 'INR',
  amount: '100',
  prefill: {
    email: 'gaurav.kumar@example.com',
    name: 'Abc Xyz',
    contact: '9999999998',
  },
};

export interface IPersonalData {
  email: string;
  name: string;
  contact?: string;
}

interface IProps extends IButtonProps, WithTranslation {
  amount: number;
  currency?: string;
  personalData?: IPersonalData;
  onPaymentSuccess: () => void;
  onPaymentFailure?: (error: any) => void;
}

class PaymentGateway extends React.PureComponent<IProps> {
  public componentDidMount(): void {
    const { t, amount } = this.props;
    options = {
      ...options,
      ...{
        name: t('homzhub'),
        image: images.landingScreenLogo,
        description: t('description'),
        amount: (amount * 100).toString(),
      },
    };
  }

  public render = (): React.ReactElement => {
    const { ...buttonProps } = this.props;

    return <Button {...buttonProps} onPress={this.onPress} />;
  };

  private onPress = (): void => {
    const { onPaymentFailure } = this.props;

    RazorpayCheckout.open(options)
      .then((successInfo: any): void => {
        this.onPaymentSuccess(successInfo);
      })
      .catch((error: any) => {
        // TODO (Sriram 2020.09.04) Change this message */
        AlertHelper.error({ message: 'Authentication failed due to incorrect otp' });
        if (onPaymentFailure) {
          onPaymentFailure(error);
        }
      });
  };

  private onPaymentSuccess = (successInfo?: any): void => {
    const { onPaymentSuccess } = this.props;
    /* Make an API call here */

    onPaymentSuccess();
  };
}

const paymentGateway = withTranslation()(PaymentGateway);
export { paymentGateway as PaymentGateway };
