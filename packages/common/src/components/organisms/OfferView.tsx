import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import ScrollableDropdownList, {
  IDropdownData,
  ISelectedValue,
} from '@homzhub/common/src/components/molecules/ScrollableDropdownList';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { INegotiationParam, ListingType, NegotiationType } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { offerFilterBy, offerSortBy } from '@homzhub/common/src/constants/Offers';

interface IProps {
  onPressAction: (action: OfferAction) => void;
  isDetailView?: boolean;
}

const OfferView = (props: IProps): React.ReactElement => {
  const { onPressAction, isDetailView = false } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.offers);
  const negotiations = useSelector(OfferSelectors.getNegotiations);
  const offerPayload = useSelector(OfferSelectors.getOfferPayload);
  const compareData = useSelector(OfferSelectors.getOfferCompareData);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      if (offerPayload) {
        const payload: INegotiationParam = {
          listingType: offerPayload.type,
          listingId: offerPayload.listingId,
          negotiationType:
            offerPayload.type === ListingType.LEASE_LISTING
              ? NegotiationType.LEASE_NEGOTIATIONS
              : NegotiationType.SALE_NEGOTIATIONS,
        };
        dispatch(OfferActions.getNegotiations(payload));
      }
    }, [offerPayload])
  );

  const onSelectFromDropdown = (selectedValues: (ISelectedValue | undefined)[]): void => {
    // TODO: Add logic
  };

  const handleAction = (action: OfferAction, offer: Offer): void => {
    dispatch(OfferActions.setCurrentOffer(offer));
    onPressAction(action);
  };

  const getDropdownData = (): IDropdownData[] => {
    return [
      {
        dropdownData: offerSortBy,
        key: 'sort_by',
        selectedValue: '',
        placeholder: t('sort'),
      },
      { dropdownData: offerFilterBy, key: 'filter_by', selectedValue: '', placeholder: t('filterBy') },
    ];
  };

  if (!negotiations.length) {
    return <EmptyState />;
  }

  return (
    <>
      <ScrollableDropdownList
        isScrollable={false}
        dropDownTitle="Offers"
        isOutlineView={!isDetailView}
        data={getDropdownData()}
        onDropdown={onSelectFromDropdown}
        mainContainerStyle={[styles.dropDownContainer, !isDetailView && styles.dropDownView]}
        containerStyle={styles.filterStyle}
      />
      {negotiations.map((offer, index) => {
        return (
          <OfferCard
            key={index}
            offer={offer}
            onPressAction={(action): void => handleAction(action, offer)}
            compareData={compareData}
          />
        );
      })}
    </>
  );
};

export default OfferView;

const styles = StyleSheet.create({
  dropDownContainer: {
    paddingVertical: 20,
  },
  dropDownView: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,
  },
  filterStyle: {
    width: 130,
  },
});
