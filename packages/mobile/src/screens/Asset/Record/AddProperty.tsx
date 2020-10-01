import React, { ReactElement, PureComponent, ReactNode } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
import { images } from '@homzhub/common/src/assets/images';
import { Button, Image, Label, Text } from '@homzhub/common/src/components';
import {
  Header,
  AddressWithStepIndicator,
  AddPropertyDetails,
  BottomSheet,
  Loader,
} from '@homzhub/mobile/src/components';
import AssetHighlights from '@homzhub/mobile/src/components/organisms/AssetHighlights';
import PropertyImages from '@homzhub/mobile/src/components/organisms/PropertyImages';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';

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

interface IScreenState {
  currentIndex: number;
  isNextStep: boolean;
  isSheetVisible: boolean;
}

interface IStateProps {
  assetId: number;
  spaceTypes: SpaceType[];
  assetDetail: Asset | null;
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
      isSheetVisible: false,
    };
  }

  public static getDerivedStateFromProps(props: Props, state: IScreenState): IScreenState | null {
    const { assetDetail: newPropValue } = props;
    const { currentIndex, isNextStep } = state;
    const newStepIndex = newPropValue?.lastVisitedStep.stepList.findIndex((item) => !item);
    if (!isNextStep && newStepIndex && currentIndex !== newStepIndex) {
      return {
        ...state,
        currentIndex: newStepIndex,
      };
    }

    return null;
  }

  public componentWillUnmount = (): void => {
    const { navigation, getAssetById } = this.props;
    navigation.removeListener('focus', getAssetById);
  };

  public render = (): ReactNode => {
    const { isSheetVisible, currentIndex } = this.state;
    const { t, assetDetail } = this.props;

    if (!assetDetail) return <Loader visible />;
    const {
      projectName,
      address,
      assetType: { name },
      lastVisitedStep: { stepList },
    } = assetDetail;

    return (
      <View style={styles.screen}>
        <Header icon={icons.leftArrow} title={t('property:addProperty')} onIconPress={this.goBack} />
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} ref={this.scrollRef}>
          <AddressWithStepIndicator
            icon={icons.noteBook}
            steps={Steps}
            propertyType={name}
            primaryAddress={projectName}
            subAddress={address}
            currentIndex={currentIndex}
            isStepDone={stepList}
            onEditPress={this.onEditPress}
            stepContainerStyle={styles.stepContainer}
            containerStyle={styles.addressCard}
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
              routes: Routes,
            }}
          />
        </ScrollView>
        <BottomSheet visible={isSheetVisible} sheetHeight={400} onCloseSheet={this.onCloseSheet}>
          {this.renderContinueView()}
        </BottomSheet>
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
          <Text type="small">{t('property:yourDetailsAdded')}</Text>
          <Image source={images.check} style={styles.image} />
          <Label type="large" style={styles.continue}>
            {t('property:clickContinue')}
          </Label>
        </View>
        <Button
          type="primary"
          title={t('continue')}
          containerStyle={styles.buttonStyle}
          onPress={this.navigateToPlans}
        />
      </>
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
    const { spaceTypes, assetDetail, assetId } = this.props;
    switch (route.key) {
      case 'detail':
        return (
          <AddPropertyDetails
            assetId={assetId}
            assetDetails={assetDetail}
            spaceTypes={spaceTypes}
            handleNextStep={this.handleNextStep}
          />
        );
      case 'highlights':
        return (
          <AssetHighlights propertyId={assetId} propertyDetail={assetDetail} handleNextStep={this.handleNextStep} />
        );
      case 'gallery':
        return (
          <PropertyImages
            propertyId={assetId}
            onPressContinue={this.handleNextStep}
            lastVisitedStep={assetDetail?.lastVisitedStep}
            containerStyle={styles.propertyImagesContainer}
          />
        );
      default:
        return null;
    }
  };

  private onCloseSheet = (): void => {
    this.setState({ isSheetVisible: false });
  };

  private onEditPress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PostAssetDetails);
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
  };

  private handleSkip = (): void => {
    const { currentIndex } = this.state;
    if (currentIndex < Routes.length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
      this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    } else {
      this.setState({ isSheetVisible: true });
    }
  };

  private navigateToPlans = (): void => {
    const { navigation } = this.props;
    this.setState({ isSheetVisible: false });
    navigation.navigate(ScreensKeys.AssetPlanSelection);
  };

  private handlePreviousStep = (index: number): void => {
    const { currentIndex } = this.state;
    const { assetDetail } = this.props;
    const value = index - currentIndex;
    const notCompletedStep = assetDetail?.lastVisitedStep.stepList.findIndex((item) => !item);
    if (index < currentIndex && index !== notCompletedStep) {
      this.setState({ currentIndex: currentIndex + value, isNextStep: true });
      this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  private handleNextStep = (): void => {
    const { currentIndex } = this.state;
    const { getAssetById } = this.props;
    this.setState({ isNextStep: true });
    getAssetById();
    if (currentIndex < Routes.length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
      this.scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    } else {
      this.setState({ isSheetVisible: true });
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getCurrentAssetId, getSpaceTypes, getAssetDetails } = RecordAssetSelectors;
  return {
    assetId: getCurrentAssetId(state),
    spaceTypes: getSpaceTypes(state),
    assetDetail: getAssetDetails(state),
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
  stepContainer: {
    paddingHorizontal: 50,
  },
  addressCard: {
    marginHorizontal: 16,
  },
  propertyImagesContainer: {
    margin: theme.layout.screenPadding,
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
