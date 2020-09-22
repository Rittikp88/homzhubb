import React, { ReactElement } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { CommonActions } from '@react-navigation/native';
import { SceneMap, TabView } from 'react-native-tab-view';
// @ts-ignore
import Markdown from 'react-native-easy-markdown';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { Label, RNSwitch, Text } from '@homzhub/common/src/components';
import { AddressWithStepIndicator, BottomSheet, Header, PropertyPayment } from '@homzhub/mobile/src/components';
import PropertyVerification from '@homzhub/mobile/src/components/organisms/PropertyVerification';
import { DummyView } from '@homzhub/mobile/src/screens/Asset/Record/DummyView';
import { ValueAddedServicesView } from '@homzhub/mobile/src/components/organisms/ValueAddedServicesView';
import { ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { LabelColor } from '@homzhub/common/src/domain/models/LeaseTransaction';

interface IStateProps {
  selectedAssetPlan: ISelectedAssetPlan;
  assetId: number;
}

interface IDispatchProps {
  resetState: () => void;
}

type libraryProps = NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AssetServiceCheckoutScreen>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

interface IRoutes {
  key: string;
  title: string;
}

interface IAssetServiceCheckoutScreenState {
  currentIndex: number;
  isStepDone: boolean[];
  progress: number;
  isActionSheetToggled: boolean;
  isPropertyAsUnits: boolean;
}

class AssetServiceCheckoutScreen extends React.PureComponent<Props, IAssetServiceCheckoutScreenState> {
  public state = {
    currentIndex: 0,
    progress: 0,
    isStepDone: [],
    isActionSheetToggled: false,
    isPropertyAsUnits: false,
  };

  public render(): React.ReactElement {
    const { currentIndex, isStepDone, progress } = this.state;
    const {
      selectedAssetPlan: { selectedPlan },
    } = this.props;
    // TODO: Remove this once data is coming from api call
    const badge = ObjectMapper.deserialize(LabelColor, {
      label: selectedPlan,
      color: selectedPlan === TypeOfPlan.RENT ? theme.colors.rental : theme.colors.sell,
    });
    return (
      <>
        <Header icon={icons.leftArrow} title={this.getHeader()} onIconPress={this.goBack} />
        <ScrollView style={styles.screen}>
          <AddressWithStepIndicator
            steps={this.getSteps()}
            badge={badge}
            badgeStyle={styles.badgeStyle}
            progress={progress}
            propertyType="Bungalow"
            primaryAddress="Kalpataru Splendour"
            subAddress="Shankar Kalat Nagar, Maharashtra 411057"
            currentIndex={currentIndex}
            isStepDone={isStepDone}
            onPressSteps={this.handlePreviousStep}
            containerStyle={styles.screenMargin}
          />
          <View style={styles.screenMargin}>{this.renderTabHeader()}</View>
          <TabView
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
      </>
    );
  }

  public renderTabHeader = (): ReactElement => {
    const { currentIndex, isActionSheetToggled, isPropertyAsUnits } = this.state;
    const { t } = this.props;
    const tabTitle = this.getRoutes()[currentIndex].title;
    const toggleActionSheet = (): void => this.setState({ isActionSheetToggled: !isActionSheetToggled });
    const togglePropertyUnits = (): void => this.setState({ isPropertyAsUnits: !isPropertyAsUnits });
    return (
      <>
        {tabTitle === t('lease') && (
          <View style={styles.actionsContainer}>
            <Text type="small" textType="semiBold">
              {t('shareAsUnits')}
            </Text>
            <RNSwitch selected={isPropertyAsUnits} onToggle={togglePropertyUnits} />
          </View>
        )}
        <View style={styles.tabHeader}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {tabTitle}
          </Text>
          {[t('lease'), t('terms')].includes(tabTitle) && (
            <Icon name={icons.tooltip} color={theme.colors.blue} size={22} onPress={toggleActionSheet} />
          )}
          {[t('verification'), t('services')].includes(tabTitle) && (
            <Text type="small" textType="semiBold" style={styles.skip} onPress={this.handleSkip}>
              {t('common:skip')}
            </Text>
          )}
        </View>
        {tabTitle === t('verification') && (
          <View style={styles.verificationContainer}>
            <Label type="large" textType="regular">
              {t('propertyVerificationSubTitle')}
            </Label>
            <Text type="small" textType="semiBold" style={styles.link} onPress={this.navigateToVerificationHelper}>
              {t('helperNavigationText')}
            </Text>
          </View>
        )}
      </>
    );
  };

  // TODO: Replace the DummyView with your components
  private renderScene = SceneMap({
    actions: (): ReactElement => <DummyView handleNextStep={this.handleNextStep} />,
    verification: (): ReactElement => {
      const {
        selectedAssetPlan: { selectedPlan },
        assetId,
      } = this.props;
      return <PropertyVerification propertyId={assetId} typeOfPlan={selectedPlan} updateStep={this.handleNextStep} />;
    },
    services: (): ReactElement => <ValueAddedServicesView handleNextStep={this.handleNextStep} />,
    payment: (): ReactElement => <PropertyPayment handleNextStep={this.handleNextStep} />,
  });

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
    switch (selectedPlan) {
      case TypeOfPlan.MANAGE:
        return [
          { key: 'actions', title: t('actions') },
          { key: 'services', title: t('services') },
          { key: 'payment', title: t('payment') },
        ];
      default:
        return [
          { key: 'actions', title: selectedPlan === TypeOfPlan.RENT ? t('lease') : t('terms') },
          { key: 'verification', title: t('verification') },
          { key: 'services', title: t('services') },
          { key: 'payment', title: t('payment') },
        ];
    }
  };

  public getSteps = (): string[] => {
    const {
      t,
      selectedAssetPlan: { selectedPlan },
    } = this.props;
    switch (selectedPlan) {
      case TypeOfPlan.MANAGE:
        return [t('actions'), t('services'), t('payment')];
      default:
        return [
          selectedPlan === TypeOfPlan.RENT ? t('lease') : t('terms'),
          t('verification'),
          t('services'),
          t('payment'),
        ];
    }
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
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index });
  };

  private handlePreviousStep = (index: number): void => {
    const { currentIndex } = this.state;
    const value = index - currentIndex;
    if (value < 0) {
      this.setState({ currentIndex: currentIndex + value });
    }
  };

  private handleNextStep = (): void => {
    const { currentIndex, isStepDone, progress } = this.state;
    const newStepDone: boolean[] = isStepDone;
    newStepDone[currentIndex] = true;
    this.setState({
      isStepDone: newStepDone,
    });
    if (progress < 100) {
      const progressCount = Number((100 / this.getSteps().length).toFixed(0));
      let newProgress = progress + progressCount;
      if (100 - newProgress === 1) {
        newProgress += 1;
      }
      this.setState({
        progress: newProgress,
      });
    }
    if (currentIndex < this.getRoutes().length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
    }
  };

  private navigateToVerificationHelper = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.MarkdownScreen, { title: 'Property Verification', isFrom: 'verification' });
  };

  public handleSkip = (): void => {
    const { navigation, resetState } = this.props;
    const { currentIndex } = this.state;
    if (currentIndex < this.getRoutes().length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
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
  const { getSelectedAssetPlan, getCurrentAssetId } = RecordAssetSelectors;
  return {
    selectedAssetPlan: getSelectedAssetPlan(state),
    assetId: getCurrentAssetId(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { resetState } = RecordAssetActions;
  return bindActionCreators(
    {
      resetState,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(AssetServiceCheckoutScreen));

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenMargin: {
    margin: theme.layout.screenPadding,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  verificationContainer: {
    justifyContent: 'space-around',
  },
  badgeStyle: {
    paddingVertical: 3,
    paddingHorizontal: 18,
    borderRadius: 2,
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    paddingVertical: 16,
  },
  skip: {
    color: theme.colors.blue,
  },
  link: {
    marginVertical: 5,
    color: theme.colors.blue,
  },
});
