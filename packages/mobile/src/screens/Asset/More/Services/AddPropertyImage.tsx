import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import PropertyCard from '@homzhub/common/src/components/molecules/PropertyCard';
import { PropertyImages } from '@homzhub/common/src/components/organisms/PropertyImages';
import { IPropertyImageParam } from '@homzhub/mobile/src/navigation/interfaces';

const AddPropertyImage = (): React.ReactElement => {
  const { params } = useRoute();
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const param = params as IPropertyImageParam;
  return (
    <>
      <Screen headerProps={{ title: t('property:addPropertyImages'), onIconPress: goBack }}>
        <PropertyCard asset={param.asset} isIcon={false} containerStyle={styles.propertyContainer} />
        <Text type="small" textType="semiBold">
          {t('property:gallery')}
        </Text>
        <PropertyImages
          propertyId={param.asset?.id}
          selectedImages={[]}
          isButtonVisible={false}
          onPressContinue={FunctionUtils.noop}
          onUploadImage={FunctionUtils.noop}
          setSelectedImages={FunctionUtils.noop}
          containerStyle={styles.imageContainer}
        />
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
