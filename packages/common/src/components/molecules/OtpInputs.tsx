import React from 'react';
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components';

interface IProps {
  error?: string;
  bubbleOtp: (otp: string) => void;
}

interface IState {
  otp: string[];
  currentFocus: number;
}

export class OtpInputs extends React.PureComponent<IProps, IState> {
  private otpTextInput: TextInput[] = [];

  public state = {
    otp: Array(6).fill(''),
    currentFocus: 0,
  };

  public componentDidMount(): void {
    this.otpTextInput[0].setNativeProps({ style: styles.active });
  }

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
    const inputs = Array(6).fill(0);

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
            value={otp[index]}
            autoFocus={index === 0}
            keyboardType="number-pad"
            maxLength={1}
            style={style}
            onChangeText={onChangeText}
            onKeyPress={onKeyPress}
            ref={(ref): void => {
              this.otpTextInput[index] = ref!;
            }}
          />
        </View>
      );
    });
  };

  private focusPrevious = (key: string, index: number): void => {
    const { otp }: { otp: string[] } = this.state;
    otp[index] = '';

    if (key === 'Backspace' && index !== 0) {
      this.setState({ otp: [...otp], currentFocus: index - 1 }, () => {
        this.otpTextInput[index - 1].focus();
        this.otpTextInput[index].setNativeProps({ style: styles.textInput });
      });
      return;
    }

    this.setState({ otp: [...otp] });
  };

  private focusNext = (index: number, value: string): void => {
    const { bubbleOtp } = this.props;
    const { otp }: { otp: string[] } = this.state;
    let currentFocus = index;
    otp[index] = value;

    if (index < this.otpTextInput.length - 1) {
      currentFocus = index + 1;
      this.otpTextInput[index + 1].focus();
      this.otpTextInput[index + 1].setNativeProps({ style: styles.active });
    }

    if (index === this.otpTextInput.length - 1) {
      this.otpTextInput[index].blur();
      bubbleOtp(otp.join(''));
    }
    this.setState({ otp: [...otp], currentFocus });
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
    paddingHorizontal: 14,
    paddingVertical: 12,
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
