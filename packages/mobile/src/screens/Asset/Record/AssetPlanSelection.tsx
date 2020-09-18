import React from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { Divider, Label, Text } from '@homzhub/common/src/components';
import { Header, PaginationComponent, SnapCarousel } from '@homzhub/mobile/src/components';
import { AssetAdvertisement, AssetAdvertisementResults } from '@homzhub/common/src/domain/models/AssetAdvertisement';
import { AssetPlan, ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';

interface IDispatchProps {
  getAssetPlanList: () => void;
  setSelectedPlan: (payload: ISelectedAssetPlan) => void;
}

interface IStateProps {
  assetPlan: AssetPlan[];
}

type OwnProps = WithTranslation & NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.AssetPlanSelection>;
type Props = OwnProps & IDispatchProps & IStateProps;

interface IAssetPlanState {
  banners: AssetAdvertisement;
  activeSlide: number;
}

class AssetPlanSelection extends React.PureComponent<Props, IAssetPlanState> {
  public state = {
    banners: {} as AssetAdvertisement,
    activeSlide: 0,
  };

  public componentDidMount = async (): Promise<void> => {
    const { getAssetPlanList } = this.props;
    getAssetPlanList();
    await this.getAssetAdvertisements();
  };

  public render(): React.ReactElement {
    const { t } = this.props;
    return (
      <>
        <Header icon={icons.leftArrow} title={t('propertyPlan')} isBottomStyleVisible onIconPress={this.goBack} />
        <ScrollView style={styles.flexOne}>
          <View style={styles.planContainer}>{this.renderPlans()}</View>
          <View style={styles.carouselContainer}>{this.renderAdvertisements()}</View>
        </ScrollView>
      </>
    );
  }

  public renderPlans = (): React.ReactElement => {
    const { assetPlan, t } = this.props;
    return (
      <>
        <View style={styles.header}>
          <Text type="regular" textType="semiBold">
            {t('propertyPlanTitle')}
          </Text>
          <Text type="small" textType="semiBold" onPress={this.onSkip} style={styles.skip}>
            {t('common:skip')}
          </Text>
        </View>
        <View>
          <FlatList data={assetPlan} renderItem={this.renderItem} keyExtractor={this.renderKeyExtractor} />
        </View>
      </>
    );
  };

  public renderItem = ({ item, index }: { item: AssetPlan; index: number }): React.ReactElement => {
    const { assetPlan, setSelectedPlan } = this.props;
    const onPress = (): void => {
      // TODO: Figure out to remove this error
      // @ts-ignore
      setSelectedPlan({ id: item.id, selectedPlan: item.name });
    };
    const isLastIndex = assetPlan.length === index + 1;
    return (
      <>
        <TouchableOpacity onPress={onPress} style={styles.assetPlanItem} key={index}>
          <View style={styles.flexRow}>
            <Icon name={item.icon} size={25} color={theme.colors.primaryColor} />
            <View style={styles.descriptionContainer}>
              <Text type="small" textType="semiBold" style={styles.planName}>
                {this.getPlanName(item.name)}
              </Text>
              <Label type="large" textType="regular" style={styles.description}>
                {item.description}
              </Label>
            </View>
          </View>
          <Icon name={icons.rightArrow} size={22} color={theme.colors.primaryColor} />
        </TouchableOpacity>
        {!isLastIndex && <Divider />}
      </>
    );
  };

  private renderKeyExtractor = (item: AssetPlan, index: number): string => {
    return `${item.id}-${index}`;
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
    return (
      <Image
        source={{
          uri: item?.attachment?.link ?? '',
        }}
        style={styles.carouselImage}
      />
    );
  };

  public onSnapToItem = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private onSkip = (): void => {
    const { navigation } = this.props;
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreensKeys.BottomTabs }],
      })
    );
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
    const response: AssetAdvertisement = await DashboardRepository.getAdvertisements(requestPayload);
    this.setState({ banners: response });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getAssetPlans } = RecordAssetSelectors;
  return {
    assetPlan: getAssetPlans(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetPlanList, setSelectedPlan } = RecordAssetActions;
  return bindActionCreators(
    {
      getAssetPlanList,
      setSelectedPlan,
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
  planContainer: {
    backgroundColor: theme.colors.white,
    padding: theme.layout.screenPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carouselContainer: {
    height: 350,
  },
  carouselImage: {
    height: '100%',
    width: '100%',
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
  skip: {
    flex: 0,
    borderWidth: 0,
    color: theme.colors.primaryColor,
  },
  assetPlanItem: {
    flexDirection: 'row',
    marginTop: 10,
    paddingVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    color: theme.colors.primaryColor,
  },
  description: {
    color: theme.colors.darkTint5,
    paddingTop: 10,
  },
  descriptionContainer: {
    marginStart: 20,
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    width: theme.viewport.width / 1.2,
  },
});
