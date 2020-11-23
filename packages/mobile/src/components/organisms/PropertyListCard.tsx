import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { PropertyAddress } from '@homzhub/common/src/components/molecules/PropertyAddress';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { ShieldGroup } from '@homzhub/mobile/src/components/molecules/ShieldGroup';
import { PropertyListImageCarousel } from '@homzhub/mobile/src/components/molecules/PropertyListImageCarousel';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IProps {
  property: Asset;
  onFavorite: () => void;
  transaction_type: number;
  containerStyle?: StyleProp<ViewStyle>;
  isCarousel: boolean;
  textSizeType?: TextSizeType;
  onSelectedProperty: () => void;
  testID?: string;
  favIds?: number[];
}

type libraryProps = WithTranslation;
type Props = libraryProps & IProps;

export class PropertyListCard extends React.Component<Props, {}> {
  public render(): React.ReactElement {
    const {
      property: { attachments, projectName, unitNumber, blockNumber, isWishlisted, address, leaseTerm, saleTerm },
      containerStyle,
      isCarousel,
      onSelectedProperty,
      onFavorite,
      favIds,
    } = this.props;
    let isFavorite = isWishlisted ? isWishlisted.status : false;
    if (favIds && favIds.length > 0) {
      favIds.forEach((favId) => {
        if ((leaseTerm && favId === leaseTerm.id) || (saleTerm && saleTerm.id === favId)) {
          isFavorite = true;
        }
      });
    }
    return (
      <View style={[styles.container, containerStyle]}>
        <PropertyListImageCarousel
          images={attachments}
          isFavorite={isFavorite}
          onFavorite={onFavorite}
          isCarousel={isCarousel}
        />
        {this.renderPropertyTypeAndBadges()}
        <TouchableOpacity onPress={onSelectedProperty}>
          <PropertyAddress
            isIcon
            primaryAddress={projectName}
            subAddress={address || `${blockNumber ?? ''} ${unitNumber ?? ''}`}
          />
          <Divider containerStyles={styles.divider} />
          {this.renderPriceAndAmenities()}
        </TouchableOpacity>
      </View>
    );
  }

  public renderPropertyTypeAndBadges = (): React.ReactElement => {
    const {
      property: {
        assetType: { name },
      },
    } = this.props;
    return <ShieldGroup propertyType={name} />;
  };

  public renderPriceAndAmenities = (): React.ReactElement => {
    const { transaction_type, property, textSizeType = 'regular' } = this.props;
    const {
      carpetArea,
      carpetAreaUnit,
      spaces,
      furnishing,
      country: { currencies },
      assetGroup: { code },
      saleTerm,
      leaseTerm,
    } = property;
    const price: number = this.getPrice();
    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces,
      furnishing,
      code,
      carpetArea,
      carpetAreaUnit?.title ?? ''
    );
    let currencyData = currencies[0];

    if (leaseTerm && leaseTerm.currency) {
      currencyData = leaseTerm.currency;
    }

    if (saleTerm && saleTerm.currency) {
      currencyData = saleTerm.currency;
    }

    return (
      <View style={styles.amenities}>
        <PricePerUnit
          price={price}
          currency={currencyData}
          unit={transaction_type === 0 ? 'mo' : ''}
          textSizeType={textSizeType}
        />
        <PropertyAmenities data={amenitiesData} direction="row" contentContainerStyle={styles.amenitiesContainer} />
      </View>
    );
  };

  public getPrice = (): number => {
    const {
      property: { leaseTerm, saleTerm },
    } = this.props;
    if (leaseTerm) {
      return Number(leaseTerm.expectedPrice);
    }
    if (saleTerm) {
      return Number(saleTerm.expectedPrice);
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
