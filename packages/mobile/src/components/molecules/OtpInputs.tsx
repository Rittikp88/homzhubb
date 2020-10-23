import React from 'react';
import RNOtpVerify from 'react-native-otp-verify';
import { Keyboard, NativeSyntheticEvent, StyleSheet, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

export enum OtpTypes {
  Phone = 'Phone',
  Email = 'Email',
}

interface IProps {
  error?: string;
  otpType?: OtpTypes;
  bubbleOtp: (otp: string, otpType?: OtpTypes) => void;
  toggleError: () => void;
}

interface IState {
  otp: string[];
  currentFocus: number;
}

export class OtpInputs extends React.PureComponent<IProps, IState> {
  private OtpLength: number = ConfigHelper.getOtpLength();
  private isSMSListenerEnabled = false;
  private OtpTextInput: TextInput[] = [];

  public state = {
    otp: Array(this.OtpLength).fill(''),
    currentFocus: 0,
  };

  public componentDidMount = async (): Promise<void> => {
    this.OtpTextInput[0].setNativeProps({ style: styles.active });

    if (this.isSMSListenerEnabled) {
      this.isSMSListenerEnabled = await RNOtpVerify.getOtp();
      RNOtpVerify.addListener(this.otpHandler);
    }
  };

  public componentDidUpdate(prevProps: IProps, prevState: IState): void {
    const { error } = this.props;
    if (!!prevProps.error && !error) {
      this.OtpTextInput[0].setNativeProps({ style: styles.active });
    }
  }

  public componentWillUnmount = (): void => {
    if (this.isSMSListenerEnabled) {
      RNOtpVerify.removeListener();
    }
  };

  public render = (): React.ReactNode => {
    const { error } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.otpBoxContainer}>{this.renderInputs()}</View>
        {error && (
          <Label type="regular" style={styles.errorText}>
            {error}
          </Label>
        )}
      </View>
    );
  };

  private renderInputs = (): React.ReactNode => {
    const { error } = this.props;
    const { otp, currentFocus } = this.state;
    const inputs = Array(this.OtpLength).fill(0);

    return inputs.map((counter: number, index: number) => {
      const onChangeText = (value: string): void => {
        if (!/\d/.test(value)) {
          return;
        }
        this.focusNext(index, value);
      };

      const onKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>): void => {
        this.focusPrevious(event.nativeEvent.key, index);
      };

      let style = styles.textInput;
      if (error) {
        style = { ...styles.textInput, ...styles.error };
      }

      return (
        <View key={`${index}-otp`} pointerEvents={currentFocus === index ? 'auto' : 'none'}>
          <TextInput
            key={`${index}-otp`}
            caretHidden
            textContentType="oneTimeCode"
            value={otp[index]}
            autoFocus={index === 0}
            keyboardType="number-pad"
            maxLength={1}
            style={style}
            onChangeText={onChangeText}
            onKeyPress={onKeyPress}
            testID="otpInput"
            ref={(ref): void => {
              this.OtpTextInput[index] = ref!;
            }}
          />
        </View>
      );
    });
  };

  private focusPrevious = (key: string, index: number): void => {
    const { error, toggleError } = this.props;
    const { otp }: { otp: string[] } = this.state;
    otp[index] = '';

    if (key === 'Backspace' && index !== 0) {
      this.setState({ otp: [...otp], currentFocus: index - 1 }, () => {
        this.OtpTextInput[index - 1].focus();
        this.OtpTextInput[index].setNativeProps({ style: styles.textInput });
      });
      return;
    }

    if (error) {
      toggleError();
    }
    this.setState({ otp: [...otp] });
  };

  private focusNext = (index: number, value: string): void => {
    const { bubbleOtp } = this.props;
    const { otp }: { otp: string[] } = this.state;
    let currentFocus = index;
    otp[index] = value;

    if (index < this.OtpTextInput.length - 1) {
      currentFocus = index + 1;
      this.OtpTextInput[index + 1].focus();
      this.OtpTextInput[index + 1].setNativeProps({ style: styles.active });
    }

    if (index === this.OtpTextInput.length - 1) {
      this.OtpTextInput[index].blur();
      bubbleOtp(otp.join(''));
    }
    this.setState({ otp: [...otp], currentFocus });
  };

  private otpHandler = (message: string): void => {
    const regexLiteral = new RegExp(`\\d{${this.OtpLength}}`, 'g');
    const otpCode: string[] | null = regexLiteral.exec(message);
    const { bubbleOtp } = this.props;

    if (!otpCode || (otpCode && otpCode[0].length !== this.OtpLength)) {
      return;
    }

    this.setState({ otp: Array.from(otpCode[0]), currentFocus: 5 });
    this.OtpTextInput.forEach((inputRef, index: number) => {
      inputRef.setNativeProps({ style: styles.active });
      if (index === 5) {
        inputRef.focus();
      }
    });

    bubbleOtp(otpCode[0]);
    Keyboard.dismiss();
    if (this.isSMSListenerEnabled) {
      RNOtpVerify.removeListener();
    }
  };
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  otpBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 4,
    height: 48,
    width: 48,
    borderColor: theme.colors.disabled,
  },
  errorText: {
    marginTop: 8,
    color: theme.colors.error,
  },
  active: {
    borderColor: theme.colors.active,
  },
  error: {
    borderColor: theme.colors.error,
  },
});
