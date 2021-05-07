import React, { PureComponent, ReactElement } from 'react';
import { StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { FormikProps } from 'formik';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label, Text, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';

interface IFormDetails {
  formProps: FormikProps<any>;
  name: string;
}

interface IPromoProps {
  isError?: boolean;
  isPromoApplied?: boolean;
  onClear?: () => void;
  onApplyPromo?: (code: string) => void;
  formDetails?: IFormDetails;
  code?: string;
  type: 'link' | 'regular';
  containerStyles?: StyleProp<ViewStyle>;
  inputStyles?: StyleProp<TextStyle>;
  shouldShowText?: boolean;
  label?: string;
  textType?: TextSizeType;
}
type Props = IPromoProps & WithTranslation;

interface IPromoState {
  promoCode: string;
  showTextInput: boolean;
}

class PromoCode extends PureComponent<Props, IPromoState> {
  constructor(props: Props) {
    super(props);
    const { shouldShowText } = this.props;
    this.state = {
      promoCode: '',
      showTextInput: shouldShowText ?? false,
    };
  }

  public render(): React.ReactNode {
    const { t, containerStyles, type, code, label, textType } = this.props;
    const { showTextInput } = this.state;
    const showTextField = type === 'regular' || showTextInput || code;

    return (
      <View style={[styles.container, containerStyles]}>
        {type !== 'link' ? (
          <Text type="small" style={styles.title}>
            {t('havePromoCode')}
          </Text>
        ) : (
          <Label
            onPress={this.toggleTextInput}
            style={showTextField ? undefined : { color: theme.colors.primaryColor }}
            type={textType ?? 'large'}
          >
            {label ?? t('auth:haveReferralCodeText')}
          </Label>
        )}
        {type === 'regular' ? this.renderPromoCode() : this.renderReferralCode()}
      </View>
    );
  }

  private renderPromoCode = (): ReactElement => {
    const { t, isError, isPromoApplied = false, inputStyles } = this.props;
    const { promoCode } = this.state;
    const value = isPromoApplied ? `${promoCode} Applied!` : promoCode;
    return (
      <>
        <View style={styles.textInputContainer}>
          <TextInput
            value={value}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={t('promoPlaceholder')}
            numberOfLines={1}
            onChangeText={this.handlePromoChange}
            editable={!isPromoApplied}
            style={[styles.textInput, isPromoApplied && { color: theme.colors.green }, inputStyles]}
          />
          {this.renderButton()}
        </View>
        {isError && (
          <Label type="regular" textType="semiBold" style={styles.errorMsg}>
            {t('promoError')}
          </Label>
        )}
      </>
    );
  };

  private renderReferralCode = (): React.ReactNode => {
    const { t, inputStyles, formDetails, code } = this.props;
    const { showTextInput } = this.state;
    const showTextField = showTextInput || code;

    if (!formDetails) {
      return null;
    }

    return (
      <View style={inputStyles}>
        {showTextField && (
          <FormTextInput
            formProps={formDetails.formProps}
            inputType="default"
            name={formDetails.name}
            placeholder={t('auth:referralCodePlaceholder')}
            numberOfLines={1}
            maxLength={10}
            inputGroupSuffix={this.renderButton()}
          />
        )}
      </View>
    );
  };

  private renderButton = (): React.ReactNode => {
    const { t, isPromoApplied = false, type } = this.props;
    return (
      <>
        {isPromoApplied || type === 'link' ? (
          <Button
            type="primary"
            icon={icons.circularCrossFilled}
            iconSize={20}
            iconColor={theme.colors.darkTint8}
            containerStyle={type === 'regular' ? styles.iconButton : styles.crossIconBgColor}
            onPress={this.onCrossPress}
            testID="btnCross"
          />
        ) : (
          <Button
            type="secondary"
            title={t('apply')}
            containerStyle={styles.button}
            titleStyle={styles.buttonTitle}
            onPress={this.onApplyPress}
          />
        )}
      </>
    );
  };

  private onCrossPress = (): void => {
    const { onApplyPromo } = this.props;
    if (onApplyPromo) {
      onApplyPromo('');
    }
    this.setFieldValue('');
    this.setState({
      promoCode: '',
    });
  };

  private onApplyPress = (): void => {
    const { onApplyPromo } = this.props;
    const { promoCode } = this.state;
    if (onApplyPromo) {
      onApplyPromo(promoCode);
    }
  };

  private handlePromoChange = (text: string): void => {
    const { onClear } = this.props;
    if (onClear) {
      onClear();
    }
    this.setState({ promoCode: text });
  };

  private setFieldValue = (text: string): void => {
    const { formDetails } = this.props;

    if (formDetails) {
      formDetails.formProps.setFieldValue(formDetails.name, text);
    }
  };

  private toggleTextInput = (): void => {
    this.setState({ showTextInput: true });
  };
}

export default withTranslation()(PromoCode);

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  title: {
    color: theme.colors.darkTint4,
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginVertical: 8,
    borderColor: theme.colors.darkTint10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    color: theme.colors.darkTint1,
  },
  button: {
    borderWidth: 0,
    flex: 0,
  },
  buttonTitle: {
    marginVertical: 0,
    marginHorizontal: 16,
    alignSelf: 'flex-end',
  },
  errorMsg: {
    color: theme.colors.error,
  },
  iconButton: {
    backgroundColor: theme.colors.secondaryColor,
    flex: 0,
    marginHorizontal: 16,
  },
  crossIconBgColor: {
    backgroundColor: theme.colors.secondaryColor,
  },
});
