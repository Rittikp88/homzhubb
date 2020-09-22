import { Keyboard } from 'react-native';
import { hideMessage, showMessage } from 'react-native-flash-message';
import { theme } from '@homzhub/common/src/styles/theme';

export interface IToastProps {
  message: string;
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
      autoHide: false,
      message,
      type: 'danger',
      backgroundColor: theme.colors.error,
    });
  };

  public dismiss(): void {
    hideMessage();
  }
}

const alertHelper = new AlertHelper();
export { alertHelper as AlertHelper };
