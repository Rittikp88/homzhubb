import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import PropertyCard from '@homzhub/common/src/components/molecules/PropertyCard';
import { PropertyImages } from '@homzhub/common/src/components/organisms/PropertyImages';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IPropertyImageParam } from '@homzhub/mobile/src/navigation/interfaces';

const AddPropertyImage = (): React.ReactElement => {
  const { params } = useRoute();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const { assetById } = useSelector(AssetSelectors.getAssetLoaders);
  const asset: Asset | null = useSelector(AssetSelectors.getAssetById);

  useEffect(() => {
    const param = params as IPropertyImageParam;
    dispatch(AssetActions.getAssetById(param.assetId));
  }, []);

  return (
    <>
      <Screen isLoading={assetById} headerProps={{ title: t('property:addPropertyImages'), onIconPress: goBack }}>
        {asset ? (
          <>
            <PropertyCard asset={asset} isIcon={false} containerStyle={styles.propertyContainer} />
            <Text type="small" textType="semiBold">
              {t('property:gallery')}
            </Text>
            <PropertyImages
              propertyId={asset.id}
              selectedImages={asset.attachments}
              onPressContinue={FunctionUtils.noop}
              onUploadImage={FunctionUtils.noop}
              setSelectedImages={FunctionUtils.noop}
              containerStyle={styles.imageContainer}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </Screen>
      <WithShadowView isBottomShadow={false}>
        <Button
          type="primary"
          title={t('common:continue')}
          containerStyle={styles.buttonContainer}
          onPress={FunctionUtils.noop}
        />
      </WithShadowView>
    </>
  );
};

export default AddPropertyImage;

const styles = StyleSheet.create({
  propertyContainer: {
    backgroundColor: theme.colors.white,
    padding: 16,
    marginVertical: 16,
  },
  imageContainer: {
    marginHorizontal: 0,
    marginTop: 12,
  },
  buttonContainer: {
    flex: 0,
    marginHorizontal: 16,
    marginVertical: 12,
  },
});
