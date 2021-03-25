import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export enum OffersVisitsType {
  offers = 'Offers',
  visits = 'Visits',
}

const Data = [
  {
    type: OffersVisitsType.offers,
    title: 'common:offers',
    icon: icons.offers,
    sections: ['totalOffers', 'highestOffer', 'lowestOffer'],
  },
  {
    type: OffersVisitsType.visits,
    title: 'assetMore:propertyVisits',
    icon: icons.visit,
    sections: ['upcomingVisits', 'missedVisits', 'completedVisits'],
  },
];

interface IProps {
  isDetailView?: boolean;
  onNav?: (from: OffersVisitsType) => void;
  values: {
    [OffersVisitsType.offers]: number[];
    [OffersVisitsType.visits]: number[];
  };
}

// TODO: Display the Offer section post the MVP
const OffersVisitsSection = (props: IProps): React.ReactElement => {
  const { values } = props;
  const { t } = useTranslation();
  const data = PlatformUtils.isWeb() ? Data : Data.slice(1);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  return (
    <View style={[styles.container, PlatformUtils.isWeb() && isTablet && !isMobile && styles.containerTablet]}>
      {data.map((item) => {
        // const onPress = (): void => onNav && onNav(item.type);
        return (
          <View key={item.type}>
            <Divider containerStyles={styles.divider} />
            <View style={styles.contentContainer}>
              <Icon name={item.icon} size={22} color={theme.colors.darkTint2} />
              <View style={styles.textContainer}>
                <View style={styles.header}>
                  <Label type="large" textType="regular" style={styles.title}>
                    {t(item.title)}
                  </Label>
                  {/* {!isDetailView && ( */}
                  {/*  <TouchableOpacity onPress={onPress}> */}
                  {/*    <Icon name={icons.rightArrow} color={theme.colors.active} size={20} /> */}
                  {/*  </TouchableOpacity> */}
                  {/* )} */}
                </View>
                <View style={styles.subSectionContainer}>
                  {item.sections.map((section, index) => (
                    <View key={section} style={styles.subSection}>
                      <Label type="small" textType="regular" style={styles.subSectionText}>
                        {t(`assetPortfolio:${section}`)}
                      </Label>
                      <Label type="large" textType="semiBold" style={styles.title}>
                        {values[item.type][index]}
                      </Label>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const memoizedComponent = React.memo(OffersVisitsSection);
export { memoizedComponent as OffersVisitsSection };

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  divider: {
    borderWidth: 1,
    marginVertical: 12,
    borderColor: theme.colors.background,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    marginStart: 12,
  },
  subSectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  subSection: {
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    color: theme.colors.darkTint2,
  },
  subSectionText: {
    color: theme.colors.darkTint3,
  },
  containerTablet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
