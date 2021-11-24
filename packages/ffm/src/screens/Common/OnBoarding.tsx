import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { StatusBar } from '@homzhub/mobile/src/components/atoms/StatusBar';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { OnBoarding as OnBoardingModel } from '@homzhub/common/src/domain/models/OnBoarding';

const OnBoarding = (): React.ReactElement => {
  const dispatch = useDispatch();
  const [activeSlide, setActiveSlide] = useState(0);
  const onBoardingData = useSelector(FFMSelector.getOnBoardingData);
  const roles = useSelector(FFMSelector.getRoles);
  const loaders = useSelector(FFMSelector.getFFMLoaders);

  useEffect(() => {
    getScreenData();
  }, []);

  const getScreenData = (): void => {
    dispatch(FFMActions.getOnBoardingData());
    dispatch(FFMActions.getRoles());
  };

  const renderCarousel = (carouselItem: OnBoardingModel): React.ReactElement => {
    const {
      viewport: { width, height: viewportHeight },
      DeviceDimensions: { SMALL, MEDIUM },
    } = theme;
    /* eslint-disable */
    const height =
      width > SMALL.width
        ? width > MEDIUM.width
          ? PlatformUtils.isIOS()
            ? 450
            : viewportHeight / 2.5
          : width === MEDIUM.width
          ? 280
          : 220
        : 150;
    /* eslint-enable */
    const imgWidth = width > SMALL.width ? (width > MEDIUM.width ? 320 : width === MEDIUM.width ? 350 : 330) : 280;
    return (
      <View style={styles.imageView}>
        <SVGUri uri={carouselItem.imageUrl} height={height} width={imgWidth} />
      </View>
    );
  };

  const onSnapToItem = (slideNumber: number): void => {
    setActiveSlide(slideNumber);
  };

  if (loaders.onBoarding || loaders.roles) return <Loader visible />;

  const currentSlide: OnBoardingModel = onBoardingData[activeSlide];

  return (
    <>
      <StatusBar barStyle="dark-content" statusBarBackground={theme.colors.white} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text type="large" textType="bold" style={styles.title}>
            {currentSlide?.title}
          </Text>
          {onBoardingData.length > 0 && (
            <SnapCarousel
              carouselData={onBoardingData}
              carouselItem={renderCarousel}
              activeIndex={activeSlide}
              onSnapToItem={onSnapToItem}
              itemWidth={theme.viewport.width - 30}
              contentStyle={styles.imageView}
            />
          )}
          <Text type="large" textType="bold" style={styles.title}>
            {I18nService.t('iam')}
          </Text>
          <View style={styles.roleView}>
            {roles.length > 0 &&
              roles.map((item, index) => (
                <TouchableOpacity key={index} style={styles.roleContent}>
                  <SVGUri uri={item.iconUrl} height={40} width={40} stroke={theme.colors.active} strokeWidth={0.4} />
                  <Label type="regular" textType="semiBold" style={styles.role}>
                    {item.name}
                  </Label>
                </TouchableOpacity>
              ))}
          </View>
          <Label type="large" textType="regular" style={styles.helpText}>
            {`${I18nService.t('alreadyAccount')}  `}
            <Label type="large" textType="bold" style={styles.login}>
              {I18nService.t('login')}
            </Label>
          </Label>
        </View>
      </SafeAreaView>
    </>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    marginVertical: 60,
  },
  title: {
    textAlign: 'center',
    color: theme.colors.blackTint1,
  },
  imageView: {
    alignSelf: 'center',
  },
  roleView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 40,
  },
  roleContent: {
    alignItems: 'center',
  },
  role: {
    textAlign: 'center',
    marginVertical: 6,
    color: theme.colors.gray15,
  },
  helpText: {
    textAlign: 'center',
    color: theme.colors.darkTint3,
  },
  login: {
    textAlign: 'center',
    marginVertical: 6,
    color: theme.colors.primaryColor,
  },
});
