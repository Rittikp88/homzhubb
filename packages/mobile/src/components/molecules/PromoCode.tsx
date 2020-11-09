import React, { PureComponent } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button, Label, Text } from '@homzhub/common/src/components';
import { Promo } from '@homzhub/common/src/domain/models/OrderSummary';

interface IPromoProps {
  isError?: boolean;
  promo: Promo;
  onClear: () => void;
  onApplyPromo: (code: string) => void;
}
type Props = IPromoProps & WithTranslation;

interface IPromoState {
  promoCode: string;
}

class PromoCode extends PureComponent<Props, IPromoState> {
  public state = {
    promoCode: '',
  };

  public render(): React.ReactNode {
    const { t, isError, onApplyPromo, promo } = this.props;
    const { promoCode } = this.state;
    const isPromoApplied = promo?.promoApplied ?? false;
    const value = isPromoApplied ? `${promoCode} Applied!` : promoCode;
    return (
      <View style={styles.container}>
        <Text type="small" style={styles.title}>
          {t('havePromoCode')}
        </Text>
        <View style={styles.textInputContainer}>
          <TextInput
            value={value}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={t('promoPlaceholder')}
            numberOfLines={1}
            onChangeText={this.handlePromoChange}
            editable={!isPromoApplied}
            style={[styles.textInput, isPromoApplied && { color: theme.colors.green }]}
          />
          {isPromoApplied ? (
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
              onPress={(): void => onApplyPromo(promoCode)}
            />
          )}
        </View>
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
    onApplyPromo('');
    this.setState({
      promoCode: '',
    });
  };

  private handlePromoChange = (text: string): void => {
    const { onClear } = this.props;
    onClear();
    this.setState({ promoCode: text });
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
