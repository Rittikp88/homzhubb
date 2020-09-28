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
import { AddressWithStepIndicator, ActionController, BottomSheet, Header } from '@homzhub/mobile/src/components';
import PropertyVerification from '@homzhub/mobile/src/components/organisms/PropertyVerification';
import PropertyPayment from '@homzhub/mobile/src/components/organisms/PropertyPayment';
import { ValueAddedServicesView } from '@homzhub/mobile/src/components/organisms/ValueAddedServicesView';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { LabelColor } from '@homzhub/common/src/domain/models/LeaseTransaction';

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
  key: string;
  title: string;
}

interface IOwnState {
  currentIndex: number;
  isStepDone: boolean[];
  isActionSheetToggled: boolean;
  isPropertyAsUnits: boolean;
}

class AssetLeaseListing extends React.PureComponent<Props, IOwnState> {
  private scrollRef = React.createRef<ScrollView>();
  public state = {
    currentIndex: 0,
    isStepDone: [],
    isActionSheetToggled: false,
    isPropertyAsUnits: false,
  };

  public componentDidMount(): void {
    const { getAssetById } = this.props;
    getAssetById();
  }

  public render(): React.ReactNode {
    const { currentIndex, isStepDone } = this.state;
    const {
      selectedAssetPlan: { selectedPlan },
      assetDetails,
    } = this.props;
    // TODO: Remove this once data is coming from api call
    const badge = ObjectMapper.deserialize(LabelColor, {
      label: selectedPlan,
      color: selectedPlan === TypeOfPlan.RENT ? theme.colors.rental : theme.colors.sell,
    });
    if (!assetDetails) return null;

    const {
      projectName,
      assetType: { name },
      address,
    } = assetDetails;

    return (
      <>
        <Header icon={icons.leftArrow} title={this.getHeader()} onIconPress={this.goBack} />
        <ScrollView style={styles.screen} showsVerticalScrollIndicator={false} ref={this.scrollRef}>
          <AddressWithStepIndicator
            steps={this.getSteps()}
            badge={badge}
            badgeStyle={styles.badgeStyle}
            isProgress={false}
            propertyType={name}
            primaryAddress={projectName}
            subAddress={address}
            currentIndex={currentIndex}
            isStepDone={isStepDone}
            onPressSteps={this.handlePreviousStep}
          />
          {this.renderTabHeader()}
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

  private renderScene = SceneMap({
    actions: (): ReactElement => {
      const { isPropertyAsUnits } = this.state;
      const {
        selectedAssetPlan: { selectedPlan },
        assetDetails,
      } = this.props;
      return (
        <>
          {assetDetails && (
            <ActionController
              typeOfPlan={selectedPlan}
              isSplitAsUnits={isPropertyAsUnits}
              country={assetDetails.country}
              propertyType={assetDetails.assetGroup.code}
              onNextStep={this.handleNextStep}
            />
          )}
        </>
      );
    },
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
          { key: 'actions', title: t('actions') },
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
    const { currentIndex, isStepDone } = this.state;
    const newStepDone: boolean[] = isStepDone;
    newStepDone[currentIndex] = true;
    this.setState({
      isStepDone: newStepDone,
    });
    if (currentIndex < this.getRoutes().length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
      this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
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
