import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TabView } from 'react-native-tab-view';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { AddressWithStepIndicator, BottomSheet, PropertyPayment } from '@homzhub/mobile/src/components';
import { ValueAddedServicesView } from '@homzhub/mobile/src/components/organisms/ValueAddedServicesView';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { ISelectedValueServices } from '@homzhub/common/src/domain/models/ValueAddedService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type IProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.ServicesForSelectedAsset>;

interface IRoutes {
  key: string;
  title: string;
}

enum RouteKeys {
  Services = 'services',
  Payment = 'payment',
}

const { height, width } = theme.viewport;
const TAB_LAYOUT = {
  width: width - theme.layout.screenPadding * 2,
  height,
};

export const ServicesForSelectedAsset = (props: IProps): ReactElement => {
  const {
    navigation,
    route: {
      params: { propertyId, projectName, assetType, address, flag, serviceByIds, badgeInfo, amenities },
    },
  } = props;
  const { t, i18n, ready: tReady } = useTranslation(LocaleConstants.namespacesKey.assetMore);

  // Constants
  const Routes: IRoutes[] = [
    { key: RouteKeys.Services, title: t('valueAddedServices') },
    { key: RouteKeys.Payment, title: t('property:payment') },
  ];
  const Steps = [RouteKeys.Services, RouteKeys.Payment];

  // Local State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [showGoBackCaution, setShowGoBackCaution] = useState(false);
  const [stepPositionArr, setStepPositionArr] = useState<boolean[]>([true, false]);
  const [tabViewHeights, setTabViewHeights] = useState<number[]>([height, height]);

  // Redux
  const dispatch = useDispatch();
  const valueAddedServices = useSelector(RecordAssetSelectors.getValueAddedServices);

  useEffect(() => {
    dispatch(RecordAssetActions.getValueAddedServices({ ...serviceByIds }));
    setLoading(false);
  }, []);

  const render = (): ReactElement => {
    const goBack = (): void => {
      onBackPress(true);
    };

    return (
      <UserScreen
        loading={loading}
        title={t('more')}
        pageTitle={t('selectedProperty')}
        onBackPress={goBack}
        rightNode={renderRightHandHeader()}
      >
        <View>
          <AddressWithStepIndicator
            steps={Steps}
            propertyType={assetType}
            primaryAddress={projectName}
            subAddress={address}
            countryFlag={flag}
            currentIndex={currentIndex}
            isStepDone={stepPositionArr}
            onPressSteps={onStepPress}
            badgeInfo={badgeInfo}
            amenities={amenities}
            stepIndicatorSeparatorStyle={{ width: width / 1.7 }}
          />
          {renderTabHeader()}
          <TabView
            initialLayout={TAB_LAYOUT}
            renderScene={renderScene}
            onIndexChange={handleIndexChange}
            renderTabBar={(): null => null}
            swipeEnabled={false}
            navigationState={{
              index: currentIndex,
              routes: Routes,
            }}
            style={{ height: tabViewHeights[currentIndex] }}
          />
          <BottomSheet
            visible={bottomSheetVisible}
            headerTitle={showGoBackCaution ? t('common:backText') : t('common:changePropertyText')}
            sheetHeight={350}
            onCloseSheet={onSheetClose}
          >
            <View style={styles.bottomSheet}>
              <Text type="small">{showGoBackCaution ? t('goBackCaution') : t('changePropertyCaution')}</Text>
              <Text type="small" style={styles.message}>
                {t('common:wantToContinue')}
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  type="secondary"
                  title={showGoBackCaution ? t('common:yes') : t('common:continue')}
                  titleStyle={styles.buttonTitle}
                  onPress={navigation.goBack}
                  containerStyle={styles.editButton}
                />
                <Button
                  type="primary"
                  title={showGoBackCaution ? t('common:no') : t('common:cancel')}
                  onPress={onSheetClose}
                  titleStyle={styles.buttonTitle}
                  containerStyle={styles.doneButton}
                />
              </View>
            </View>
          </BottomSheet>
        </View>
      </UserScreen>
    );
  };

  const renderScene = ({ route }: { route: IRoutes }): any => {
    switch (route.key) {
      case RouteKeys.Services:
        return (
          <View onLayout={(e): void => onLayout(e, 0)}>
            <ValueAddedServicesView
              propertyId={propertyId}
              valueAddedServices={valueAddedServices}
              setValueAddedServices={setValueAddedServices}
              handleNextStep={handleNextStep}
            />
          </View>
        );
      case RouteKeys.Payment:
        return (
          <View onLayout={(e): void => onLayout(e, 1)}>
            <PropertyPayment
              i18n={i18n}
              tReady={tReady}
              t={t}
              goBackToService={goBackToServices}
              propertyId={propertyId}
              valueAddedServices={valueAddedServices}
              setValueAddedServices={setValueAddedServices}
              handleNextStep={onSuccessFullPayment}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const renderTabHeader = (): ReactElement => {
    const tabTitle = Routes[currentIndex].title;
    return (
      <View style={styles.tabHeader}>
        <Text type="small" textType="semiBold" style={styles.title}>
          {tabTitle}
        </Text>
      </View>
    );
  };

  const renderRightHandHeader = (): ReactElement => {
    const onChangePress = (): void => {
      onBackPress(false);
    };
    return (
      <TouchableOpacity onPress={onChangePress}>
        <Text type="small" textType="semiBold" style={styles.changeText}>
          {t('common:change')}
        </Text>
      </TouchableOpacity>
    );
  };

  const onStepPress = (index: number): void => {
    const value = index - currentIndex;
    if (index < currentIndex) {
      setCurrentIndex(currentIndex + value);
    }
  };

  const handleIndexChange = (index: number): void => {
    setCurrentIndex(index);
    setStepPositionArr([false, true]);
  };

  const goBackToServices = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextStep = (): void => {
    if (currentIndex < Routes.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const onSheetClose = (): void => {
    setBottomSheetVisible(false);
  };

  const onBackPress = (isBackPressed: boolean): void => {
    if (valueAddedServices.filter((service) => service.value).length === 0) {
      navigation.goBack();
    }
    setShowGoBackCaution(isBackPressed);
    setBottomSheetVisible(true);
  };

  const onSuccessFullPayment = (): void => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreensKeys.MoreScreen }],
      })
    );
  };

  const setValueAddedServices = (payload: ISelectedValueServices): void => {
    dispatch(RecordAssetActions.setValueAddedServices(payload));
  };

  const onLayout = (e: LayoutChangeEvent, index: number): void => {
    const { height: newHeight } = e.nativeEvent.layout;
    const arrayToUpdate = [...tabViewHeights];

    if (newHeight !== arrayToUpdate[index]) {
      arrayToUpdate[index] = newHeight;
      setTabViewHeights(arrayToUpdate);
    }
  };

  return render();
};

const styles = StyleSheet.create({
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
  },
  title: {
    paddingVertical: 16,
  },
  changeText: {
    color: theme.colors.primaryColor,
  },
  message: {
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  editButton: {
    marginLeft: 10,
    flexDirection: 'row-reverse',
  },
  doneButton: {
    flexDirection: 'row-reverse',
  },
  buttonTitle: {
    marginHorizontal: 4,
  },
  bottomSheet: {
    paddingHorizontal: theme.layout.screenPadding,
  },
});
