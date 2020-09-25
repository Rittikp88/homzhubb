import React, { ReactElement, PureComponent, ReactNode } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
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
import { Header, AddressWithStepIndicator, AddPropertyDetails, BottomSheet } from '@homzhub/mobile/src/components';
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
  isStepDone: boolean[];
  isSheetVisible: boolean;
}

interface IStateProps {
  assetId: number;
  spaceTypes: SpaceType[];
  assetDetail: Asset | null;
}

interface IDispatchProps {
  getAssetById: () => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AddProperty>;
type Props = libraryProps & IStateProps & IDispatchProps;

export class AddProperty extends PureComponent<Props, IScreenState> {
  constructor(props: Props) {
    super(props);
    const { getAssetById } = this.props;
    getAssetById();
    this.state = {
      currentIndex: 0,
      isStepDone: [],
      isSheetVisible: false,
    };
  }

  public componentDidMount(): void {
    const { assetDetail } = this.props;
    if (assetDetail && assetDetail.lastVisitedStep) {
      const { currentStep } = assetDetail.lastVisitedStep;
      if (currentStep > 1) {
        this.setState({
          currentIndex: currentStep - 1,
        });
      }
    }
  }

  public render = (): ReactNode => {
    const { currentIndex, isStepDone, isSheetVisible } = this.state;
    const { t, assetDetail } = this.props;

    if (!assetDetail) return null;
    const {
      projectName,
      address,
      lastVisitedStep,
      assetType: { name },
    } = assetDetail;

    return (
      <View style={styles.screen}>
        <Header icon={icons.leftArrow} title={t('property:addProperty')} onIconPress={this.goBack} />
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <AddressWithStepIndicator
            icon={icons.noteBook}
            steps={Steps}
            progress={lastVisitedStep?.percentage}
            propertyType={name}
            primaryAddress={projectName}
            subAddress={address}
            currentIndex={currentIndex}
            isStepDone={isStepDone}
            onEditPress={this.onEditPress}
            stepContainerStyle={styles.stepContainer}
            containerStyle={styles.addressCard}
            onPressSteps={this.handlePreviousStep}
          />
          {this.renderTabHeader()}
          <TabView
            renderScene={this.renderScene}
            onIndexChange={this.handleIndexChange}
            removeClippedSubviews
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

  private renderScene = SceneMap({
    detail: (): ReactElement => {
      const { spaceTypes } = this.props;
      return <AddPropertyDetails spaceTypes={spaceTypes} handleNextStep={this.handleNextStep} />;
    },

    highlights: (): ReactElement => {
      const { assetId, assetDetail } = this.props;
      return <AssetHighlights propertyId={assetId} propertyDetail={assetDetail} handleNextStep={this.handleNextStep} />;
    },

    gallery: (): ReactElement => {
      const { assetId } = this.props;
      return (
        <PropertyImages
          propertyId={assetId}
          onPressContinue={this.handleNextStep}
          containerStyle={styles.propertyImagesContainer}
        />
      );
    },
  });

  private onCloseSheet = (): void => {
    this.setState({ isSheetVisible: false });
  };

  private onEditPress = (): void => {
    // TODO: Add logic to go back Property detail form
    this.goBack();
  };

  private goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index });
  };

  private handleSkip = (): void => {
    const { currentIndex } = this.state;
    if (currentIndex < Routes.length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
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
    if (currentIndex < Routes.length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
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
  const { getAssetById } = RecordAssetActions;
  return bindActionCreators({ getAssetById }, dispatch);
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
