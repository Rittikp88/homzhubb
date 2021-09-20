import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import TabCard from '@homzhub/common/src/components/molecules/TabCard';
import { IRoutes, PropertyPaymentRoutes } from '@homzhub/common/src/constants/Tabs';

const PropertyServices = (): React.ReactElement => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const asset = useSelector(PropertyPaymentSelector.getSelectedAsset);
  const { activeAssets } = useSelector(AssetSelectors.getAssetLoaders);

  const handleTabNavigation = (): void => {
    // TODO: (Shikha) - Handle Tab Navigation
  };

  const renderItem = ({ item }: { item: IRoutes }): React.ReactElement => {
    return (
      <TabCard
        title={item.title}
        icon={item.icon}
        iconColor={item.color}
        onPressCard={handleTabNavigation}
        containerStyle={styles.item}
      />
    );
  };

  const keyExtractor = (item: IRoutes): string => item.key.toString();

  return (
    <UserScreen
      title={t('propertyPayment:propertyPayment')}
      pageTitle={t('propertyPayment:paymentServices')}
      isGradient
      isBackgroundRequired
      onBackPress={goBack}
      loading={activeAssets}
      backgroundColor={theme.colors.background}
      headerStyle={styles.header}
    >
      <View style={styles.container}>
        <Text type="small" textType="semiBold">
          {t('propertyPayment:chooseService')}
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
