import React, { PureComponent } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, Label, Text } from '@homzhub/common/src/components';

interface IPromoProps {
  isError?: boolean;
}
type Props = IPromoProps & WithTranslation;

class PromoCode extends PureComponent<Props> {
  public render(): React.ReactNode {
    const { t, isError } = this.props;
    return (
      <View style={styles.container}>
        <Text type="small" style={styles.title}>
          {t('havePromoCode')}
        </Text>
        <View style={styles.textInputContainer}>
          <TextInput
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={t('promoPlaceholder')}
            numberOfLines={1}
            style={styles.textInput}
          />
          <Button
            type="secondary"
            title={t('apply')}
            containerStyle={styles.button}
            titleStyle={styles.buttonTitle}
            onPress={FunctionUtils.noop}
          />
        </View>
        {isError && (
          <Label type="regular" textType="semiBold" style={styles.errorMsg}>
            {t('promoError')}
          </Label>
        )}
      </View>
    );
  }
}

export default withTranslation()(PromoCode);

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  title: {
    color: theme.colors.darkTint4,
  },
  textInputContainer: {
    flex: 1,
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
});
