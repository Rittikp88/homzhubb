import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import DownloadApp from '@homzhub/common/src/assets/images/downloadApp.svg';
import ManageProperty from '@homzhub/common/src/assets/images/manageProperty.svg';
import Nagpur from '@homzhub/common/src/assets/images/nagpur.svg';
import PostProperty from '@homzhub/common/src/assets/images/postProperty.svg';
import Pune from '@homzhub/common/src/assets/images/pune.svg';
import VerifyDocuments from '@homzhub/common/src/assets/images/verifyDocuments.svg';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const OverViewSteps: FC = () => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.microSite);

  const overViewStepsData = [
    {
      image: <DownloadApp />,
      text: t('downloadApp'),
    },
    {
      image: <PostProperty />,
      text: t('signUpAndPost'),
    },
    {
      image: <VerifyDocuments />,
      text: t('verifyDocuments'),
    },
    {
      image: <ManageProperty />,
      text: t('manageProperty'),
    },
  ];
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTab = useDown(deviceBreakpoint.TABLET);

  const data = overViewStepsData.map((item, index) => {
    return (
      <View
        style={[
          styles.stepsContainer,
          isTab && index === 3 && styles.stepsContainerTab,
          isMobile && styles.stepsContainerMobile,
        ]}
        key={index}
      >
        <View style={[styles.iconLabel, isMobile && styles.iconLabelMobile]} key={index}>
          {item.image}
          <View style={[styles.image, isMobile && styles.imageMobile]}>
            <Typography size="regular" variant="text" style={[styles.text, isMobile && styles.textMobile]}>
              {item.text}
            </Typography>
          </View>
        </View>
        {index < 3 && (
          <View style={[styles.arrowIcon, isMobile && styles.arrowIconMobile]}>
            <Icon name={icons.arrowRight} color={theme.colors.blue} size={20} />
          </View>
        )}
      </View>
    );
  });

  return (
    <View style={[styles.container, (isMobile || isTab) && styles.containerMobile]}>
      <View style={[styles.cities, isMobile && styles.citiesMobile]}>
        <View style={[styles.pune, isMobile && styles.puneMobile]}>
          <Pune />
          <View style={styles.image}>
            <Typography size="regular" variant="text" style={styles.text}>
              {t('pune')}
            </Typography>
          </View>
        </View>

        <View style={isMobile && styles.puneMobile}>
          <Nagpur />
          <View style={styles.image}>
            <Typography size="regular" variant="text" style={styles.text}>
              {t('nagpur')}
            </Typography>
          </View>
        </View>
      </View>
      <View>
        <View style={styles.heading}>
          <View>
            <Typography variant="title" size="regular" fontWeight="semiBold" style={styles.text}>
              {t('homzhubTagLine')}
            </Typography>
          </View>

          <View style={[styles.subHeading, styles.subHeadingMobile]}>
            <Typography variant="text" size="small" style={styles.text}>
              {t('freeDownload')}
            </Typography>
          </View>
        </View>

        <View style={[styles.overview, isMobile && styles.overviewMobile]}>{data}</View>
        <View>
          <Typography variant="text" size="small" style={styles.text}>
            {t('PuneNagpurOwners')}
          </Typography>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '17%',
    top: 72,
    flexDirection: 'column-reverse',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerMobile: {
    marginHorizontal: '5%',
  },
  heading: {
    paddingBottom: '5%',

    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeading: {
    marginHorizontal: '12%',
    marginVertical: 24,
  },
  subHeadingMobile: {
    marginHorizontal: '5%',
  },
  text: {
    textAlign: 'center',
  },
  overview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 72,
  },
  overviewMobile: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },

  image: {
    top: 24,
  },
  cities: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '20%',
    top: 24,
  },
  citiesMobile: {
    flexDirection: 'column',
  },
  pune: {
    marginEnd: 70,
  },
  puneMobile: {
    paddingBottom: '10%',
    marginEnd: 0,
  },
  imageMobile: {
    width: '80%',
    paddingStart: '13%',
    top: 0,
  },
  textMobile: {
    textAlign: 'left',
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '29%',
  },
  stepsContainerMobile: {
    flexDirection: 'column',
    width: '100%',
  },
  stepsContainerTab: {
    width: '18.5%',
  },
  arrowIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '20px',
    left: 17,
  },
  arrowIconMobile: {
    marginVertical: 20,
    transform: [{ rotate: '90deg' }],
  },
  iconLabel: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLabelMobile: {
    width: '70%',
    flexDirection: 'row',
  },
});
export default OverViewSteps;
