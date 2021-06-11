import React, { FC } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import PreferenceDetails from '@homzhub/web/src/screens/offers/components/PreferenceDetails';
import PropertyOfferDetais from '@homzhub/web/src/screens/offers/components/PropertyOfferDetails';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  property: Asset;
  containerStyles?: StyleProp<ViewStyle>;
}
const PropertyDataCard: FC<IProps> = (props: IProps) => {
  const { property, containerStyles } = props;
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const { t } = useTranslation();
  return (
    <>
      <View style={[styles.container, isTablet && styles.tabContainer]}>
        <View style={styles.innerContainer}>
          <View style={!isTablet && styles.rowStyle}>
            <PropertyOfferDetais property={property} />
            <Divider containerStyles={{ marginBottom: 14 }} />
            <PreferenceDetails property={property} containerStyles={containerStyles} />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              type="primary"
              title={`${t('offers:viewOffers')} (${property.offerCount})`}
              containerStyle={styles.button}
              titleStyle={styles.buttonText}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default PropertyDataCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.white,
    minHeight: 242,
    marginTop: 16,
  },
  tabContainer: {
    height: 426,
  },
  button: {
    width: '100%',
    backgroundColor: theme.colors.reminderBackground,
  },
  innerContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    height: '210px',
  },
  buttonText: {
    color: theme.colors.active,
  },
  buttonContainer: { bottom: 0, width: '100%' },
  rowStyle: {
    flexDirection: 'row',
  },
});
