import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
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
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IProps {
  property: Asset;
  onFavorite: (index: number) => void;
  transaction_type: number;
  containerStyle?: StyleProp<ViewStyle>;
  isCarousel: boolean;
  textSizeType?: TextSizeType;
  onSelectedProperty: () => void;
  testID?: string;
}

type libraryProps = WithTranslation;
type Props = libraryProps & IProps;

export class PropertyListCard extends React.Component<Props, {}> {
  public render(): React.ReactElement {
    const {
      property: { attachments, projectName, unitNumber, blockNumber, isFavorite = false },
      containerStyle,
      isCarousel,
      onSelectedProperty,
    } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <PropertyListImageCarousel
          images={attachments}
          isFavorite={isFavorite}
          onFavorite={this.onFavorite}
          isCarousel={isCarousel}
        />
        {this.renderPropertyTypeAndBadges()}
        <TouchableOpacity onPress={onSelectedProperty}>
          <PropertyAddress
            isIcon
            primaryAddress={projectName}
            subAddress={`${blockNumber ?? ''} ${unitNumber ?? ''}`}
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
      floorNumber,
      assetGroup: { name },
    } = property;
    const currency: string = this.getCurrency();
    const price: number = this.getPrice();
    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces,
      floorNumber,
      name,
      carpetArea,
      carpetAreaUnit?.title ?? ''
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
      property: { leaseTerm, saleTerm },
    } = this.props;
    if (leaseTerm) {
      return leaseTerm.currencyCode;
    }
    if (saleTerm) {
      return saleTerm.currencyCode;
    }
    return 'INR';
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
