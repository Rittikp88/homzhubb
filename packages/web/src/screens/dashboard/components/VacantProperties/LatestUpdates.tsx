import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { OffersVisitsSection, OffersVisitsType } from '@homzhub/common/src/components/molecules/OffersVisitsSection';
import { AssetListingVisits } from '@homzhub/common/src/domain/models/AssetListingVisits';

interface IProps {
  propertyVisitsData: AssetListingVisits;
  propertyDetailTab?: boolean;
}

// TODO: (Bishal) replace offers dummy data once api is ready
const LatestUpdates: FC<IProps> = (props: IProps) => {
  const { t } = useTranslation();
  const { propertyDetailTab, propertyVisitsData } = props;

  const { upcomingVisits, missedVisits, completedVisits } = propertyVisitsData;
  const totalOffers = 0;
  const highestOffer = 0;
  const lowestOffer = 0;

  return (
    <>
      <Text type="small" style={styles.title} textType="semiBold">
        {t('assetDashboard:latestUpdates')}
      </Text>
      <OffersVisitsSection
        propertyDetailTab={propertyDetailTab}
        values={{
          [OffersVisitsType.offers]: [totalOffers, highestOffer, lowestOffer],
          [OffersVisitsType.visits]: [upcomingVisits, missedVisits, completedVisits],
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: theme.colors.darkTint4,
  },
});

export default LatestUpdates;
