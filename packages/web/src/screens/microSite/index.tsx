import React, { FC, useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useDown, useViewPort } from '@homzhub/common/src/utils/MediaQueryUtils';
import MetaTags from '@homzhub/web/src/components/atoms/MetaTags';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import LandingNavBar from '@homzhub/web/src/screens/landing/components/LandingNavBar';
import BannerVideo from '@homzhub/web/src/screens/microSite/components/BannerVideo';
import Properties from '@homzhub/web/src/screens/microSite/components/Properties';
import HomzhubServices from '@homzhub/web/src/screens/microSite/components/HomzhubServices';
import LimitedOfferPopUp from '@homzhub/web/src/screens/microSite/components/LimitedOfferPopUp';
import OverViewSteps from '@homzhub/web/src/screens/microSite/components/OverViewSteps';
import StartYourInvestment from '@homzhub/web/src/screens/microSite/components/StartYourInvestment';
import Testimonials from '@homzhub/web/src/screens/microSite/components/Testimonials';
import OurServicesSection from '@homzhub/web/src/screens/landing/components/OurServicesSection';
import FooterWithSocialMedia from '@homzhub/web/src/screens/landing/components/FooterWithSocialMedia';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const MicroSite: FC = () => {
  const [storeLinksRef, setStoreLinksRef] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const storeLinkSectionRef = (element: any): void => {
    setStoreLinksRef(element);
  };
  useEffect(() => {
    setIsInitialized(true);
  }, [isInitialized]);
  return (
    <View>
      <ExitTriggeredPopup isInitialized={isInitialized} />
      <MetaTags title="Maharashtra Connect" />
      <LandingNavBar storeLinksSectionRef={storeLinksRef} />
      <BannerVideo />
      <OverViewSteps />
      <HomzhubServices />
      <StartYourInvestment />
      <Properties />
      <Testimonials />
      <OurServicesSection scrollRef={storeLinkSectionRef} />
      <FooterWithSocialMedia />
    </View>
  );
};

interface IExitPopupProps {
  isInitialized: boolean;
}
const ExitTriggeredPopup = (props: IExitPopupProps): React.ReactElement<IExitPopupProps> => {
  const { isInitialized } = props;
  const popupRef = useRef<PopupActions>(null);
  const totalWidth = useViewPort().width;
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  let plzSubscribedTimer: NodeJS.Timeout;
  const handlePopup = (e: MouseEvent): void => {
    if (!e.relatedTarget) {
      if (popupRef && popupRef.current) {
        popupRef.current.open();
      }
    }
  };
  const handlePopupClose = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
      clearTimeout(plzSubscribedTimer);
      document.removeEventListener('mouseout', handlePopup);
    }
  };
  useEffect(() => {
    const DELAY_POPUP_DISPLAY_TIME = 20000;
    plzSubscribedTimer = setTimeout(() => {
      if (popupRef && popupRef.current) {
        popupRef.current.open();
      }
    }, DELAY_POPUP_DISPLAY_TIME);
    document.addEventListener('mouseout', handlePopup);
    return (): void => {
      document.removeEventListener('mouseout', handlePopup);
      clearTimeout(plzSubscribedTimer);
    };
  }, [isInitialized]);
  const scaleX = isTablet ? (isMobile ? 0.9 : 0.7) : 0.5;
  const containerStyle = {
    width: totalWidth * scaleX,
    maxWidth: 'fit-content',
  };
  return (
    <Popover
      forwardedRef={popupRef}
      content={<LimitedOfferPopUp handlePopupClose={handlePopupClose} />}
      popupProps={{
        closeOnDocumentClick: true,
        children: undefined,
        modal: true,
        onClose: handlePopupClose,
        contentStyle: containerStyle,
      }}
    />
  );
};
export default MicroSite;
