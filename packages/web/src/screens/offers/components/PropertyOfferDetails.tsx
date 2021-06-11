import React, { FC } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { ShieldGroup } from '@homzhub/web/src/components/molecules/ShieldGroupHeader';
import YoutubeCard from '@homzhub/web/src/screens/portfolio/components/YoutubeCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { IAmenitiesIcons, IFilter } from '@homzhub/common/src/domain/models/Search';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IProps {
  property: Asset;
}
interface IStateProps {
  filters: IFilter;
}
type IPropertyOfferDetails = IProps & IStateProps;
const PropertyOfferDetais: FC<IPropertyOfferDetails> = (props: IPropertyOfferDetails) => {
  const isTab = useDown(deviceBreakpoint.TABLET);
  const { property, filters } = props;
  const {
    projectName,
    unitNumber,
    blockNumber,
    address,
    country: { flag },
    carpetArea,
    carpetAreaUnit,
    furnishing,
    spaces,
    leaseTerm,
    saleTerm,
    country: { currencies },
    assetGroup: { code },
  } = property;

  const containerStyle = { marginVertical: 0 };

  const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
    spaces,
    furnishing,
    code,
    carpetArea,
    carpetAreaUnit?.title ?? '',
    true
  );

  let currencyData = currencies[0];

  if (leaseTerm && leaseTerm.currency) {
    currencyData = leaseTerm.currency;
  }

  if (saleTerm && saleTerm.currency) {
    currencyData = saleTerm.currency;
  }
  const salePrice = saleTerm && Number(saleTerm.expectedPrice) > 0 ? Number(saleTerm.expectedPrice) : 0;
  const price = leaseTerm && leaseTerm.expectedPrice > 0 ? leaseTerm.expectedPrice : salePrice;

  const renderAttachmentView = (attachments: Attachment[]): React.ReactNode => {
    const item = attachments[0];
    if (!item) return <ImagePlaceholder containerStyle={[styles.imgPlaceHolder, isTab && styles.imgPlaceHolderTab]} />;
    const { link, mediaType } = item;

    return (
      <TouchableOpacity>
        {mediaType === 'IMAGE' && (
          <View style={[styles.imageContainer, isTab && styles.tabImageContainer]}>
            <Image
              source={{
                uri: link,
              }}
              style={styles.detailViewImage}
            />
          </View>
        )}
        {mediaType === 'VIDEO' && <YoutubeCard videoLink={link} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.containerAlign}>
      {renderAttachmentView(property.attachments)}
      <View style={[styles.details, isTab && styles.detailsTab]}>
        <ShieldGroup
          propertyType={property.assetType.name}
          isInfoRequired
          containerStyle={containerStyle}
          textType="label"
          textSize="large"
        />
        <PropertyAddressCountry
          isIcon
          primaryAddress={projectName}
          countryFlag={flag}
          subAddress={address ?? `${unitNumber} ${blockNumber}`}
          containerStyle={styles.addressStyle}
          primaryAddressTextStyles={{ size: 'small' }}
          subAddressTextStyles={{ variant: 'label', size: 'large' }}
        />
        <PricePerUnit
          price={price}
          currency={currencyData}
          unit={filters.asset_transaction_type === 0 ? 'mo' : ''}
          textStyle={styles.pricing}
          textSizeType="regular"
        />
        <PropertyAmenities
          data={amenitiesData}
          direction="row"
          containerStyle={styles.amenitiesContainer}
          contentContainerStyle={styles.amenities}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state: IState): IStateProps => {
  return {
    filters: SearchSelector.getFilters(state),
  };
};

export default connect(mapStateToProps)(PropertyOfferDetais);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.white,
    height: 242,
    marginTop: 16,
  },
  button: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: theme.colors.reminderBackground,
  },
  innerContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    height: '210px',
  },
  imageContainer: {
    width: 220,
    height: 153,
  },
  detailViewImage: {
    borderRadius: 4,
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  addressStyle: {
    width: '100%',
    top: 6,
  },
  pricing: {
    marginTop: 6,
  },
  amenitiesContainer: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginVertical: 12,
  },
  amenities: {
    marginEnd: 16,
  },
  tabImageContainer: {
    width: 300,
  },
  details: { marginHorizontal: 12, width: 296 },
  detailsTab: {
    width: '52.5%',
  },
  imgPlaceHolder: {
    height: 153,
    width: 220,
  },
  imgPlaceHolderTab: {
    width: 300,
  },
  containerAlign: { flexDirection: 'row' },
});
