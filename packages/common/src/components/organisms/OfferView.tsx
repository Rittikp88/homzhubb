import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { offerFilterBy, offerSortBy } from '@homzhub/common/src/constants/Offers';
import { offers } from '@homzhub/common/src/mocks/Offers';

interface IProps {
  onPressAction: (action: OfferAction) => void;
  isDetailView?: boolean;
  filterStyle?: StyleProp<ViewStyle>;
}

const OfferView = (props: IProps): React.ReactElement => {
  const { onPressAction, filterStyle, isDetailView = false } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.offers);

  const [sort, setSort] = useState('NEWEST');
  const [filter, setFilter] = useState('');

  // TODO: Remove after API integration
  const offerData = ObjectMapper.deserializeArray(Offer, offers);

  return (
    <>
      <View style={[styles.filterContainer, filterStyle]}>
        <Text>Offers</Text>
        <View style={styles.rowStyle}>
          <Dropdown
            data={offerSortBy}
            value={sort}
            isOutline
            listHeight={400}
            placeholder={t('sort')}
            containerStyle={[styles.sort, styles.dropDownStyle]}
            onDonePress={(value: string): void => setSort(value)}
            backgroundColor={isDetailView && theme.colors.white}
          />
          <Dropdown
            data={offerFilterBy}
            value={filter}
            isOutline
            listHeight={500}
            placeholder={t('filterBy')}
            onDonePress={(value: string): void => setFilter(value)}
            containerStyle={styles.dropDownStyle}
            backgroundColor={isDetailView && theme.colors.white}
          />
        </View>
      </View>
      {offerData.map((offer, index) => {
        return <OfferCard key={index} offer={offer} onPressAction={onPressAction} />;
      })}
    </>
  );
};

export default OfferView;

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  sort: {
    marginHorizontal: 8,
  },
  rowStyle: {
    flexDirection: 'row',
  },
  dropDownStyle: {
    width: 120,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
});
