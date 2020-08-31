import React, { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button, Divider, Image, PricePerUnit, Text } from '@homzhub/common/src/components';

interface IPropertyDuesData {
  propertyName: string;
  address: string;
  dueCategory: string;
  price: number;
  currency_symbol: string;
}

interface IProps {
  propertyDues: IPropertyDuesData[];
  totalDue: number;
  currency: string;
}

export const PropertyDuesCardContainer = ({ ...props }: IProps): ReactElement => {
  const { totalDue, currency, propertyDues } = props;
  const { t } = useTranslation();

  // TODO(Sriram-2020.08.21) Change the below dues icon to a desired icon
  return (
    <View style={styles.containerStyle}>
      <View style={styles.heading}>
        <View style={styles.duesText}>
          <Icon style={styles.walletIconStyle} name={icons.wallet} size={20} />
          <Text type="regular" textType="semiBold">
            {t('assetDashboard:dues')}
          </Text>
        </View>
        <PricePerUnit textStyle={styles.dueStyle} priceTransformation={false} currency={currency} price={totalDue} />
      </View>
      <Divider />
      <View style={styles.propertyDuesContainer}>{renderPropertyDues(propertyDues, t)}</View>
    </View>
  );
};

const renderPropertyDues = (propertyDues: IPropertyDuesData[], t: TFunction): ReactNode => {
  return propertyDues.map((property, index) => {
    const { propertyName, address, dueCategory, price, currency_symbol } = property;

    return (
      <>
        <View style={styles.propertyName}>
          <Image style={styles.flag} source={images.flag} />
          <Text type="regular" textType="semiBold">
            {propertyName}
          </Text>
        </View>
        <Text type="small">{address}</Text>
        <View style={styles.dueContainer}>
          <View>
            <Text type="small">{dueCategory}</Text>
            <PricePerUnit priceTransformation={false} currency={currency_symbol} price={price} />
          </View>
          <Button
            titleStyle={styles.payNowTitleStyles}
            containerStyle={styles.payNowBtnStyles}
            type="primary"
            title={t('assetFinancial:payNow')}
          />
        </View>
        {index !== propertyDues.length - 1 ? <Divider containerStyles={styles.dividerStyles} /> : null}
      </>
    );
  });
};

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
  },
  duesText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueStyle: {
    color: theme.colors.danger,
  },
  propertyDuesContainer: {
    padding: 16,
  },
  dividerStyles: {
    marginVertical: 24,
  },
  heading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  flag: {
    marginRight: 6,
  },
  propertyName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  payNowBtnStyles: {
    marginLeft: 60,
  },
  payNowTitleStyles: {
    flexDirection: 'row',
  },
  walletIconStyle: {
    marginRight: 10,
  },
});
