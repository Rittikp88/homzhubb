import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import PropertyCard from '@homzhub/common/src/components/molecules/PropertyCard';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IProps {
  propertyOffer: Asset;
}

const OfferMade = (props: IProps): React.ReactElement => {
  const {
    propertyOffer,
    propertyOffer: { leaseNegotiation, saleNegotiation },
  } = props;
  const offer = leaseNegotiation || saleNegotiation;

  return (
    <View style={styles.container}>
      <PropertyCard asset={propertyOffer} isExpanded containerStyle={styles.cardContainer} />
      {offer && <OfferCard offer={offer} containerStyle={styles.offerCard} />}
      <Divider containerStyles={styles.divider} />
    </View>
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
