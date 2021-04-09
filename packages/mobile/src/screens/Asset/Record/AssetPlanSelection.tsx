import React, { ReactElement } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import Check from '@homzhub/common/src/assets/images/check.svg';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Header, PaginationComponent, SnapCarousel } from '@homzhub/mobile/src/components';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import PlanSelection from '@homzhub/common/src/components/organisms/PlanSelection';
import { AssetAdvertisement, AssetAdvertisementResults } from '@homzhub/common/src/domain/models/AssetAdvertisement';
import { AssetPlan, ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';

interface IDispatchProps {
  getAssetPlanList: () => void;
  setSelectedPlan: (payload: ISelectedAssetPlan) => void;
  resetState: () => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
}

interface IStateProps {
  assetPlan: AssetPlan[];
  assetId: number;
}

type OwnProps = WithTranslation & NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AssetPlanSelection>;
type Props = OwnProps & IDispatchProps & IStateProps;

interface IAssetPlanState {
  banners: AssetAdvertisement;
  activeSlide: number;
  isSheetVisible: boolean;
  loading: boolean;
}

class AssetPlanSelection extends React.PureComponent<Props, IAssetPlanState> {
  public state = {
    banners: {} as AssetAdvertisement,
    activeSlide: 0,
    isSheetVisible: false,
    loading: false,
  };

  public componentDidMount = async (): Promise<void> => {
    const {
      route: { params },
    } = this.props;
    await this.getAssetAdvertisements();
    if (!params) {
      this.setState({ isSheetVisible: true });
    }
  };

  public render(): React.ReactElement {
    const { t } = this.props;
    const { isSheetVisible, loading } = this.state;
    return (
      <>
        <Loader visible={loading} />
        <Header icon={icons.leftArrow} title={t('propertyPlan')} onIconPress={this.goBack} />
        <ScrollView style={styles.flexOne}>
          <PlanSelection carouselView={this.renderCarousel()} onSkip={this.onSkip} onSelectPlan={this.onSelectPlan} />
        </ScrollView>
        <BottomSheet visible={isSheetVisible} sheetHeight={400} onCloseSheet={this.onCloseSheet}>
          {this.renderContinueView()}
        </BottomSheet>
      </>
    );
  }

  private renderCarousel = (): React.ReactElement => {
    return <View style={styles.carouselContainer}>{this.renderAdvertisements()}</View>;
  };

  private renderContinueView = (): ReactElement => {
    const { t } = this.props;
    return (
      <>
        <View style={styles.sheetContent}>
          <Text type="large" style={styles.sheetTitle}>
            {t('common:congratulations')}
          </Text>
          <Text type="small">{t('property:yourDetailsAdded')}</Text>
          <View style={styles.image}>
            <Check />
          </View>
          <Label type="large" style={styles.continue}>
            {t('property:clickContinue')}
          </Label>
        </View>
        <Button
          type="primary"
          title={t('common:continue')}
          containerStyle={styles.buttonStyle}
          onPress={this.onCloseSheet}
        />
      </>
    );
  };

  public renderAdvertisements = (): React.ReactNode => {
    const { banners, activeSlide } = this.state;
    if (!banners) {
      return null;
    }
    return (
      <>
        <SnapCarousel
          carouselData={banners?.results ?? []}
          carouselItem={this.renderCarouselItem}
          itemWidth={theme.viewport.width}
          activeIndex={activeSlide}
          onSnapToItem={this.onSnapToItem}
        />
        <PaginationComponent
          dotsLength={banners?.results?.length ?? 0}
          activeSlide={activeSlide}
          activeDotStyle={styles.activeDotStyle}
          inactiveDotStyle={styles.inactiveDotStyle}
        />
      </>
    );
  };

  private renderCarouselItem = (item: AssetAdvertisementResults): React.ReactElement => {
    return <SVGUri uri={item.attachment.link} />;
  };

  public onSnapToItem = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private onSkip = (): void => {
    const { navigation, resetState } = this.props;
    resetState();
    // @ts-ignore
    navigation.navigate(ScreensKeys.BottomTabs, {
      screen: ScreensKeys.Portfolio,
      params: { screen: ScreensKeys.PropertyDetailScreen, initial: false },
    });
  };

  private onSelectPlan = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.AssetListing);
  };

  private onCloseSheet = (): void => {
    this.setState({ isSheetVisible: false });
  };

  public getPlanName = (name: string): string => {
    const { t } = this.props;
    switch (name) {
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

  public getAssetAdvertisements = async (): Promise<void> => {
    const requestPayload = {
      category: 'service',
    };
    try {
      this.toggleLoader();
      const response: AssetAdvertisement = await DashboardRepository.getAdvertisements(requestPayload);
      this.setState({ banners: response });
      this.toggleLoader();
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.message) });
      this.toggleLoader();
    }
  };

  private toggleLoader = (): void => this.setState((prevState) => ({ loading: !prevState.loading }));
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getAssetPlans, getCurrentAssetId } = RecordAssetSelectors;
  return {
    assetPlan: getAssetPlans(state),
    assetId: getCurrentAssetId(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetPlanList, setSelectedPlan, resetState } = RecordAssetActions;
  const { setCurrentAsset } = PortfolioActions;
  return bindActionCreators(
    {
      getAssetPlanList,
      setSelectedPlan,
      resetState,
      setCurrentAsset,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.property)(AssetPlanSelection));

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  carouselContainer: {
    height: 350,
    backgroundColor: theme.colors.white,
  },
  activeDotStyle: {
    width: 18,
    height: 10,
    borderRadius: 7,
    backgroundColor: theme.colors.primaryColor,
  },
  inactiveDotStyle: {
    ...(theme.circleCSS(16) as object),
    backgroundColor: theme.colors.darkTint9,
    borderColor: theme.colors.transparent,
  },
  sheetContent: {
    alignItems: 'center',
  },
  sheetTitle: {
    marginBottom: 8,
  },
  image: {
    height: 100,
    marginVertical: 24,
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
});
