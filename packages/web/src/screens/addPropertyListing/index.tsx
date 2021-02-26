import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CarouselProps } from 'react-multi-carousel';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { AssetAdvertisement } from '@homzhub/common/src/domain/models/AssetAdvertisement';
import { theme } from '@homzhub/common/src/styles/theme';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import ContinuePopup from '@homzhub/web/src/components/molecules/ContinuePopup';
import PlanSelection from '@homzhub/common/src/components/organisms/PlanSelection';
import AddListingView from '@homzhub/web/src/screens/addPropertyListing/AddListingView';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

enum ComponentName {
  Listing_Plan_Selection = 'ListingPlanSelection',
  Add_Listing_Detail = 'AddListingDetail',
}

const CarouselResponsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1304 },
    items: 1,
    slidesToSlide: 1,
  },
  desktop: {
    breakpoint: { max: 1303, min: 1248 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1248, min: 768 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const customCarouselProps: CarouselProps = {
  children: undefined,
  arrows: false,
  draggable: true,
  focusOnSelect: false,
  renderButtonGroupOutside: true,
  responsive: CarouselResponsive,
  showDots: true,
};
export interface IListingProps {
  wasRedirected?: boolean;
}

const AddPropertyListing = (): React.ReactElement => {
  const history = useHistory<IListingProps>();
  const {
    location: { state },
  } = history;
  const { t } = useTranslation();
  const [scene, setScene] = useState(ComponentName.Listing_Plan_Selection);
  const [banners, setBanners] = useState<AssetAdvertisement>();
  const dispatch = useDispatch();
  const Desktop = useOnly(deviceBreakpoint.DESKTOP);
  const Mobile = useOnly(deviceBreakpoint.MOBILE);
  const Tablet = useOnly(deviceBreakpoint.TABLET);
  // TODO: (WEB) Remove this once your add property and add listing flow connected,this is just for testing purpose
  useEffect(() => {
    dispatch(RecordAssetActions.setAssetId(704));
  });

  // TODO: remove the commented code once the API issue from chrome is resolved

  // useEffect(() => {
  //   const requestPayload = {
  //     category: 'service',
  //   };
  //   DashboardRepository.getAdvertisements(requestPayload)
  //     .then((response) => {
  //       console.log('res ===> ', response);
  //       setBanners(response);
  //     })
  //     .catch((e) => {
  //       console.log('err===>', e);
  //       const error = ErrorUtils.getErrorMessage(e.details);
  //       AlertHelper.error({ message: error });
  //     });
  // }, []);

  const renderScene = (): React.ReactElement | null => {
    switch (scene) {
      case ComponentName.Listing_Plan_Selection:
        return (
          <PlanSelection
            carouselView={renderCarousel()}
            onSelectPlan={handlePlanSelection}
            onSkip={FunctionUtils.noop}
            isDesktop={Desktop}
            isMobile={Mobile}
            isTablet={Tablet}
          />
        );
      case ComponentName.Add_Listing_Detail:
        return (
          <AddListingView
            onUploadDocument={FunctionUtils.noop}
            isDesktop={Desktop}
            isMobile={Mobile}
            isTablet={Tablet}
            history={history}
          />
        );
      default:
        return null;
    }
  };

  const renderCarousel = (): React.ReactElement => {
    const popupDetails = {
      title: t('common:congratulations'),
      subTitle: t('property:paymentSuccessMsg'),
      buttonSubText: t('property:clickContinue'),
      buttonTitle: t('common:continue'),
    };
    return (
      <View style={[styles.carouselView, Mobile && styles.carouselViewMobile]}>
        <MultiCarousel passedProps={customCarouselProps}>
          {/* {banners?.results.map((item) => ( */}
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{
                uri: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/advertisements/f205f192f15d49fa994632d641463fb2.svg',
                // 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/c363134df8194ef1b42d56d0bc76694a.svg'
              }}
              // source={{ uri: item.attachment.link }}        //Same todo as above
            />
          </View>
          {/* // ))} */}
        </MultiCarousel>
        {state && state.wasRedirected && <ContinuePopup isOpen isSvg={false} {...popupDetails} />}
      </View>
    );
  };

  const handlePlanSelection = (): void => {
    setScene(ComponentName.Add_Listing_Detail);
  };

  return <View style={styles.container}>{renderScene()}</View>;
};

export default AddPropertyListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  carouselView: {
    backgroundColor: theme.colors.white,
    flex: 1,
    marginLeft: 12,
    height: 'fit-content',
    paddingBottom: 12,
  },
  carouselViewMobile: {
    marginTop: 20,
    marginLeft: 0,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  image: {
    width: 525,
    height: 330,
  },
});
