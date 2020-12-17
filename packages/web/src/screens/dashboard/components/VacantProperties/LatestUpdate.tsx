import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { OffersVisitsSection, OffersVisitsType } from '@homzhub/common/src/components/molecules/OffersVisitsSection';
import { AssetListingVisits } from '@homzhub/common/src/domain/models/AssetListingVisits';

interface IProps {
  propertyVisitsData: AssetListingVisits;
}

// TODO: (Bishal) replace offers dummy data once api is ready
const LatestUpdates: FC<IProps> = ({ propertyVisitsData }: IProps) => {
  const { t } = useTranslation();
  const { upcomingVisits, missedVisits, completedVisits } = propertyVisitsData;
  return (
    <>
      <Text type="small" style={styles.title} textType="semiBold">
        {t('assetDashboard:latestUpdates')}
      </Text>
      <OffersVisitsSection
        values={{
          [OffersVisitsType.offers]: [3000, 2000, 1200],
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
