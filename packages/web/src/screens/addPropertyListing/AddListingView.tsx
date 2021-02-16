import React, { ReactElement } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { TabView } from 'react-native-tab-view';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';

import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { IListingUpdate, ListingService } from '@homzhub/common/src/services/Property/ListingService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import PropertySearch from '@homzhub/common/src/assets/images/propertySearch.svg';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { ActionController } from '@homzhub/common/src/components/organisms/ActionController';
import { AddressWithStepIndicator } from '@homzhub/common/src/components/molecules/AddressWithStepIndicator';
import PropertyVerification from '@homzhub/web/src/components/organisms/PropertyVerification';
import PropertyPayment from '@homzhub/common/src/components/organisms/PropertyPayment';
import { ValueAddedServicesView } from '@homzhub/common/src/components/organisms/ValueAddedServicesView';
import { Asset, LeaseTypes } from '@homzhub/common/src/domain/models/Asset';
import { ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { ISelectedValueServices, ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IRoutes, ListingRoutesWeb, Tabs } from '@homzhub/common/src/constants/Tabs';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IStateProps {
  selectedAssetPlan: ISelectedAssetPlan;
  assetDetails: Asset | null;
  valueAddedServices: ValueAddedService[];
}

interface IDispatchProps {
  resetState: () => void;
  getAssetById: () => void;
  setValueAddedServices: (payload: ISelectedValueServices) => void;
  getValueAddedServices: () => void;
  setAssetId: (id: number) => void;
  setFilter: (payload: IFilter) => void;
}

interface IProps {
  params?: any;
  onUploadDocument: () => any;
}

type Props = WithTranslation & IStateProps & IDispatchProps & IProps & IWithMediaQuery;

interface IOwnState {
  currentIndex: number;
  isStepDone: boolean[];
  isActionSheetToggled: boolean;
  leaseType: LeaseTypes;
  isSheetVisible: boolean;
  isNextStep: boolean;
  tabViewHeights: number[];
}

const { height, width } = theme.viewport;
const TAB_LAYOUT = {
  width: width - theme.layout.screenPadding * 2,
  height,
};

const isFixRequired = true;

class AddListingView extends React.PureComponent<Props, IOwnState> {
  public state = {
    currentIndex: 0,
    isStepDone: [],
    tabViewHeights: [height, height, height, height * 0.5],
    isActionSheetToggled: false,
    leaseType: LeaseTypes.Entire,
    isSheetVisible: false,
    isNextStep: false,
  };

  public static getDerivedStateFromProps(props: Props, state: IOwnState): IOwnState | null {
    const { assetDetails, params } = props;
    const { isNextStep } = state;
    if (assetDetails) {
      const {
        isVerificationRequired,
        isPropertyReady,
        listing: { stepList },
      } = assetDetails.lastVisitedStep;

      if (!isNextStep && isVerificationRequired) {
        return {
          ...state,
          currentIndex: 1,
          isStepDone: stepList,
        };
      }

      if (!isNextStep && isPropertyReady && params && params.isEditFlow) {
        return {
          ...state,
          currentIndex: 0,
          isStepDone: stepList,
        };
      }
    }

    return null;
  }

  public componentDidMount = (): void => {
    const { getAssetById, getValueAddedServices, assetDetails } = this.props;
    if (assetDetails) {
      this.setState({ leaseType: assetDetails.assetLeaseType });
      getValueAddedServices();
    } else {
      getAssetById();
    }
  };

  public componentDidUpdate = (prevProps: Readonly<Props>, prevState: Readonly<IOwnState>): void => {
    const { assetDetails, getValueAddedServices } = this.props;
    if (!prevProps.assetDetails && assetDetails) {
      getValueAddedServices();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ leaseType: assetDetails.assetLeaseType });
    }
  };

  public render(): React.ReactNode {
    const { currentIndex, isStepDone, isSheetVisible, tabViewHeights } = this.state;
    const {
      selectedAssetPlan: { selectedPlan },
      assetDetails,
    } = this.props;

    if (!assetDetails) return null;

    const {
      projectName,
      assetType: { name },
      address,
      country: { flag },
    } = assetDetails;

    const steps = this.getRoutes().map((route) => route.title);

    return (
      <>
        <AddressWithStepIndicator
          steps={steps}
          selectedPan={selectedPlan}
          badgeStyle={styles.badgeStyle}
          propertyType={name}
          countryFlag={flag}
          primaryAddress={projectName}
          subAddress={address}
          currentIndex={currentIndex}
          isStepDone={isStepDone}
          onPressSteps={this.handlePreviousStep}
        />
        {this.renderTabHeader()}
        <TabView
          lazy
          initialLayout={TAB_LAYOUT}
          renderScene={this.renderScene}
          onIndexChange={this.handleIndexChange}
          renderTabBar={(): null => null}
          swipeEnabled={false}
          navigationState={{
            index: currentIndex,
            routes: this.getRoutes(),
          }}
          style={{ height: tabViewHeights[currentIndex] }}
        />
        {!isFixRequired && (
          <Popover
            content={this.renderContinueView(assetDetails)}
            popupProps={{
              open: isSheetVisible,
              modal: true,
              children: undefined,
            }}
          >
            {this.renderContinueView(assetDetails)}
          </Popover>
        )}
      </>
    );
  }

  public renderTabHeader = (): ReactElement => {
    const {
      t,
      selectedAssetPlan: { selectedPlan },
      isMobile,
    } = this.props;
    const { currentIndex, leaseType, isActionSheetToggled } = this.state;
    const { key, title } = this.getRoutes()[currentIndex];

    const toggleActionSheet = (): void => this.setState({ isActionSheetToggled: !isActionSheetToggled });

    return (
      <View style={styles.tabHeader}>
        <View>
          {key === Tabs.ACTIONS && selectedPlan === TypeOfPlan.RENT && (
            <SelectionPicker
              data={[
                { title: t(LeaseTypes.Entire), value: LeaseTypes.Entire },
                { title: t(LeaseTypes.Shared), value: LeaseTypes.Shared },
              ]}
              selectedItem={[leaseType]}
              containerStyles={[styles.switchTab]}
              onValueChange={this.onTabChange}
              itemWidth={PlatformUtils.isWeb() && !isMobile ? 171 : 170}
            />
          )}
        </View>

        <View style={[styles.tabRows, isMobile && styles.tabRowsMobile]}>
          <View>
            <Text type="small" textType="semiBold">
              {title}
            </Text>
          </View>

          {[Tabs.VERIFICATIONS, Tabs.SERVICE_PAYMENT].includes(key) && (
            <Text type="small" textType="semiBold" style={styles.skip} onPress={this.handleSkip}>
              {t('common:skip')}
            </Text>
          )}
          {key === Tabs.ACTIONS && (
            <View style={[styles.tooltip, isMobile && styles.tooltipMobile]}>
              <Icon name={icons.tooltip} color={theme.colors.blue} size={26} onPress={toggleActionSheet} />
            </View>
          )}
        </View>
      </View>
    );
  };

  // TODO: Fix Popup UI (Note: Use same text only change UI)
  private renderContinueView = (assetDetails: Asset): ReactElement => {
    const { t } = this.props;
    const {
      lastVisitedStep: {
        isVerificationRequired,
        listing: { type },
      },
    } = assetDetails;

    const isReadyToPreview = type !== TypeOfPlan.MANAGE && !isVerificationRequired;
    const title = isReadyToPreview ? t('previewOwnProperty') : t('clickContinueToDashboard');

    return (
      <>
        <View style={styles.sheetContent}>
          <Text type="large" style={styles.sheetTitle}>
            {t('common:congratulations')}
          </Text>
          <Text type="small">{t('paymentSuccessMsg')}</Text>
          <PropertySearch />
          <Label type="large" style={styles.continue}>
            {title}
          </Label>
        </View>
        <Button
          type="primary"
          title={t('common:continue')}
          containerStyle={styles.buttonStyle}
          onPress={this.handleContinue}
        />
      </>
    );
  };

  private renderScene = ({ route }: { route: IRoutes }): React.ReactNode => {
    const { leaseType } = this.state;
    const {
      selectedAssetPlan: { selectedPlan },
      assetDetails,
      setValueAddedServices,
      valueAddedServices,
      onUploadDocument,
    } = this.props;
    if (!assetDetails) return null;

    switch (route.key) {
      case Tabs.VERIFICATIONS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 1)}>
            <PropertyVerification
              propertyId={assetDetails.id}
              typeOfPlan={selectedPlan}
              updateStep={this.handleNextStep}
              lastVisitedStep={assetDetails.lastVisitedStepSerialized}
              onUploadDocument={onUploadDocument}
            />
          </View>
        );
      case Tabs.SERVICE_PAYMENT:
        return (
          <View style={styles.service}>
            <ValueAddedServicesView
              propertyId={assetDetails.id}
              lastVisitedStep={assetDetails.lastVisitedStepSerialized}
              valueAddedServices={valueAddedServices}
              setValueAddedServices={setValueAddedServices}
              typeOfPlan={selectedPlan}
              handleNextStep={this.handleNextStep}
            />
            <PropertyPayment
              propertyId={assetDetails.id}
              lastVisitedStep={assetDetails.lastVisitedStepSerialized}
              valueAddedServices={valueAddedServices}
              setValueAddedServices={setValueAddedServices}
              typeOfPlan={selectedPlan}
              handleNextStep={this.handleNextStep}
            />
          </View>
        );
      default:
        return (
          <View onLayout={(e): void => this.onLayout(e, 0)}>
            <ActionController
              assetDetails={assetDetails}
              typeOfPlan={selectedPlan}
              leaseType={leaseType}
              onNextStep={this.handleNextStep}
              scrollToTop={this.scrollToTop}
              onLeaseTypeChange={this.onTabChange}
            />
          </View>
        );
    }
  };

  private onTabChange = (leaseType: LeaseTypes): void => {
    this.setState({ leaseType });
  };

  private onLayout = (e: LayoutChangeEvent, index: number): void => {
    const { tabViewHeights } = this.state;
    const { height: newHeight } = e.nativeEvent.layout;
    const arrayToUpdate = [...tabViewHeights];

    if (newHeight !== arrayToUpdate[index]) {
      arrayToUpdate[index] = newHeight;
      this.setState({ tabViewHeights: arrayToUpdate });
    }
  };

  public getRoutes = (): IRoutes[] => {
    const {
      selectedAssetPlan: { selectedPlan },
    } = this.props;
    const routes = ListingRoutesWeb;

    if (selectedPlan !== TypeOfPlan.MANAGE) {
      return routes;
    }

    return routes.filter((route) => route.key !== Tabs.VERIFICATIONS);
  };

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index });
    this.scrollToTop();
  };

  private handlePreviousStep = (index: number): void => {
    const { currentIndex } = this.state;
    const value = index - currentIndex;
    if (index < currentIndex) {
      this.setState({ currentIndex: currentIndex + value, isNextStep: true });
      this.scrollToTop();
    }
  };

  private handleContinue = (): void => {
    const { resetState, assetDetails } = this.props;
    this.setState({ isSheetVisible: false });
    resetState();

    if (assetDetails) {
      const {
        lastVisitedStep: {
          isPropertyReady,
          listing: { type },
        },
      } = assetDetails;
      if (isPropertyReady && type !== TypeOfPlan.MANAGE) {
        // TODO: Add Preview Logic
      } else {
        this.navigateToDashboard();
      }
    }
  };

  private handleNextStep = (): void => {
    const { currentIndex, isStepDone, isSheetVisible, isNextStep } = this.state;
    const { assetDetails, getAssetById } = this.props;

    ListingService.handleListingStep({
      currentIndex,
      isStepDone,
      getAssetById,
      assetDetails,
      isSheetVisible,
      isNextStep,
      scrollToTop: this.scrollToTop,
      routes: this.getRoutes(),
      updateState: this.updateState,
    });
  };

  private updateState = (data: IListingUpdate): void => {
    const { isNextStep, isSheetVisible, currentIndex, isStepDone } = data;
    this.setState((prevState) => ({
      ...prevState,
      ...(currentIndex && { currentIndex }),
      ...(isStepDone && { isStepDone }),
      isNextStep: isNextStep || false,
      isSheetVisible: isSheetVisible || false,
    }));
  };

  public handleSkip = (): void => {
    const { assetDetails } = this.props;
    const { currentIndex } = this.state;

    if (assetDetails && assetDetails.lastVisitedStep.isPropertyReady) {
      if (assetDetails.lastVisitedStep.listing.type !== TypeOfPlan.MANAGE) {
        // TODO: Add logic
      } else {
        this.navigateToDashboard();
      }
    } else if (currentIndex < this.getRoutes().length) {
      this.setState({ currentIndex: currentIndex + 1, isNextStep: true });
      this.scrollToTop();
    } else {
      this.navigateToDashboard();
    }
  };

  private navigateToDashboard = (): void => {
    const { resetState } = this.props;
    resetState();
    // TODO: Add logic
  };

  private scrollToTop = (): void => {
    setTimeout(() => {
      // TODO: Add logic
    }, 100);
  };
}
const addListingView = withMediaQuery<Props>(AddListingView);

