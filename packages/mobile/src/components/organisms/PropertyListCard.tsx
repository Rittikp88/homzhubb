import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IUserPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { Divider, PricePerUnit, PropertyAddress, Text } from '@homzhub/common/src/components';
import PropertyListImageCarousel from '@homzhub/mobile/src/components/molecules/PropertyListImageCarousel';
import PropertyAmenities from '@homzhub/mobile/src/components/molecules/PropertyAmenities';

interface IProps {
  property: any;
  propertyId: number;
  isFavorite: boolean;
  onFavorite: (index: number) => void;
}

type libraryProps = WithTranslation;
type Props = libraryProps & IProps;

class PropertyListCard extends React.Component<Props, {}> {
  public render(): React.ReactElement {
    const {
      property: { image_url, project_name, unit_number, block_number },
      isFavorite,
    } = this.props;
    return (
      <View style={styles.container}>
        <PropertyListImageCarousel images={image_url} isFavorite={isFavorite} onFavorite={this.onFavorite} />
        {this.renderPropertyTypeAndBadges()}
        <PropertyAddress primaryAddress={project_name} subAddress={`${block_number ?? ''} ${unit_number ?? ''}`} />
        <Divider containerStyles={styles.divider} />
        {this.renderPriceAndAmenities()}
      </View>
    );
  }

  public renderPropertyTypeAndBadges = (): React.ReactElement => {
    const {
      property: {
        asset_type: { name },
      },
    } = this.props;
    return (
      <View style={styles.apartmentContainer}>
        <Text type="small" textType="regular" style={styles.propertyTypeText}>
          {name}
        </Text>
        <View style={styles.badgesContainer}>
          <Icon name={icons.badge} size={23} color={theme.colors.warning} style={styles.badges} />
          <Icon name={icons.badge} size={23} color={theme.colors.warning} style={styles.badges} />
          <Icon name={icons.badge} size={23} color={theme.colors.disabledPreference} style={styles.badges} />
        </View>
      </View>
    );
  };

  public renderPriceAndAmenities = (): React.ReactElement => {
    const {
      property: {
        terms: { expected_monthly_rent_price, currency_code },
      },
    } = this.props;
    const amenitiesData = this.getAmenities();
    return (
      <View style={styles.amenities}>
        <PricePerUnit price={expected_monthly_rent_price} currency={currency_code} unit="mo" />
        <PropertyAmenities data={amenitiesData} direction="row" containerStyle={styles.amenitiesContainer} />
      </View>
    );
  };

  public onFavorite = async (): Promise<void> => {
    const { onFavorite, propertyId, t } = this.props;
    const user: IUserPayload | null = (await StorageService.get(StorageKeys.USER)) ?? null;
    if (!user) {
      AlertHelper.error({ message: t('common:loginToContinue') });
      return;
    }
    onFavorite(propertyId);
  };

  public getAmenities = (): any[] => {
    const {
      property: { carpet_area, carpet_area_unit },
    } = this.props;
    return [
      {
        icon: icons.bed,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: '3',
      },
      {
        icon: icons.bathTub,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: '1',
      },
      {
        icon: icons.direction,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: `${carpet_area.toLocaleString()} ${carpet_area_unit}`,
      },
    ];
  };
}

export default withTranslation()(PropertyListCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 4,
    marginVertical: 10,
  },
  apartmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
  },
  badges: {
    marginHorizontal: 3,
  },
  propertyTypeText: {
    color: theme.colors.primaryColor,
  },
  divider: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.disabled,
    marginVertical: 6,
  },
  amenities: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  amenitiesContainer: {
    marginStart: 15,
  },
});
