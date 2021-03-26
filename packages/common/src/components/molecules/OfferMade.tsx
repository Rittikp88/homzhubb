import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import PropertyCard from '@homzhub/common/src/components/molecules/PropertyCard';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IProps {
  propertyOffer: Asset;
  onViewOffer: () => void;
}

const OfferMade = (props: IProps): React.ReactElement => {
  const {
    propertyOffer,
    propertyOffer: { leaseNegotiation, saleNegotiation },
    onViewOffer,
  } = props;
  const offer = leaseNegotiation || saleNegotiation;
  const compareData = useSelector(OfferSelectors.getOfferCompareData);

  return (
    <TouchableOpacity style={styles.container} onPress={onViewOffer}>
      <PropertyCard asset={propertyOffer} isExpanded containerStyle={styles.cardContainer} />
      {offer && <OfferCard offer={offer} containerStyle={styles.offerCard} compareData={compareData} />}
      <Divider containerStyles={styles.divider} />
    </TouchableOpacity>
  );
};

export default OfferMade;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  cardContainer: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  offerCard: {
    marginTop: 16,
  },
  divider: {
    borderColor: theme.colors.darkTint9,
  },
});
