import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { PopupProps } from 'reactjs-popup/dist/types';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import {
  InvestmentMockData,
  IInvestmentMockData,
} from '@homzhub/web/src/screens/dashboard/components/InvestmentMockDetails';
import MoreFilters from '@homzhub/web/src//screens/searchProperty/components/MoreFilter';
import PropertySearchCard from '@homzhub/web/src/screens/searchProperty/components/PropertySearchCard';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

// TODO : Replace Dummy Data with Api Data;

const defaultDropDownProps = (isMobile: boolean): PopupProps => ({
  position: 'bottom left',
  arrow: false,
  contentStyle: {
    minWidth: 10,
    marginTop: '-8px',
    width: '92%',
    height: 536,
    overflow: 'auto',
    marginRight: isMobile ? 10 : undefined,
  },
  closeOnDocumentClick: false,
  children: undefined,
});
const SearchProperty: FC = () => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();
  return (
    <View style={styles.mainContainer}>
      <Popover content={<MoreFilters />} popupProps={defaultDropDownProps(isMobile)}>
        <View>
          <Button
            type="secondary"
            title={t('assetMore:more')}
            containerStyle={styles.moreButton}
            titleStyle={styles.moreButtonTitle}
            icon={icons.downArrow}
            iconSize={20}
            iconColor={theme.colors.blue}
          />
        </View>
      </Popover>
      <GridView />
    </View>
  );
};

const GridView = (): React.ReactElement => {
  const investmentDataArray = InvestmentMockData;
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        {investmentDataArray.map((item: IInvestmentMockData) => (
          <View key={item.id} style={[styles.card, isTablet && styles.cardTablet, isMobile && styles.cardMobile]}>
            <PropertySearchCard key={item.id} investmentData={item} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
  },
  subContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  card: {
    width: '31%',
    marginLeft: 18,
  },
  cardMobile: {
    width: '100%',
    marginLeft: 0,
  },
  cardTablet: {
    width: '47%',
  },
  moreButton: {
    width: 80,
    height: 31,
    backgroundColor: theme.colors.lightGrayishBlue,
    marginTop: 60,
    flexDirection: 'row',
  },
  moreButtonTitle: {
    alignItems: 'center',
    textAlign: 'center',
    marginVertical: 3,
    marginHorizontal: 6,
  },
});

export default SearchProperty;
