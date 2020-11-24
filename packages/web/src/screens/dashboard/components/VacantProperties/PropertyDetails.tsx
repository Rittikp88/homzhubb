import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { ITypographyProps } from '@homzhub/common/src/components/atoms/Typography';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Text } from '@homzhub/common/src/components/atoms/Text';

const amenities = [
  { id: 1, label: 'Beds', count: 2, Icon: icons.bed },
  { id: 2, label: 'Baths', count: 2, Icon: icons.bathTub },
  { id: 3, label: 'Sqft', count: 1200, Icon: icons.area },
];

const PropertyDetails = (): React.ReactElement => {
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
    <View style={styles.container}>
      <Badge title={t('Vacant')} badgeColor={theme.colors.highPriority} badgeStyle={styles.badge} />
      <View>
        <PropertyAddressCountry
          primaryAddress={t('2BHK - Godrej Prime')}
          countryFlag="https://www.countryflags.io/IN/flat/48.png"
          primaryAddressTextStyles={addressTextStyle}
          subAddressTextStyles={subAddressTextStyle}
          subAddress={t('Sindhi Society, Chembur, Mumbai- 400071')}
          containerStyle={styles.containerStyle}
        />
      </View>
      <View style={styles.amenities}>
        {amenities.map((Item) => (
          <View key={Item.id} style={styles.amenitiesWrapper}>
            <Icon name={Item.Icon} size={20} />

            <Text type="small" style={styles.amenitiesName} textType="regular" minimumFontScale={0.5}>
              {t(`${Item.count}${Item.label}`)}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.warningWrapper}>
        <Icon name={icons.filledWarning} size={17} style={styles.Icon} />
        <Text type="small" style={styles.warningText} textType="light" minimumFontScale={0.5}>
          {t('Vacant since two weeks')}
        </Text>
      </View>{' '}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  badge: {
    width: 88,
  },
  subAddress: {},
  addressContainer: {
    width: 300,
  },
  propertyNameWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },
  addressCountry: {
    marginTop: 8,
    marginBottom: 16,
  },
  propertyName: {
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: theme.colors.gray2,
  },
  location: {
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: theme.colors.darkTint3,
  },
  amenities: {
    flexDirection: 'row',
    flex: 12,
  },
  Icon: { color: theme.colors.danger },
  amenitiesWrapper: {
    flex: 4,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 0,
    marginRight: 20,
  },
  amenitiesName: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'normal',
    color: theme.colors.darkTint3,
    marginLeft: 6,
  },
  warningWrapper: {
    marginTop: 25,
    flexDirection: 'row',
    backgroundColor: 'rgba(242, 60, 6, 0.1)',
    width: 205,
    height: 23,
    borderRadius: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  warningText: {
    fontWeight: '600',
    fontSize: 14,
    color: theme.colors.danger,
  },
  containerStyle: { margin: 15 },
});

export default PropertyDetails;
