import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import TabCard from '@homzhub/common/src/components/molecules/TabCard';
import { InvoiceId } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IRoutes, PropertyPaymentRoutes, Tabs } from '@homzhub/common/src/constants/Tabs';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const PropertyServices = (): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.propertyPayment);
  const { goBack, navigate } = useNavigation();
  const dispatch = useDispatch();
  const asset = useSelector(PropertyPaymentSelector.getSelectedAsset);
  const { activeAssets } = useSelector(AssetSelectors.getAssetLoaders);

  useFocusEffect(
    useCallback(() => {
      dispatch(PropertyPaymentActions.clearPaymentData());
      dispatch(PropertyPaymentActions.getUserInvoiceSuccess(new InvoiceId()));
    }, [])
  );

  const handleTabNavigation = (key: Tabs): void => {
    if (key === Tabs.SOCIETY_BILL) {
      navigate(ScreensKeys.SocietyController);
    } else {
      navigate(ScreensKeys.ComingSoonScreen, {
        title: key as string,
        tabHeader: t('propertyPayment'),
      });
    }
  };

  const renderItem = ({ item }: { item: IRoutes }): React.ReactElement => {
    return (
      <TabCard
        title={item.title}
        icon={item.icon}
        iconColor={item.color}
        onPressCard={(): void => handleTabNavigation(item.key)}
        containerStyle={styles.item}
      />
    );
  };

  const keyExtractor = (item: IRoutes): string => item.key.toString();

  return (
    <UserScreen
      title={t('propertyPayment')}
      pageTitle={t('paymentServices')}
      isGradient
      isBackgroundRequired
      onBackPress={goBack}
      loading={activeAssets}
      backgroundColor={theme.colors.background}
      headerStyle={styles.header}
    >
      <View style={styles.container}>
        <Text type="small" textType="semiBold">
          {t('chooseService')}
        </Text>
        <View style={styles.itemContainer}>
          <PropertyAddressCountry
            primaryAddress={asset.projectName}
            subAddress={asset.assetAddress}
            propertyType={asset.assetType.name}
            countryFlag={asset.country.flag}
            // eslint-disable-next-line react-native/no-inline-styles
            primaryAddressTextStyles={{
              size: 'small',
            }}
          />
        </View>
      </View>
      <View style={styles.tabView}>
        <FlatList data={PropertyPaymentRoutes} keyExtractor={keyExtractor} numColumns={3} renderItem={renderItem} />
      </View>
    </UserScreen>
  );
};

export default PropertyServices;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.white,
  },
  tabView: {
    backgroundColor: theme.colors.background,
  },
  itemContainer: {
    borderWidth: 2,
    borderColor: theme.colors.background,
    padding: 16,
    marginVertical: 16,
  },
  item: {
    marginVertical: 30,
    marginHorizontal: 6,
  },
  header: {
    backgroundColor: theme.colors.white,
  },
});
