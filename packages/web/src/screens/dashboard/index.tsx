import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { NavigationUtils } from 'utils/NavigationUtils';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { RouteNames, ScreensKeys } from '@homzhub/web/src/router/RouteNames';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import UserSubscriptionPlan from '@homzhub/common/src/components/molecules/UserSubscriptionPlan';
import InvestmentsCarousel from '@homzhub/web/src/screens/dashboard/components/InvestmentsCarousel';
import MarketTrendsCarousel from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCarousel';
import PropertyUpdates from '@homzhub/web/src/screens/dashboard/components/PropertyUpdates';
import PropertyOverview from '@homzhub/web/src/screens/dashboard/components/PropertyOverview';
import { PropertyVisualsEstimates } from '@homzhub/web/src/screens/dashboard/components/PropertyVisualEstimates';
import VacantProperties from '@homzhub/web/src/screens/dashboard/components/VacantProperties';
import { PendingPropertiesCard } from '@homzhub/web/src/components';
import { Asset, PropertyStatus } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { IActions } from '@homzhub/common/src/domain/models/AssetPlan';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';


const Dashboard: FC = () => {
  const history = useHistory();
  const notMobile = useUp(deviceBreakpoint.TABLET);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);
  const selectedCountry: number = useSelector(UserSelector.getUserCountryCode);
  const [pendingProperty, setPendingProperty] = useState({} as Asset[]);
  const [vacantProperty, setVacantProperty] = useState({} as Asset[]);
  const [propertyMetrics, setPropertyMetrics] = useState({} as AssetMetrics);

  const onCompleteDetails = (assetId: number): void => {
    dispatch(RecordAssetActions.setAssetId(assetId));
    dispatch(RecordAssetActions.setEditPropertyFlow(true));
    NavigationUtils.navigate(history, {
      path: RouteNames.protectedRoutes.PROPERTY_VIEW,
      params: {
        previousScreen: ScreensKeys.Dashboard,
      },
    });
  };

  const handleActionSelection = (item: IActions, assetId: number): void => {
    dispatch(RecordAssetActions.setAssetId(assetId));
    dispatch(RecordAssetActions.setSelectedPlan({ id: item.id, selectedPlan: item.type }));
    NavigationUtils.navigate(history, {
      path: RouteNames.protectedRoutes.ADD_LISTING,
      params: {
        previousScreen: ScreensKeys.Dashboard,
      },
    });
  };

  const onViewProperty = (id: number): void => {
    NavigationUtils.navigate(history, {
      path: RouteNames.protectedRoutes.PROPERTY_SELECTED,
      params: { propertyId: id },
    });
  };
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(UserActions.getUserPreferences());
      dispatch(UserActions.getUserProfile());
      dispatch(UserActions.getFavouriteProperties());
      dispatch(UserActions.getAssets());
      dispatch(CommonActions.getCountries());
    }
    getPendingPropertyDetails(setPendingProperty).then();
    getPropertyMetrics((response) => setPropertyMetrics(response)).then();
    getVacantPropertyDetails((response) => setVacantProperty(response)).then();
  }, [dispatch, isLoggedIn]);

  const PendingPropertyAndUserSubscriptionComponent = (): React.ReactElement => (
    <>
      <PendingPropertiesCard
        data={pendingProperty}
        onPressComplete={onCompleteDetails}
        onSelectAction={handleActionSelection}
        onViewProperty={onViewProperty}
      />
      <UserSubscriptionPlan onApiFailure={FunctionUtils.noop} />
    </>
  );
  return (
    <View style={styles.container}>
      <PropertyOverview data={propertyMetrics?.assetMetrics?.miscellaneous ?? []} />
      <PropertyUpdates updatesData={propertyMetrics?.updates ?? {}} />
      <PropertyVisualsEstimates selectedCountry={selectedCountry} />
      {notMobile ? (
        <View style={[styles.wrapper, notMobile && styles.row]}>
          <PendingPropertyAndUserSubscriptionComponent />
        </View>
      ) : (
        <PendingPropertyAndUserSubscriptionComponent />
      )}
      <VacantProperties data={vacantProperty} />
      <InvestmentsCarousel />
      <MarketTrendsCarousel />
    </View>
  );
};

const getPendingPropertyDetails = async (callback: (response: Asset[]) => void): Promise<void> => {
  try {
    const response: Asset[] = await AssetRepository.getPropertiesByStatus(PropertyStatus.PENDING);
    callback(response);
  } catch (e) {
    // todo handle error here
  }
};

const getPropertyMetrics = async (callback: (response: AssetMetrics) => void): Promise<void> => {
  try {
    const response: AssetMetrics = await DashboardRepository.getAssetMetrics();
    callback(response);
  } catch (e) {
    // todo handle error here
  }
};
const getVacantPropertyDetails = async (callback: (response: Asset[]) => void): Promise<void> => {
  try {
    const response: Asset[] = await PortfolioRepository.getUserAssetDetails(Filters.VACANT);
    callback(response);
  } catch (e) {
    // todo handle error here
  }
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
});
