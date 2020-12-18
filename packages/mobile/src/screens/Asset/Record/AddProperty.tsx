import React, { PureComponent, ReactElement, ReactNode } from 'react';
import { KeyboardAvoidingView, LayoutChangeEvent, ScrollView, StyleSheet, View } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { AddPropertyDetails, AddressWithStepIndicator, Header, Loader } from '@homzhub/mobile/src/components';
import AssetHighlights from '@homzhub/mobile/src/components/organisms/AssetHighlights';
import PropertyImages from '@homzhub/mobile/src/components/organisms/PropertyImages';
import { IEditPropertyFlow } from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/PropertyDetailScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { DetailType } from '@homzhub/common/src/domain/repositories/interfaces';

interface IRoutes {
  key: string;
  title: string;
}

const Routes: IRoutes[] = [
  { key: 'detail', title: 'Details' },
  { key: 'highlights', title: 'Highlights' },
  { key: 'gallery', title: 'Gallery' },
];
const Steps = ['Details', 'Highlights', 'Gallery'];
const { height } = theme.viewport;

interface IScreenState {
  currentIndex: number;
  isNextStep: boolean;
  heights: number[];
}

interface IStateProps {
  assetId: number;
  spaceTypes: SpaceType[];
  assetDetail: Asset | null;
  lastVisitedStep: ILastVisitedStep | null;
  editPropertyFlowDetails: IEditPropertyFlow;
}

interface IDispatchProps {
  getAssetGroups: () => void;
  getAssetById: () => void;
  resetState: () => void;
  setEditPropertyFlow: (payload: boolean) => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AddProperty>;
type Props = libraryProps & IStateProps & IDispatchProps;

export class AddProperty extends PureComponent<Props, IScreenState> {
  private scrollRef = React.createRef<ScrollView>();

  constructor(props: Props) {
    super(props);
    const {
      getAssetById,
      getAssetGroups,
      route: { params },
    } = this.props;

    if (params && params.previousScreen === ScreensKeys.Dashboard) {
      getAssetGroups();
    }

    getAssetById();
    this.state = {
      currentIndex: 0,
      isNextStep: false,
      heights: [height, height, height * 0.5],
    };
  }

  public static getDerivedStateFromProps(props: Props, state: IScreenState): IScreenState | null {
    const { assetDetail } = props;
    const { currentIndex, isNextStep } = state;
    if (!isNextStep && assetDetail) {
      const { assetCreation } = assetDetail.lastVisitedStep;
      const newStepIndex = assetCreation.stepList.findIndex((item) => !item);
      if (newStepIndex >= 0 && currentIndex !== newStepIndex) {
        return {
          ...state,
          currentIndex: newStepIndex,
        };
      }
    }

    return null;
  }

  public componentWillUnmount = (): void => {
    const { navigation, getAssetById } = this.props;
    navigation.removeListener('focus', getAssetById);
  };

  public render = (): ReactNode => {
    const { currentIndex, heights } = this.state;
    const { t, assetDetail } = this.props;

    if (!assetDetail) return <Loader visible />;
    const {
      projectName,
      address,
      country: { flag },
      assetType: { name },
      lastVisitedStep: {
        assetCreation: { stepList },
      },
    } = assetDetail;

    return (
      <View style={styles.screen}>
        <Header icon={icons.leftArrow} title={t('property:addProperty')} onIconPress={this.goBack} />
        <KeyboardAvoidingView style={styles.screen} behavior={PlatformUtils.isIOS() ? 'padding' : undefined}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false} ref={this.scrollRef}>
            <AddressWithStepIndicator
              icon={icons.noteBook}
              steps={Steps}
              propertyType={name}
              primaryAddress={projectName}
              subAddress={address}
              countryFlag={flag}
              currentIndex={currentIndex}
              isStepDone={stepList}
              onEditPress={this.onEditPress}
              containerStyle={styles.addressCard}
              onPressSteps={this.handlePreviousStep}
            />
            {this.renderTabHeader()}
            <TabView
              initialLayout={theme.viewport}
              renderScene={this.renderScene}
              onIndexChange={this.handleIndexChange}
              renderTabBar={(): null => null}
              swipeEnabled={false}
              navigationState={{
                index: currentIndex,
                routes: Routes,
              }}
              style={{ height: heights[currentIndex] }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  };

  private renderTabHeader = (): ReactElement => {
    const { currentIndex } = this.state;
    const { t } = this.props;
    const tabTitle = Routes[currentIndex].title;
    return (
      <View style={styles.tabHeader}>
        <Text type="small" textType="semiBold" style={styles.title}>
          {tabTitle}
        </Text>
        {currentIndex > 0 && (
          <Text type="small" textType="semiBold" style={styles.skip} onPress={this.handleSkip}>
            {t('skip')}
          </Text>
        )}
      </View>
    );
  };

  private renderScene = ({ route }: { route: IRoutes }): ReactElement | null => {
    const {
      spaceTypes,
      assetDetail,
      assetId,
      lastVisitedStep,
      editPropertyFlowDetails: { isEditPropertyFlow },
    } = this.props;
    if (!lastVisitedStep) return null;

    switch (route.key) {
      case 'detail':
        return (
          <View onLayout={(e): void => this.onLayout(e, 0)}>
            <AddPropertyDetails
              isEditPropertyFlow={isEditPropertyFlow}
              assetId={assetId}
              assetDetails={assetDetail}
              spaceTypes={spaceTypes}
              lastVisitedStep={lastVisitedStep}
              handleNextStep={this.handleNextStep}
            />
          </View>
        );
      case 'highlights':
        return (
          <View onLayout={(e): void => this.onLayout(e, 1)}>
            <AssetHighlights
              propertyId={assetId}
              propertyDetail={assetDetail}
              lastVisitedStep={lastVisitedStep}
              handleNextStep={this.handleNextStep}
            />
          </View>
        );
      case 'gallery':
        return (
          <View onLayout={(e): void => this.onLayout(e, 2)}>
            <PropertyImages
              propertyId={assetId}
              onPressContinue={this.handleNextStep}
              lastVisitedStep={lastVisitedStep}
              containerStyle={styles.propertyImagesContainer}
            />
          </View>
        );
      default:
        return null;
    }
  };

  private onEditPress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PostAssetDetails);
  };

