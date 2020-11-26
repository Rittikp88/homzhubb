import React, { ReactElement, PureComponent, ReactNode } from 'react';
import { View, StyleSheet, ScrollView, LayoutChangeEvent } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Header, AddressWithStepIndicator, AddPropertyDetails, Loader } from '@homzhub/mobile/src/components';
import AssetHighlights from '@homzhub/mobile/src/components/organisms/AssetHighlights';
import PropertyImages from '@homzhub/mobile/src/components/organisms/PropertyImages';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';

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
}

interface IDispatchProps {
  getAssetGroups: () => void;
  getAssetById: () => void;
  resetState: () => void;
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
      if (newStepIndex && currentIndex !== newStepIndex) {
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
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={styles.content}
          showsVerticalScrollIndicator={false}
          ref={this.scrollRef}
        >
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
    const { spaceTypes, assetDetail, assetId, lastVisitedStep } = this.props;
    if (!lastVisitedStep) return null;

    switch (route.key) {
      case 'detail':
        return (
          <View onLayout={(e): void => this.onLayout(e, 0)}>
            <AddPropertyDetails
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
    const { navigation } = this.props;
    if (currentIndex < Routes.length - 1) {
      this.setState({ currentIndex: currentIndex + 1, isNextStep: true });
      this.scrollToTop();
    } else {
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

  private handleNextStep = (): void => {
    const { currentIndex } = this.state;
    const { getAssetById, navigation } = this.props;
    this.setState({ isNextStep: true });
    getAssetById();
    if (currentIndex < Routes.length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
      this.scrollToTop();
    } else {
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
  const { getCurrentAssetId, getSpaceTypes, getAssetDetails, getLastVisitedStep } = RecordAssetSelectors;
  return {
    assetId: getCurrentAssetId(state),
    spaceTypes: getSpaceTypes(state),
    assetDetail: getAssetDetails(state),
    lastVisitedStep: getLastVisitedStep(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetById, resetState, getAssetGroups } = RecordAssetActions;
  return bindActionCreators({ getAssetById, resetState, getAssetGroups }, dispatch);
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
