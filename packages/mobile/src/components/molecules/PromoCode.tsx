import React, { PureComponent } from 'react';
import { StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { FormikProps } from 'formik';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';

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
}
type Props = IPromoProps & WithTranslation;

interface IPromoState {
  promoCode: string;
  showTextInput: boolean;
}

class PromoCode extends PureComponent<Props, IPromoState> {
  public state = {
    promoCode: '',
    showTextInput: false,
  };

  public render(): React.ReactNode {
    const { t, isError, isPromoApplied = false, containerStyles, inputStyles, type, formDetails, code } = this.props;
    const { promoCode, showTextInput } = this.state;
    const value = isPromoApplied ? `${promoCode} Applied!` : promoCode;
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
            type="large"
          >
            {t('auth:haveReferralCodeText')}
          </Label>
        )}
        {showTextField && (
          <View style={styles.textInputContainer}>
            <TextInput
              value={type === 'link' ? formDetails?.formProps.values[formDetails?.name] : value}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder={type === 'regular' ? t('promoPlaceholder') : t('auth:referralCodePlaceholder')}
              numberOfLines={1}
              onChangeText={this.handlePromoChange}
              editable={!isPromoApplied}
              style={[styles.textInput, isPromoApplied && { color: theme.colors.green }, inputStyles]}
            />
            {isPromoApplied || type === 'link' ? (
              <Button
                type="primary"
                icon={icons.circularCrossFilled}
                iconSize={20}
                iconColor={theme.colors.darkTint8}
                containerStyle={styles.iconButton}
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
          </View>
        )}
        {isError && (
          <Label type="regular" textType="semiBold" style={styles.errorMsg}>
            {t('promoError')}
          </Label>
        )}
      </View>
    );
  }

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
    this.setFieldValue(text);
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
});
