import React, { Component, ReactElement } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TabView } from 'react-native-tab-view';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { AddressWithStepIndicator } from '@homzhub/common/src/components/molecules/AddressWithStepIndicator';
import { AddPropertyDetails } from '@homzhub/common/src/components/organisms/AddPropertyDetails';
import AssetHighlights from '@homzhub/common/src/components/organisms/AssetHighlights';
import PropertyImages from '@homzhub/common/src/components/organisms/PropertyImages';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Amenity } from '@homzhub/common/src/domain/models/Amenity';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { DetailType } from '@homzhub/common/src/domain/repositories/interfaces';
import { IEditPropertyFlow } from '@homzhub/common/src/modules/recordAsset/interface';
import { AddPropertyRoutes, AddPropertySteps, IRoutes, Tabs } from '@homzhub/common/src/constants/Tabs';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const { height } = theme.viewport;

interface IScreenState {
  currentIndex: number;
  isNextStep: boolean;
  heights: number[];
}

interface IProps {
  onUploadImage: () => void;
  onEditPress: () => void;
  scrollToTop?: () => void;
  onNavigateToDetail: () => void;
  onNavigateToPlanSelection: () => void;
  previousScreen?: string;
  renderCarousel?: (
    data: Amenity[][],
    renderItem: (item: Amenity[]) => ReactElement,
    activeSlide: number,
    onSnap: (slideNumber: number) => void
  ) => ReactElement;
}

interface IStateProps {
  assetId: number;
  spaceTypes: SpaceType[];
  assetDetail: Asset | null;
  lastVisitedStep: ILastVisitedStep | null;
  selectedImages: AssetGallery[];
  editPropertyFlowDetails: IEditPropertyFlow;
}

interface IDispatchProps {
  getAssetGroups: () => void;
  getAssetById: () => void;
  resetState: () => void;
  setEditPropertyFlow: (payload: boolean) => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
  setSelectedImages: (payload: AssetGallery[]) => void;
}

type Props = WithTranslation & IStateProps & IDispatchProps & IProps;

