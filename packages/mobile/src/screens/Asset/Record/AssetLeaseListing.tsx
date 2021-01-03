import React, { ReactElement } from 'react';
import { KeyboardAvoidingView, LayoutChangeEvent, ScrollView, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { TabView } from 'react-native-tab-view';
import { CommonActions } from '@react-navigation/native';
// @ts-ignore
import Markdown from 'react-native-easy-markdown';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import PropertySearch from '@homzhub/common/src/assets/images/propertySearch.svg';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import {
  ActionController,
  AddressWithStepIndicator,
  BottomSheet,
  Header,
  Loader,
} from '@homzhub/mobile/src/components';
import PropertyVerification from '@homzhub/mobile/src/components/organisms/PropertyVerification';
import PropertyPayment from '@homzhub/mobile/src/components/organisms/PropertyPayment';
import { ValueAddedServicesView } from '@homzhub/mobile/src/components/organisms/ValueAddedServicesView';
import { Asset, LeaseTypes } from '@homzhub/common/src/domain/models/Asset';
import { ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { ISelectedValueServices, ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';

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
  setFilter: (payload: IFilter) => void;
}

type libraryProps = NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AssetLeaseListing>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

interface IRoutes {
  key: RouteKeys;
  title: string;
}

interface IOwnState {
  currentIndex: number;
  isStepDone: boolean[];
  isActionSheetToggled: boolean;
  leaseType: LeaseTypes;
  isSheetVisible: boolean;
  isNextStep: boolean;
  tabViewHeights: number[];
}

enum RouteKeys {
  Actions = 'actions',
  Verification = 'verification',
  Services = 'services',
  Payment = 'payment',
}
const { height, width } = theme.viewport;
const TAB_LAYOUT = {
  width: width - theme.layout.screenPadding * 2,
  height,
};

class AssetLeaseListing extends React.PureComponent<Props, IOwnState> {
  private scrollRef = React.createRef<ScrollView>();
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
    const {
      assetDetails,
      route: { params },
    } = props;
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

    if (!assetDetails) return <Loader visible />;

    const {
      projectName,
      assetType: { name },
      address,
      country: { flag },
    } = assetDetails;

    const steps = this.getRoutes().map((route) => route.title);

    return (
      <>
        <Header icon={icons.leftArrow} title={this.getHeader()} onIconPress={this.goBack} />
        <KeyboardAvoidingView style={styles.flexOne} behavior={PlatformUtils.isIOS() ? 'padding' : undefined}>
          <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.screenContent}
            showsVerticalScrollIndicator={false}
            ref={this.scrollRef}
          >
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
          </ScrollView>
        </KeyboardAvoidingView>
        {this.openActionBottomSheet()}
        <BottomSheet
          visible={isSheetVisible}
          isCloseOnDrag={false}
          renderHeader={false}
          sheetHeight={450}
          onCloseSheet={this.onCloseSheet}
        >
          {this.renderContinueView(assetDetails)}
        </BottomSheet>
      </>
    );
  }

  public renderTabHeader = (): ReactElement => {
    const {
      t,
      selectedAssetPlan: { selectedPlan },
    } = this.props;
    const { currentIndex, leaseType, isActionSheetToggled } = this.state;
    const { key, title } = this.getRoutes()[currentIndex];

    const toggleActionSheet = (): void => this.setState({ isActionSheetToggled: !isActionSheetToggled });

    return (
      <View style={styles.tabHeader}>
        {key === RouteKeys.Actions && selectedPlan === TypeOfPlan.RENT && (
          <SelectionPicker
            data={[
              { title: t(LeaseTypes.Entire), value: LeaseTypes.Entire },
              { title: t(LeaseTypes.Shared), value: LeaseTypes.Shared },
            ]}
            selectedItem={[leaseType]}
            containerStyles={styles.switchTab}
            onValueChange={this.onTabChange}
          />
        )}
        <View style={styles.tabRows}>
          <Text type="small" textType="semiBold">
            {title}
          </Text>
          {[RouteKeys.Verification, RouteKeys.Services].includes(key) && (
            <Text type="small" textType="semiBold" style={styles.skip} onPress={this.handleSkip}>
              {t('common:skip')}
            </Text>
          )}
          {key === RouteKeys.Actions && (
            <Icon name={icons.tooltip} color={theme.colors.blue} size={26} onPress={toggleActionSheet} />
          )}
        </View>
        {key === RouteKeys.Verification && (
          <>
            <Label type="regular" textType="regular" style={styles.verificationSubtitle}>
              {t('propertyVerificationSubTitle')}
            </Label>
            <Label
              type="large"
              textType="semiBold"
              style={styles.helperText}
              onPress={this.navigateToVerificationHelper}
            >
              {t('helperNavigationText')}
            </Label>
          </>
        )}
      </View>
    );
  };

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
          <PropertySearch style={styles.image} />
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
    } = this.props;
    const isManage = selectedPlan === TypeOfPlan.MANAGE;

    if (!assetDetails) return null;

    switch (route.key) {
      case RouteKeys.Verification:
        return (
          <View onLayout={(e): void => this.onLayout(e, 1)}>
            <PropertyVerification
              propertyId={assetDetails.id}
              typeOfPlan={selectedPlan}
              updateStep={this.handleNextStep}
              lastVisitedStep={assetDetails.lastVisitedStepSerialized}
            />
          </View>
        );
      case RouteKeys.Services:
        return (
          <View onLayout={(e): void => this.onLayout(e, isManage ? 1 : 2)}>
            <ValueAddedServicesView
              propertyId={assetDetails.id}
              lastVisitedStep={assetDetails.lastVisitedStepSerialized}
              valueAddedServices={valueAddedServices}
              setValueAddedServices={setValueAddedServices}
              typeOfPlan={selectedPlan}
              handleNextStep={this.handleNextStep}
            />
          </View>
        );
      case RouteKeys.Payment:
        return (
          <View onLayout={(e): void => this.onLayout(e, isManage ? 2 : 3)}>
            <PropertyPayment
              goBackToService={this.goBackToServices}
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

  private onCloseSheet = (): void => {
    this.setState({ isSheetVisible: false });
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

  private openActionBottomSheet = (): React.ReactNode => {
    const { isActionSheetToggled } = this.state;
    const {
      t,
      selectedAssetPlan: { selectedPlan },
    } = this.props;
    const closeActionSheet = (): void => this.setState({ isActionSheetToggled: false });
    if (!isActionSheetToggled) {
      return null;
    }
    return (
      <BottomSheet
        visible={isActionSheetToggled}
        onCloseSheet={closeActionSheet}
        headerTitle={selectedPlan === TypeOfPlan.RENT ? t('lease') : t('terms')}
        sheetHeight={500}
        isShadowView
      >
        <Markdown
          markdownStyles={{
            h2: { fontWeight: '600', fontSize: 20, marginVertical: 10 },
            h4: { fontWeight: '300', fontSize: 24, color: theme.colors.darkTint2 },
            strong: { fontWeight: '600', fontSize: 16 },
            text: { fontWeight: 'normal', fontSize: 14 },
          }}
          style={{ margin: theme.layout.screenPadding }}
        >
          {`${selectedPlan} Helper Text`}
        </Markdown>
      </BottomSheet>
    );
  };

  public getRoutes = (): IRoutes[] => {
    const {
      t,
      selectedAssetPlan: { selectedPlan },
    } = this.props;
    const routes = [
      { key: RouteKeys.Actions, title: t('actions') },
      { key: RouteKeys.Verification, title: t('verification') },
      { key: RouteKeys.Services, title: t('services') },
      { key: RouteKeys.Payment, title: t('payment') },
    ];

    if (selectedPlan !== TypeOfPlan.MANAGE) {
      return routes;
    }

    return routes.filter((route) => route.key !== RouteKeys.Verification);
  };

  public getHeader = (): string => {
    const {
      t,
      selectedAssetPlan: { selectedPlan },
    } = this.props;
    switch (selectedPlan) {
      case TypeOfPlan.RENT:
        return t('rent');
      case TypeOfPlan.SELL:
        return t('sell');
      default:
        return t('manage');
    }
  };

  private goBack = (): void => {
    const {
      navigation,
      route: { params },
      resetState,
    } = this.props;

    if (params && params.previousScreen === ScreensKeys.Dashboard) {
      resetState();
    }

    navigation.goBack();
  };

  private goBackToServices = (): void => {
    const { currentIndex } = this.state;
    this.setState({ currentIndex: currentIndex - 1 });
    this.scrollToTop();
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
        this.navigateToPreview(assetDetails);
      } else {
        this.navigateToDashboard();
      }
    }
  };

  private navigateToPreview = (assetDetails: Asset): void => {
    const { navigation, setFilter, resetState } = this.props;
    const {
      id,
      leaseListingIds,
      saleListingIds,
      lastVisitedStep: {
        listing: { type },
      },
    } = assetDetails;
    const planType = type === TypeOfPlan.RENT ? 0 : 1;
    setFilter({ asset_transaction_type: planType });
    const saleId = saleListingIds && saleListingIds.length > 0 ? saleListingIds[0] : 0;
    const leaseId = leaseListingIds && leaseListingIds.length > 0 ? leaseListingIds[0] : 0;

    const propertyTermId = type === TypeOfPlan.RENT && leaseId > 0 ? leaseId : saleId;
    this.setState({
      isNextStep: false,
    });
    navigation.navigate(ScreensKeys.PropertyAssetDescription, {
      propertyTermId,
      isPreview: true,
      propertyId: id,
    });
    resetState();
  };

  private handleNextStep = (): void => {
    const { currentIndex, isStepDone } = this.state;
    const {
      getAssetById,
      assetDetails,
      route: { params },
    } = this.props;
    const newStepDone: boolean[] = isStepDone;
    newStepDone[currentIndex] = true;

    this.setState({
      isStepDone: newStepDone,
      isNextStep: true,
    });

    if (assetDetails) {
      const {
        isPropertyReady,
        listing: { isPaymentDone },
      } = assetDetails.lastVisitedStep;
      if (currentIndex === 0 && params && params.isEditFlow) {
        this.setState({ currentIndex: currentIndex + 1 });
        getAssetById();
        this.scrollToTop();
      } else if ((currentIndex === 1 || isPropertyReady) && isPaymentDone) {
        this.navigateToPreview(assetDetails);
      } else if (currentIndex < this.getRoutes().length - 1) {
        this.setState({ currentIndex: currentIndex + 1 });
        getAssetById();
        this.scrollToTop();
      } else {
        this.setState({ isSheetVisible: true });
      }
    }
  };

  private navigateToVerificationHelper = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.MarkdownScreen, { title: 'Property Verification', isFrom: 'verification' });
  };

  public handleSkip = (): void => {
    const { assetDetails } = this.props;
    const { currentIndex } = this.state;

    if (assetDetails && assetDetails.lastVisitedStep.isPropertyReady) {
      if (assetDetails.lastVisitedStep.listing.type !== TypeOfPlan.MANAGE) {
        this.navigateToPreview(assetDetails);
      } else {
        this.navigateToDashboard();
      }
    } else if (currentIndex < this.getRoutes().length - 2) {
      this.setState({ currentIndex: currentIndex + 1, isNextStep: true });
      this.scrollToTop();
    } else {
      this.navigateToDashboard();
    }
  };

  private navigateToDashboard = (): void => {
    const { navigation, resetState } = this.props;
    resetState();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreensKeys.BottomTabs }],
      })
    );
  };

  private scrollToTop = (): void => {
    setTimeout(() => {
      this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }, 100);
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getSelectedAssetPlan, getAssetDetails, getValueAddedServices } = RecordAssetSelectors;
  return {
    selectedAssetPlan: getSelectedAssetPlan(state),
    assetDetails: getAssetDetails(state),
    valueAddedServices: getValueAddedServices(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { resetState, getAssetById, setValueAddedServices, getValueAddedServices } = RecordAssetActions;
  const { setFilter } = SearchActions;
  return bindActionCreators(
    {
      resetState,
      getAssetById,
      setValueAddedServices,
      getValueAddedServices,
      setFilter,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(AssetLeaseListing));

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
  },
  switchTab: {
    marginBottom: 20,
    marginTop: 4,
  },
  tabRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeStyle: {
    paddingVertical: 3,
    paddingHorizontal: 18,
    borderRadius: 2,
  },
  helperText: {
    color: theme.colors.primaryColor,
  },
  verificationSubtitle: {
    marginTop: 12,
    marginBottom: 8,
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
  },
  screenContent: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.layout.screenPadding,
  },
});
