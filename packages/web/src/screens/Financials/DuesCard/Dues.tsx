import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { ITypographyProps } from '@homzhub/common/src/components/atoms/Typography';

const Dues = (): React.ReactElement => {
  const { t } = useTranslation();
  const addressTextStyle: ITypographyProps = {
    size: 'small',
    fontWeight: 'semiBold',
    variant: 'text',
  };
  const subAddressTextStyle: ITypographyProps = {
    size: 'regular',
    fontWeight: 'regular',
    variant: 'label',
  };
  return (
    <>
      <Divider containerStyles={styles.divider} />
      <View style={styles.container}>
        <View style={styles.propertyDetails}>
          <PropertyAddressCountry
            primaryAddress="2BHK - Godrej Prime"
            countryFlag="https://www.countryflags.io/IN/flat/48.png"
            primaryAddressTextStyles={addressTextStyle}
            subAddressTextStyles={subAddressTextStyle}
            subAddress="Sindhi Society, Chembur, Mumbai- 400071"
          />
        </View>
        <View style={styles.actions}>
          <View style={styles.charges}>
            <Text type="small" textType="semiBold" style={styles.text}>
              {t('assetFinancial:plumbingFees')}
            </Text>
            <Text type="small" textType="semiBold" style={styles.amount}>
              $1900
            </Text>
          </View>
          <Button
            title={t('assetFinancial:payNow')}
            type="primary"
            containerStyle={styles.button}
            titleStyle={styles.buttonTitle}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', margin: 12 },
  propertyDetails: { width: 400 },
  actions: { flexDirection: 'row' },
  buttonTitle: { width: 100, margin: 0 },
  text: { color: theme.colors.darkTint3 },
  button: { width: 107, height: 32, alignItems: 'center', justifyContent: 'center' },
  charges: { marginRight: 40 },
  amount: { color: theme.colors.darkTint3 },
  divider: { borderColor: theme.colors.background },
});
export default Dues;
