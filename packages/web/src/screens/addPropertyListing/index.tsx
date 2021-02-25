import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import ContinuePopup from '@homzhub/web/src/components/molecules/ContinuePopup';
import PlanSelection from '@homzhub/common/src/components/organisms/PlanSelection';
import AddListingView from '@homzhub/web/src/screens/addPropertyListing/AddListingView';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { useDispatch } from 'react-redux';

enum ComponentName {
  Listing_Plan_Selection = 'ListingPlanSelection',
  Add_Listing_Detail = 'AddListingDetail',
}

interface IListingProps {
  wasRedirected?: boolean;
}

const AddPropertyListing = (): React.ReactElement => {
  const history = useHistory<IListingProps>();
  const {
    location: { state },
  } = history;
  const { t } = useTranslation();
  const [scene, setScene] = useState(ComponentName.Listing_Plan_Selection);
  const Desktop = useOnly(deviceBreakpoint.DESKTOP);
  const Mobile = useOnly(deviceBreakpoint.MOBILE);
  const Tablet = useOnly(deviceBreakpoint.TABLET);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(RecordAssetActions.setAssetId(720));
  });
  const renderScene = (): React.ReactElement | null => {
    switch (scene) {
      case ComponentName.Listing_Plan_Selection:
        return (
          <PlanSelection
            carouselView={renderCarousel()}
            onSelectPlan={handlePlanSelection}
            onSkip={FunctionUtils.noop}
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
      <View style={styles.carouselView}>
        <Text>TODO: Add Advertisement Here</Text>
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
  },
});
