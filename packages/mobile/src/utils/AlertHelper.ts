import { Alert, Keyboard } from 'react-native';
import { hideMessage, showMessage } from 'react-native-flash-message';
import { theme } from '@homzhub/common/src/styles/theme';

export interface IToastProps {
  message: string;
}

export interface IAlertProps {
  title: string;
  message: string;
  onOkay: () => void;
  onCancel?: () => void;
}

class AlertHelper {
  public success = (options: IToastProps): void => {
    const { message } = options;
    showMessage({
      message,
      type: 'success',
      backgroundColor: theme.colors.success,
    });
  };

  public error = (options: IToastProps): void => {
    Keyboard.dismiss();
    const { message } = options;
    showMessage({
      duration: 5000,
      message,
      type: 'danger',
      backgroundColor: theme.colors.error,
    });
  };

  public info = (options: IToastProps): void => {
    Keyboard.dismiss();
    const { message } = options;
    showMessage({
      duration: 5000,
      message,
      type: 'info',
      backgroundColor: theme.colors.alertInfo,
    });
  };

  public dismiss(): void {
    hideMessage();
  }

  public alert = (options: IAlertProps): void => {
    const { title, message, onOkay, onCancel } = options;
    Alert.alert(
      title,
      message,
      [
        { text: 'OK', onPress: onOkay },
        {
          text: 'Cancel',
          onPress: onCancel,
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };
}

const alertHelper = new AlertHelper();
export { alertHelper as AlertHelper };
