import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { IUserPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider, PricePerUnit, PropertyAddress, TextSizeType } from '@homzhub/common/src/components';
import { ShieldGroup } from '@homzhub/mobile/src/components/molecules/ShieldGroup';
import { PropertyListImageCarousel } from '@homzhub/mobile/src/components/molecules/PropertyListImageCarousel';
import { PropertyAmenities } from '@homzhub/mobile/src/components/molecules/PropertyAmenities';
import { IAmenitiesIcons, IProperties } from '@homzhub/common/src/domain/models/Search';

interface IProps {
  property: IProperties;
  onFavorite: (index: number) => void;
  transaction_type: number;
  containerStyle?: StyleProp<ViewStyle>;
  isCarousel: boolean;
  textSizeType?: TextSizeType;
}

type libraryProps = WithTranslation;
type Props = libraryProps & IProps;

class PropertyListCard extends React.Component<Props, {}> {
  public render(): React.ReactElement {
    const {
      property: { images, project_name, unit_number, block_number, is_favorite = false },
      containerStyle,
      isCarousel,
    } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <PropertyListImageCarousel
          images={images}
          isFavorite={is_favorite}
          onFavorite={this.onFavorite}
          isCarousel={isCarousel}
        />
        {this.renderPropertyTypeAndBadges()}
        <PropertyAddress
          isIcon
          primaryAddress={project_name}
          subAddress={`${block_number ?? ''} ${unit_number ?? ''}`}
        />
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
    return <ShieldGroup text={name} />;
  };

  public renderPriceAndAmenities = (): React.ReactElement => {
    const { transaction_type, property, textSizeType = 'regular' } = this.props;
    const {
      carpet_area,
      carpet_area_unit,
      spaces,
      floor_number,
      asset_group: { name },
    } = property;
    const currency: string = this.getCurrency();
    const price: number = this.getPrice();
    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      carpet_area,
      carpet_area_unit,
      spaces,
      floor_number,
      name
    );
    return (
      <View style={styles.amenities}>
        <PricePerUnit
          price={price}
          currency={currency}
          unit={transaction_type === 0 ? 'mo' : ''}
          textSizeType={textSizeType}
        />
        <PropertyAmenities data={amenitiesData} direction="row" contentContainerStyle={styles.amenitiesContainer} />
      </View>
    );
  };

  public onFavorite = async (): Promise<void> => {
    const {
      onFavorite,
      property: { id },
      t,
    } = this.props;
    const user: IUserPayload | null = (await StorageService.get(StorageKeys.USER)) ?? null;
    if (!user) {
      AlertHelper.error({ message: t('common:loginToContinue') });
      return;
    }
    onFavorite(id);
  };

  public getCurrency = (): string => {
    const {
      property: { lease_term, sale_term },
    } = this.props;
    if (lease_term) {
      return lease_term.currency_code;
    }
    if (sale_term) {
      return sale_term.currency_code;
    }
    return 'INR';
  };

  public getPrice = (): number => {
    const {
      property: { lease_term, sale_term },
    } = this.props;
    if (lease_term) {
      return Number(lease_term.expected_price);
    }
    if (sale_term) {
      return Number(sale_term.expected_price);
    }
    return 0;
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
    overflow: 'hidden',
  },
  amenitiesContainer: {
    marginStart: 5,
  },
});