class AddPropertyView extends Component<Props, IScreenState> {
  constructor(props: Props) {
    super(props);
    const { getAssetById, getAssetGroups, previousScreen } = this.props;

    if (previousScreen && previousScreen === ScreensKeys.Dashboard) {
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

  public render(): React.ReactNode {
    const { heights, currentIndex } = this.state;
    const { assetDetail, onEditPress } = this.props;
    if (!assetDetail) return null;
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
      <>
        <AddressWithStepIndicator
          icon={icons.noteBook}
          steps={AddPropertySteps}
          propertyType={name}
          primaryAddress={projectName}
          subAddress={address}
          countryFlag={flag}
          currentIndex={currentIndex}
          isStepDone={stepList}
          onEditPress={onEditPress}
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
            routes: AddPropertyRoutes,
          }}
          style={PlatformUtils.isMobile() && { height: heights[currentIndex] }}
        />
      </>
    );
  }

  private renderTabHeader = (): ReactElement => {
    const { currentIndex } = this.state;
    const { t } = this.props;
    const tabTitle = AddPropertyRoutes[currentIndex].title;
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
      onUploadImage,
      selectedImages,
      setSelectedImages,
      renderCarousel,
      editPropertyFlowDetails: { isEditPropertyFlow },
    } = this.props;

    if (!lastVisitedStep) return null;

    switch (route.key) {
      case Tabs.DETAILS:
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
      case Tabs.HIGHLIGHTS:
        return (
          <View onLayout={(e): void => this.onLayout(e, 1)}>
            <AssetHighlights
              propertyId={assetId}
              propertyDetail={assetDetail}
              lastVisitedStep={lastVisitedStep}
              renderCarousel={renderCarousel}
              handleNextStep={this.handleNextStep}
            />
          </View>
        );
      case Tabs.GALLERY:
        return (
          <View onLayout={(e): void => this.onLayout(e, 2)}>
            <PropertyImages
              propertyId={assetId}
              selectedImages={selectedImages}
              onPressContinue={this.handleNextStep}
              lastVisitedStep={lastVisitedStep}
              onUploadImage={onUploadImage}
              setSelectedImages={setSelectedImages}
              containerStyle={styles.propertyImagesContainer}
            />
          </View>
        );
      default:
        return null;
    }
  };

  // region HANDLERS START

  private onLayout = (e: LayoutChangeEvent, index: number): void => {
    if (!PlatformUtils.isMobile()) return;
    const { heights } = this.state;
    const { height: newHeight } = e.nativeEvent.layout;
    const arrayToUpdate = [...heights];

    if (newHeight !== arrayToUpdate[index]) {
      arrayToUpdate[index] = newHeight;
      this.setState({ heights: arrayToUpdate });
    }
  };

  private handleIndexChange = (index: number): void => {
    const { scrollToTop } = this.props;
    this.setState({ currentIndex: index });
    if (PlatformUtils.isMobile() && scrollToTop) {
      scrollToTop();
    }
  };

  private handlePreviousStep = (index: number): void => {
    const { currentIndex } = this.state;
    const { assetDetail, scrollToTop } = this.props;
    if (!assetDetail) return;
    const {
      lastVisitedStep: { assetCreation },
    } = assetDetail;

    const value = index - currentIndex;
    const notCompletedStep = assetCreation.stepList.findIndex((item) => !item);
    if (index < currentIndex || (index > currentIndex && index !== notCompletedStep)) {
      this.setState({ currentIndex: currentIndex + value, isNextStep: true });
      if (PlatformUtils.isMobile() && scrollToTop) {
        scrollToTop();
      }
    }
  };

  private handleNextStep = (): void => {
    const { currentIndex } = this.state;
    const {
      getAssetById,
      editPropertyFlowDetails: { isEditPropertyFlow },
      setEditPropertyFlow,
      resetState,
      scrollToTop,
      onNavigateToDetail,
      onNavigateToPlanSelection,
    } = this.props;

    this.setState({ isNextStep: true });
    getAssetById();

    if (currentIndex < AddPropertyRoutes.length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
      if (PlatformUtils.isMobile() && scrollToTop) {
        scrollToTop();
      }
    } else {
      this.handleCurrentAsset();
      if (isEditPropertyFlow) {
        resetState();
        onNavigateToDetail();
        setEditPropertyFlow(false);
        return;
      }
      onNavigateToPlanSelection();
    }
  };

  private handleSkip = (): void => {
    const { currentIndex } = this.state;
    const {
      editPropertyFlowDetails: { isEditPropertyFlow },
      setEditPropertyFlow,
      resetState,
      scrollToTop,
      onNavigateToDetail,
      onNavigateToPlanSelection,
    } = this.props;
    if (currentIndex < AddPropertyRoutes.length - 1) {
      this.setState({ currentIndex: currentIndex + 1, isNextStep: true });
      if (PlatformUtils.isMobile() && scrollToTop) {
        scrollToTop();
      }
    } else {
      this.handleCurrentAsset();
      if (isEditPropertyFlow) {
        resetState();
        onNavigateToDetail();
        setEditPropertyFlow(false);
        return;
      }
      onNavigateToPlanSelection();
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

  // endregion HANDLERS END
}

const mapStateToProps = (state: IState): IStateProps => {
  const {
    getCurrentAssetId,
    getSpaceTypes,
    getAssetDetails,
    getLastVisitedStep,
    getSelectedImages,
    getEditPropertyFlowDetails,
  } = RecordAssetSelectors;

  return {
    assetId: getCurrentAssetId(state),
    spaceTypes: getSpaceTypes(state),
    assetDetail: getAssetDetails(state),
    lastVisitedStep: getLastVisitedStep(state),
    selectedImages: getSelectedImages(state),
    editPropertyFlowDetails: getEditPropertyFlowDetails(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetById, resetState, getAssetGroups, setEditPropertyFlow, setSelectedImages } = RecordAssetActions;
  const { setCurrentAsset } = PortfolioActions;
  return bindActionCreators(
    { getAssetById, resetState, getAssetGroups, setEditPropertyFlow, setCurrentAsset, setSelectedImages },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AddPropertyView));

const styles = StyleSheet.create({
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