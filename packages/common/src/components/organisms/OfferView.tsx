import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';
import ScrollableDropdownList, {
  IDropdownData,
  ISelectedValue,
} from '@homzhub/common/src/components/molecules/ScrollableDropdownList';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { offerFilterBy, offerSortBy } from '@homzhub/common/src/constants/Offers';
import { offers } from '@homzhub/common/src/mocks/Offers';

interface IProps {
  onPressAction: (action: OfferAction) => void;
  isDetailView?: boolean;
}

const OfferView = (props: IProps): React.ReactElement => {
  const { onPressAction, isDetailView = false } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.offers);

  // TODO: Remove after API integration
  const offerData = ObjectMapper.deserializeArray(Offer, offers);

  const onSelectFromDropdown = (selectedValues: (ISelectedValue | undefined)[]): void => {
    // TODO: Add logic
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
      {offerData.map((offer, index) => {
        return <OfferCard key={index} offer={offer} onPressAction={onPressAction} />;
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