const mapStateToProps = (state: IState): IStateProps => {
  const { getSelectedAssetPlan, getAssetDetails, getValueAddedServices } = RecordAssetSelectors;
  return {
    selectedAssetPlan: getSelectedAssetPlan(state),
    assetDetails: getAssetDetails(state),
    valueAddedServices: getValueAddedServices(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { resetState, getAssetById, setValueAddedServices, getValueAddedServices, setAssetId } = RecordAssetActions;
  const { setFilter } = SearchActions;
  return bindActionCreators(
    {
      resetState,
      getAssetById,
      setValueAddedServices,
      getValueAddedServices,
      setFilter,
      setAssetId,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(addListingView));

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabHeader: {
    paddingVertical: 16,
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  switchTab: {
    marginBottom: 4,
    marginTop: 20,
  },
  switchTabMobile: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 'auto',
  },
  tabRowsMobile: {
    marginTop: '6%',
    flex: 1,
  },
  tooltip: {
    left: 9,
  },
  tooltipMobile: {
    left: 'auto',
  },

  badgeStyle: {
    paddingVertical: 3,
    paddingHorizontal: 18,
    borderRadius: 2,
  },
  skip: {
    color: theme.colors.blue,
  },
  sheetContent: {
    alignItems: 'center',
    paddingTop: 40,
  },
  sheetTitle: {
    marginBottom: 8,
  },
  image: {
    marginVertical: 30,
  },
  continue: {
    marginBottom: 12,
    color: theme.colors.darkTint5,
  },
  buttonStyle: {
    flex: 0,
    marginHorizontal: 16,
    height: 50,
  },
  screenContent: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.layout.screenPadding,
  },
  service: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
