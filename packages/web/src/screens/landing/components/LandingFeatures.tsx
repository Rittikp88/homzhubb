import React, { FC } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import ProfileTag from '@homzhub/common/src/assets/images/profileTag.svg';
import Graph from '@homzhub/common/src/assets/images/graph.svg';
import Bell from '@homzhub/common/src/assets/images/bell.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Hoverable } from '@homzhub/web/src/components/hoc/Hoverable';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const LandingFeatures: FC = () => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);

  const data = [
    { icon: <Graph height={30} width={35} />, text: t('landing:manageProperties') },
    {
      icon: <ProfileTag height={32} width={42} />,
      text: t('landing:manageTenant'),
    },
    {
      icon: <Bell height={32} width={42} />,
      text: t('landing:findHome'),
    },
    {
      icon: <Bell height={32} width={42} />,
      text: t('landing:investmentDestination'),
    },
    {
      icon: <ProfileTag height={32} width={42} />,
      text: t('landing:maximizeReturns'),
    },
    {
      icon: <Graph height={30} width={35} />,
      text: t('landing:maintainRentalHistory'),
    },
  ];
  const Cards = data.map((item) => {
    return (
      <View key={item.text}>
        <Hoverable key={item.text}>
          {(isHovered: boolean): React.ReactNode => (
            <TouchableOpacity
              style={[
                styles.card,
                isMobile && styles.cardMobile,
                !isMobile && isTablet && styles.cardTablet,
                isHovered && styles.activeCard,
              ]}
            >
              <View style={[styles.cardContent, isMobile && styles.cardContentMobile]}>
                <View style={[!isMobile && styles.icon, isMobile && styles.iconMobile, isTablet && styles.iconTablet]}>
                  {item.icon}
                </View>
                <View>
                  <Typography variant="text" size="small" fontWeight="semiBold" style={styles.text}>
                    {item.text}
                  </Typography>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </Hoverable>
      </View>
    );
  });

  return (
    <View style={styles.containers}>
      <View style={styles.content}>
        <Typography variant="text" size="small" style={styles.title}>
          FEATURES
        </Typography>
        {!isMobile ? (
          !isTablet ? (
            <Typography variant="title" size="large" fontWeight="semiBold" style={styles.subHeading}>
              {t('landing:featureDescription')}
            </Typography>
          ) : (
            <Typography variant="title" size="large" fontWeight="semiBold" style={styles.subHeadingTab}>
              {t('landing:mobileDescription')}
            </Typography>
          )
        ) : (
          <Typography variant="title" size="large" fontWeight="semiBold" style={styles.subHeadingMobile}>
            {t('landing:mobileDescription')}
          </Typography>
        )}
      </View>

      <View style={[styles.grid, isMobile && styles.gridMobile, !isMobile && isTablet && styles.gridTab]}>{Cards}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  containers: {
    backgroundColor: theme.colors.background,
  },
  cardContent: {
    marginVertical: 40,
    marginHorizontal: 30,
  },
  cardContentMobile: {
    marginHorizontal: 16,
  },
  card: {
    width: '310px',
    height: '180px',
    backgroundColor: theme.colors.cardOpacity,
    margin: '15px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCard: {
    shadowColor: theme.colors.grey4,
    shadowOffset: { width: 0, height: 42 },
    shadowOpacity: 0.2,
    shadowRadius: 120,
  },
  cardMobile: {
    marginBottom: '16px',
    width: '320px',
    height: '190px',
    backgroundColor: theme.colors.cardOpacity,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTablet: {
    width: '340px',
    height: '190px',
    backgroundColor: theme.colors.cardOpacity,
    justifyContent: 'center',
  },
  icon: {
    paddingBottom: 22,
    alignItems: 'center',
  },
  iconMobile: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  iconTablet: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    flexWrap: 'wrap',
    marginBottom: '7%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridMobile: {
    marginHorizontal: '1px',
  },
  gridTab: {
    marginHorizontal: '6px',
    marginBottom: '4%',
  },

  text: {
    position: 'relative',
    textAlign: 'center',
  },
  title: {
    color: theme.colors.lightGreen,
    marginTop: '100px',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  subHeading: {
    marginTop: 21,
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.darkTint2,
  },
  subHeadingTab: {
    marginTop: 21,
    marginBottom: 40,
    marginHorizontal: 30,
    textAlign: 'center',
    color: theme.colors.darkTint2,
  },
  subHeadingMobile: {
    marginTop: 21,
    marginBottom: 40,
    marginHorizontal: 16,
    textAlign: 'center',
    color: theme.colors.darkTint2,
  },
});

export default LandingFeatures;