  private onLayout = (e: LayoutChangeEvent, index: number): void => {
    const { heights } = this.state;
    const { height: newHeight } = e.nativeEvent.layout;
    const arrayToUpdate = [...heights];

    if (newHeight !== arrayToUpdate[index]) {
      arrayToUpdate[index] = newHeight;
      this.setState({ heights: arrayToUpdate });
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
    this.scrollToTop();
  };

  private handleSkip = (): void => {
    const { currentIndex } = this.state;
    const {
      navigation,
      editPropertyFlowDetails: { isEditPropertyFlow },
      setEditPropertyFlow,
      resetState,
    } = this.props;
    if (currentIndex < Routes.length - 1) {
      this.setState({ currentIndex: currentIndex + 1, isNextStep: true });
      this.scrollToTop();
    } else {
      this.handleCurrentAsset();
      if (isEditPropertyFlow) {
        resetState();
        // @ts-ignore
        navigation.navigate(ScreensKeys.PropertyDetailScreen);
        setEditPropertyFlow(false);
        return;
      }
      navigation.navigate(ScreensKeys.AssetPlanSelection);
    }
  };

  private handlePreviousStep = (index: number): void => {
    const { currentIndex } = this.state;
    const { assetDetail } = this.props;
    if (!assetDetail) return;
    const {
      lastVisitedStep: { assetCreation },
    } = assetDetail;

    const value = index - currentIndex;
    const notCompletedStep = assetCreation.stepList.findIndex((item) => !item);
    if (index < currentIndex || (index > currentIndex && index !== notCompletedStep)) {
      this.setState({ currentIndex: currentIndex + value, isNextStep: true });
      this.scrollToTop();
    }
  };

  private handleCurrentAsset = (): void => {
    const { assetDetail, setCurrentAsset } = this.props;
    if (assetDetail) {
      const { id, leaseTerm, saleTerm } = assetDetail;
      setCurrentAsset({
        asset_id: id,
        listing_id: leaseTerm?.id ?? saleTerm?.id ?? 0,
        assetType: leaseTerm ? DetailType.LEASE_LISTING : saleTerm ? DetailType.SALE_LISTING : DetailType.ASSET,
      });
    }
  };

  private handleNextStep = (): void => {
    const { currentIndex } = this.state;
    const {
      getAssetById,
      navigation,
      editPropertyFlowDetails: { isEditPropertyFlow },
      setEditPropertyFlow,
      resetState,
    } = this.props;

    this.setState({ isNextStep: true });
    getAssetById();

    if (currentIndex < Routes.length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
      this.scrollToTop();
    } else {
      this.handleCurrentAsset();
      if (isEditPropertyFlow) {
        resetState();
        // @ts-ignore
        navigation.navigate(ScreensKeys.PropertyDetailScreen);
        setEditPropertyFlow(false);
        return;
      }
      navigation.navigate(ScreensKeys.AssetPlanSelection);
    }
  };

  private scrollToTop = (): void => {
    setTimeout(() => {
      this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }, 100);
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const {
    getCurrentAssetId,
    getSpaceTypes,
    getAssetDetails,
    getLastVisitedStep,
    getEditPropertyFlowDetails,
  } = RecordAssetSelectors;

  return {
    assetId: getCurrentAssetId(state),
    spaceTypes: getSpaceTypes(state),
    assetDetail: getAssetDetails(state),
    lastVisitedStep: getLastVisitedStep(state),
    editPropertyFlowDetails: getEditPropertyFlowDetails(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetById, resetState, getAssetGroups, setEditPropertyFlow } = RecordAssetActions;
  const { setCurrentAsset } = PortfolioActions;
  return bindActionCreators(
    { getAssetById, resetState, getAssetGroups, setEditPropertyFlow, setCurrentAsset },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AddProperty));

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  title: {
    paddingVertical: 16,
  },
  skip: {
    color: theme.colors.blue,
  },
  addressCard: {
    marginHorizontal: 16,
  },
  propertyImagesContainer: {
    margin: theme.layout.screenPadding,
  },
});
