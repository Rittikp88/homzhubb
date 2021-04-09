import React from 'react';
import { useDispatch } from 'react-redux';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import PropertyCard from '@homzhub/common/src/components/molecules/PropertyCard';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IProps {
  propertyOffer: Asset;
  onViewOffer: () => void;
}

const OfferMade = (props: IProps): React.ReactElement => {
  const {
    propertyOffer,
    propertyOffer: { leaseNegotiation, saleNegotiation, leaseTerm, saleTerm },
    onViewOffer,
  } = props;
  const offer = leaseNegotiation || saleNegotiation;

  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const compareData = (): IOfferCompare => {
    if (leaseTerm) {
      return {
        rent: leaseTerm.expectedPrice,
        deposit: leaseTerm.securityDeposit,
        incrementPercentage: Number(leaseTerm.annualRentIncrementPercentage),
      };
    }

    return {
      price: saleTerm ? Number(saleTerm.expectedPrice) : 0,
      bookingAmount: saleTerm ? Number(saleTerm.expectedBookingAmount) : 0,
    };
  };

  const handleActions = (action: OfferAction): void => {
    switch (action) {
      case OfferAction.ACCEPT:
        navigate(ScreensKeys.AcceptOffer);
        break;
      case OfferAction.REJECT:
        navigate(ScreensKeys.RejectOffer);
        break;
      case OfferAction.COUNTER:
        if (offer) {
          dispatch(OfferActions.getListingDetailSuccess(propertyOffer));
          dispatch(OfferActions.setCurrentOffer(offer));
          navigate(ScreensKeys.SubmitOffer);
        }
        break;
      case OfferAction.CANCEL:
        if (offer) {
          dispatch(OfferActions.getListingDetailSuccess(propertyOffer));
          dispatch(OfferActions.setCurrentOffer(offer));
          navigate(ScreensKeys.CancelOffer);
        }
        break;
      default:
        FunctionUtils.noop();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onViewOffer}>
        <PropertyCard asset={propertyOffer} isExpanded containerStyle={styles.cardContainer} />
      </TouchableOpacity>
      {offer && (
        <OfferCard
          offer={offer}
          containerStyle={styles.offerCard}
          compareData={compareData()}
          onPressAction={handleActions}
          asset={propertyOffer}
        />
      )}
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
