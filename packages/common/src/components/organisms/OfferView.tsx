import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { OfferUtils } from '@homzhub/common/src/utils/OfferUtils';
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
import { offerFilterBy, OfferSort, offerSortBy } from '@homzhub/common/src/constants/Offers';

interface IFilters {
  filter_by: string;
  sort_by: string;
}

interface IProps {
  onPressAction: (action: OfferAction) => void;
  isDetailView?: boolean;
}

const initialObj = {
  filter_by: '',
  sort_by: OfferSort.NEWEST,
};

const OfferView = (props: IProps): React.ReactElement => {
  const { onPressAction, isDetailView = false } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.offers);
  const negotiations = useSelector(OfferSelectors.getNegotiations);
  const listingDetail = useSelector(OfferSelectors.getListingDetail);
  const offerPayload = useSelector(OfferSelectors.getOfferPayload);
  const compareData = useSelector(OfferSelectors.getOfferCompareData);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [filters, setFilters] = useState<IFilters>(initialObj);

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
    }, [])
  );

  useEffect(() => {
    setOffers(negotiations);
  }, [negotiations]);

  useEffect(() => {
    if (!filters) return;
    if (filters.filter_by) {
      setOffers(OfferUtils.getFilteredOffer(filters.filter_by, negotiations));
    }
    // TODO: (Shikha) - Need too discuss
    // if (filters.sort_by) {
    //   setOffers(OfferUtils.getSortedOffer(filters.sort_by, offers));
    // }
  }, [filters]);

  const onSelectFromDropdown = (selectedValues: (ISelectedValue | undefined)[]): void => {
    const filtersObj = initialObj;

    selectedValues.forEach((selectedValue: ISelectedValue | undefined) => {
      if (!selectedValue) {
        return;
      }
      const { key, value } = selectedValue;
      // @ts-ignore
      filtersObj[key] = value;
    });

    setFilters(filtersObj);
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
        selectedValue: filters?.sort_by ?? '',
        placeholder: t('sort'),
      },
      {
        dropdownData: offerFilterBy,
        key: 'filter_by',
        selectedValue: filters?.filter_by ?? '',
        placeholder: t('filterBy'),
      },
    ];
  };

  if (!negotiations.length) {
    return <EmptyState title={t('noOfferFound')} />;
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
      {offers.length > 0 && listingDetail ? (
        offers.map((offer, index) => {
          return (
            <OfferCard
              key={index}
              offer={offer}
              onPressAction={(action): void => handleAction(action, offer)}
              compareData={compareData}
              asset={listingDetail}
            />
          );
        })
      ) : (
        <EmptyState title={t('noOfferFound')} />
      )}
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
