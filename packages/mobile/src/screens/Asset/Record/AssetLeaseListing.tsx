import React, { ReactElement } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { CommonActions } from '@react-navigation/native';
import { TabView } from 'react-native-tab-view';
// @ts-ignore
import Markdown from 'react-native-easy-markdown';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { images } from '@homzhub/common/src/assets/images';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { Button, Image, Label, RNSwitch, Text } from '@homzhub/common/src/components';
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
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';

interface IStateProps {
  selectedAssetPlan: ISelectedAssetPlan;
  assetId: number;
  assetDetails: Asset | null;
}

interface IDispatchProps {
  resetState: () => void;
  getAssetById: () => void;
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
  isPropertyAsUnits: boolean;
  isSheetVisible: boolean;
}

enum RouteKeys {
  Actions = 'actions',
  Verification = 'verification',
  Services = 'services',
  Payment = 'payment',
}

class AssetLeaseListing extends React.PureComponent<Props, IOwnState> {
  private scrollRef = React.createRef<ScrollView>();
  public state = {
    currentIndex: 0,
    isStepDone: [],
    isActionSheetToggled: false,
    isPropertyAsUnits: false,
    isSheetVisible: false,
  };

  public componentDidMount(): void {
    const { getAssetById } = this.props;
    getAssetById();
  }

  public render(): React.ReactNode {
    const { currentIndex, isStepDone, isSheetVisible } = this.state;
    const {
      selectedAssetPlan: { selectedPlan },
      assetDetails,
    } = this.props;

    const badge = PropertyUtils.getListingBadge(selectedPlan);
    if (!assetDetails) return null;

    const {
      projectName,
      assetType: { name },
      address,
    } = assetDetails;

    const steps = this.getRoutes().map((route) => route.title);

    return (
      <>
        <Header icon={icons.leftArrow} title={this.getHeader()} onIconPress={this.goBack} />
        <ScrollView style={styles.screen} showsVerticalScrollIndicator={false} ref={this.scrollRef}>
          <AddressWithStepIndicator
            steps={steps}
            badge={badge}
            badgeStyle={styles.badgeStyle}
            propertyType={name}
            primaryAddress={projectName}
            subAddress={address}
            currentIndex={currentIndex}
            isStepDone={isStepDone}
            onPressSteps={this.handlePreviousStep}
          />
          {this.renderTabHeader()}
          <TabView
            lazy
            renderLazyPlaceholder={(): React.ReactElement => <Loader visible />}
            removeClippedSubviews
            initialLayout={theme.viewport}
            // @ts-ignore
            renderScene={this.renderScene}
            onIndexChange={this.handleIndexChange}
            renderTabBar={(): null => null}
            swipeEnabled={false}
            navigationState={{
              index: currentIndex,
              routes: this.getRoutes(),
            }}
          />
        </ScrollView>
        {this.openActionBottomSheet()}
        <BottomSheet visible={isSheetVisible} sheetHeight={400} onCloseSheet={this.onCloseSheet}>
          {this.renderContinueView()}
        </BottomSheet>
      </>
    );
  }

  public renderTabHeader = (): ReactElement => {
    const {
      t,
      selectedAssetPlan: { selectedPlan },
    } = this.props;
    const { currentIndex, isPropertyAsUnits, isActionSheetToggled } = this.state;
    const { key, title } = this.getRoutes()[currentIndex];

    const togglePropertyUnits = (): void => this.setState({ isPropertyAsUnits: !isPropertyAsUnits });
    const toggleActionSheet = (): void => this.setState({ isActionSheetToggled: !isActionSheetToggled });

    return (
      <View style={styles.tabHeader}>
        {key === RouteKeys.Actions && selectedPlan === TypeOfPlan.RENT && (
          <View style={[styles.tabRows, styles.switchTab]}>
            <Text type="small" textType="semiBold">
              {t('shareAsUnits')}
            </Text>
            <RNSwitch selected={isPropertyAsUnits} onToggle={togglePropertyUnits} />
          </View>
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

  private renderContinueView = (): ReactElement => {
    const { t } = this.props;
    return (
      <>
        <View style={styles.sheetContent}>
          <Text type="large" style={styles.sheetTitle}>
            {t('congratulations')}
          </Text>
          <Text type="small">You are now a HomzHub Lite Member</Text>
          <Image source={images.check} style={styles.image} />
          <Label type="large" style={styles.continue}>
            {t('clickContinueToDashboard')}
          </Label>
        </View>
        <Button
          type="primary"
          title={t('continue')}
          containerStyle={styles.buttonStyle}
          onPress={this.navigateToDashboard}
        />
      </>
    );
  };

  private renderScene = ({ route }: { route: RouteKeys }): React.ReactNode => {
    const { isPropertyAsUnits } = this.state;
    const {
      selectedAssetPlan: { selectedPlan },
      assetDetails,
      assetId,
    } = this.props;

    if (!assetDetails) return null;

    switch (route) {
      case RouteKeys.Verification:
        return <PropertyVerification propertyId={assetId} typeOfPlan={selectedPlan} updateStep={this.handleNextStep} />;
      case RouteKeys.Services:
        return <ValueAddedServicesView handleNextStep={this.handleNextStep} />;
      case RouteKeys.Payment:
        return <PropertyPayment handleNextStep={this.handleNextStep} />;
      default:
        return (
          <ActionController
            typeOfPlan={selectedPlan}
            isSplitAsUnits={isPropertyAsUnits}
            country={assetDetails.country}
            propertyType={assetDetails.assetGroup.code}
            onNextStep={this.handleNextStep}
          />
        );
    }
  };

  private onCloseSheet = (): void => {
    this.setState({ isSheetVisible: false });
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

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index });
    this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  private handlePreviousStep = (index: number): void => {
    const { currentIndex } = this.state;
    const value = index - currentIndex;
    if (value < 0) {
      this.setState({ currentIndex: currentIndex + value });
      this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  private navigateToDashboard = (): void => {
    const { navigation, resetState } = this.props;
    this.setState({ isSheetVisible: false });
    resetState();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreensKeys.BottomTabs }],
      })
    );
  };

  private handleNextStep = (): void => {
    const { currentIndex, isStepDone } = this.state;
    const newStepDone: boolean[] = isStepDone;
    newStepDone[currentIndex] = true;
    this.setState({
      isStepDone: newStepDone,
    });
    if (currentIndex < this.getRoutes().length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
      this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    } else {
      this.setState({ isSheetVisible: true });
    }
  };

  private navigateToVerificationHelper = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.MarkdownScreen, { title: 'Property Verification', isFrom: 'verification' });
  };

  public handleSkip = (): void => {
    const { navigation, resetState } = this.props;
    const { currentIndex } = this.state;
    if (currentIndex < this.getRoutes().length - 2) {
      this.setState({ currentIndex: currentIndex + 1 });
      this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    } else {
      resetState();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreensKeys.BottomTabs }],
        })
      );
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getSelectedAssetPlan, getCurrentAssetId, getAssetDetails } = RecordAssetSelectors;
  return {
    selectedAssetPlan: getSelectedAssetPlan(state),
    assetId: getCurrentAssetId(state),
    assetDetails: getAssetDetails(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { resetState, getAssetById } = RecordAssetActions;
  return bindActionCreators(
    {
      resetState,
      getAssetById,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(AssetLeaseListing));

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.layout.screenPadding,
  },
  tabHeader: {
    paddingVertical: 16,
  },
  switchTab: {
    marginBottom: 24,
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
});
