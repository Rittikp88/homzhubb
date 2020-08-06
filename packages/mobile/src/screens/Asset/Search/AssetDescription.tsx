import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import {
  CustomMarker,
  Divider,
  Label,
  PricePerUnit,
  PropertyAddress,
  Text,
  WithShadowView,
  SVGUri,
  ContactPerson,
} from '@homzhub/common/src/components';
import {
  AssetRatings,
  AssetDetailsImageCarousel,
  CollapsibleSection,
  FullScreenAssetDetailsCarousel,
  PropertyAmenities,
  StatusBarComponent,
  ShieldGroup,
  Loader,
} from '@homzhub/mobile/src/components';
import SimilarProperties from '@homzhub/mobile/src/components/organisms/SimilarProperties';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { RootStackParamList } from '@homzhub/mobile/src/navigation/SearchStackNavigator';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetHighlight } from '@homzhub/common/src/domain/models/AssetHighlight';
import { AssetFeature } from '@homzhub/common/src/domain/models/AssetFeature';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Amenity } from '@homzhub/common/src/domain/models/Amenity';
import { IAmenitiesIcons, IFilter } from '@homzhub/common/src/domain/models/Search';

interface IStateProps {
  reviews: AssetReview[];
  assetDetails: Asset | null;
  isLoading: boolean;
  filters: IFilter;
}

interface IDispatchProps {
  getAssetReviews: (id: number) => void;
  getAsset: (id: number) => void;
}

interface IOwnState {
  isFullScreen: boolean;
  activeSlide: number;
  descriptionShowMore: boolean;
  descriptionHide: boolean;
  amenitiesShowAll: boolean;
  isScroll: boolean;
}

const { width, height } = theme.viewport;
const realWidth = height > width ? width : height;
const relativeWidth = (num: number): number => (realWidth * num) / 100;

const PARALLAX_HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = 100;

type libraryProps = WithTranslation & NavigationScreenProps<RootStackParamList, ScreensKeys.PropertyAssetDescription>;
type Props = IStateProps & IDispatchProps & libraryProps;

class AssetDescription extends React.PureComponent<Props, IOwnState> {
  public state = {
    isFullScreen: false,
    descriptionShowMore: false,
    descriptionHide: true,
    amenitiesShowAll: false,
    activeSlide: 0,
    isScroll: true,
  };

  public componentDidMount = (): void => {
    const {
      getAsset,
      route: {
        params: { propertyTermId },
      },
    } = this.props;
    getAsset(propertyTermId);
  };

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<IOwnState>, snapshot?: any): void {
    const { getAsset } = this.props;
    const {
      route: {
        params: { propertyTermId: oldPropertyTermId },
      },
    } = prevProps;
    const {
      route: {
        params: { propertyTermId: newPropertyTermId },
      },
    } = this.props;
    if (oldPropertyTermId !== newPropertyTermId) {
      getAsset(newPropertyTermId);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isScroll: true });
    }
  }

  public render = (): React.ReactNode => {
    const { t, reviews, assetDetails, isLoading } = this.props;
    const { isFullScreen, isScroll } = this.state;
    if (!assetDetails) return null;
    const {
      contacts: { fullName, phoneNumber, countryCode },
    } = assetDetails;

    const statusBarHeight = isScroll ? 0 : PlatformUtils.isIOS() ? 55 : 40;

    return (
      <>
        <StatusBarComponent
          backgroundColor={!isScroll ? theme.colors.white : 'transparent'}
          isTranslucent
          statusBarStyle={{ height: statusBarHeight }}
          barStyle={isScroll ? 'light-content' : 'dark-content'}
        />
        <ParallaxScrollView
          backgroundColor={theme.colors.transparent}
          stickyHeaderHeight={STICKY_HEADER_HEIGHT}
          parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
          backgroundSpeed={10}
          onChangeHeaderVisibility={(isChanged: boolean): void => this.setState({ isScroll: isChanged })}
          renderForeground={(): React.ReactElement => this.renderCarousel()}
          renderStickyHeader={(): React.ReactElement => this.stickyHeader()}
          renderFixedHeader={(): React.ReactElement => this.fixedHeader()}
        >
          <View style={styles.screen}>
            {this.renderHeaderSection()}
            <CollapsibleSection title={t('description')}>{this.renderAssetDescription()}</CollapsibleSection>
            <CollapsibleSection title={t('factsFeatures')}>{this.renderFactsAndFeatures()}</CollapsibleSection>
            {this.renderAmenities()}
            <CollapsibleSection title={t('highlights')}>{this.renderAssetHighlights()}</CollapsibleSection>
            {this.renderMapSection()}
            <CollapsibleSection title={t('reviewsRatings')}>
              <AssetRatings reviews={reviews} />
            </CollapsibleSection>
            {this.renderSimilarProperties()}
          </View>
        </ParallaxScrollView>
        {this.renderFullscreenCarousel()}
        {!isFullScreen && (
          <ContactPerson
            fullName={fullName}
            phoneNumber={`${countryCode}${phoneNumber}`}
            designation="Owner"
            onMailClicked={this.onContactMailClicked}
          />
        )}
        {isLoading && <Loader />}
      </>
    );
  };

  private renderHeaderSection = (): React.ReactElement | null => {
    const {
      assetDetails,
      t,
      filters: { asset_transaction_type },
    } = this.props;
    if (!assetDetails) {
      return null;
    }
    const {
      spaces,
      carpetArea,
      carpetAreaUnit,
      floorNumber,
      assetType,
      leaseTerm,
      saleTerm,
      postedOn,
      projectName,
      unitNumber,
      blockNumber,
      verifications: { description },
      assetGroup: { name },
    } = assetDetails;
    const propertyType = assetType ? assetDetails.assetType.name : '';

    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces,
      floorNumber,
      name,
      carpetArea,
      carpetAreaUnit,
      true
    );

    const propertyTimelineData = PropertyUtils.getPropertyTimelineData(
      name,
      postedOn,
      (leaseTerm?.availableFromDate || saleTerm?.availableFromDate) ?? '',
      asset_transaction_type
    );

    return (
      <View style={styles.headerContainer}>
        <ShieldGroup propertyType={propertyType} text={description} isInfoRequired />
        <View style={styles.apartmentContainer}>
          <PricePerUnit
            price={(Number(leaseTerm?.expectedPrice) || saleTerm?.expectedPrice) ?? 0}
            currency={(leaseTerm?.currencyCode || saleTerm?.currencyCode) ?? 'INR'}
            unit={asset_transaction_type === 0 ? 'mo' : ''}
          />
          <View style={styles.textIcon}>
            <Icon name={icons.timer} size={22} color={theme.colors.blue} style={styles.iconStyle} />
            <Text type="small" textType="regular" style={styles.primaryText}>
              {t('bookTour')}
            </Text>
          </View>
        </View>
        <View style={styles.apartmentContainer}>
          <PropertyAddress
            isIcon={false}
            primaryAddress={projectName}
            subAddress={`${unitNumber ?? ''} ${blockNumber ?? ''}`}
            subAddressStyle={styles.subAddress}
          />
          <View style={styles.textIcon}>
            <View style={styles.verticalDivider} />
            <Icon name={icons.houseMarker} size={30} color={theme.colors.blue} style={styles.iconStyle} />
          </View>
        </View>
        <PropertyAmenities data={amenitiesData} direction="row" containerStyle={styles.amenitiesContainer} />
        <Divider />
        <View style={styles.timelineContainer}>{this.renderPropertyTimelines(propertyTimelineData)}</View>
      </View>
    );
  };

  // TODO: (Shikha) - Add type once api integrate
  private renderPropertyTimelines = (data: any): React.ReactElement => {
    return (
      <>
        {data.map((item: any, index: number) => {
          return (
            <View key={index} style={styles.utilityItem}>
              <Label type="large" textType="regular" style={{ color: theme.colors.darkTint4 }}>
                {item.label}
              </Label>
              <Label type="large" textType="semiBold" style={{ color: theme.colors.darkTint2 }}>
                {item.value}
              </Label>
            </View>
          );
        })}
      </>
    );
  };

  private renderAssetDescription = (): React.ReactNode => {
    const { t, assetDetails } = this.props;
    const { descriptionShowMore, descriptionHide } = this.state;

    const onLayout = (event: any): void => {
      const { lines } = event.nativeEvent;
      if (lines.length > 3 || (lines.length === 3 && lines[2].text.includes('\n'))) {
        this.setState({ descriptionHide: false });
      }
    };

    const onPress = (): void => {
      this.setState({ descriptionShowMore: !descriptionShowMore });
    };

    return (
      <>
        <Label
          type="large"
          textType="regular"
          style={styles.description}
          // @ts-ignore
          onTextLayout={onLayout}
          numberOfLines={descriptionShowMore ? undefined : 3}
        >
          {assetDetails?.description}
        </Label>
        {!descriptionHide && (
          <Label type="large" textType="semiBold" style={styles.helperText} onPress={onPress}>
            {descriptionShowMore ? t('property:showLess') : t('property:showMore')}
          </Label>
        )}
      </>
    );
  };

  private renderFactsAndFeatures = (): React.ReactNode => {
    const { assetDetails } = this.props;
    return (
      <FlatList<AssetFeature>
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        data={assetDetails?.features}
        keyExtractor={(item: AssetFeature): string => item.name}
        renderItem={({ item }: { item: AssetFeature }): React.ReactElement => (
          <View style={styles.featureItem}>
            <Label type="large" textType="regular" style={styles.featureTitle}>
              {item.name}
            </Label>
            <Label type="large" textType="semiBold">
              {item.value}
            </Label>
          </View>
        )}
      />
    );
  };

  private renderAmenities = (): React.ReactNode => {
    const { t, assetDetails } = this.props;
    const { amenitiesShowAll } = this.state;
    const length = assetDetails?.amenities.length ?? 0;
    let data = assetDetails?.amenities ?? [];

    if (length > 6 && !amenitiesShowAll) {
      data = data.slice(0, 6);
    }

    const onPress = (): void => {
      this.setState({ amenitiesShowAll: !amenitiesShowAll });
    };

    return (
      <View style={styles.sectionContainer}>
        <Text type="small" textType="semiBold" style={styles.textColor}>
          {t('amenities')}
        </Text>
        <FlatList
          numColumns={3}
          contentContainerStyle={styles.listContainer}
          data={data}
          keyExtractor={(item: Amenity): string => `${item.id}`}
          renderItem={({ item }: { item: Amenity }): React.ReactElement => (
            <View style={styles.amenityItem}>
              <SVGUri uri={item.attachment.link} height={30} width={30} />
              <Label type="regular" textType="regular" style={styles.amenityText}>
                {item.name}
              </Label>
            </View>
          )}
        />
        {length > 6 && (
          <Label type="large" textType="semiBold" style={styles.helperText} onPress={onPress}>
            {amenitiesShowAll ? t('property:showLess') : t('property:showAll', { total: length })}
          </Label>
        )}
        <Divider containerStyles={styles.divider} />
      </View>
    );
  };

  private renderAssetHighlights = (): React.ReactNode => {
    const { assetDetails } = this.props;
    return (
      <FlatList<AssetHighlight>
        data={assetDetails?.highlights}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item: AssetHighlight): string => `${item.name}`}
        renderItem={({ item }: { item: AssetHighlight }): React.ReactElement => (
          <View style={styles.highlightItemContainer}>
            <Icon name={icons.check} color={theme.colors.completed} size={22} />
            <Label type="large" textType="regular" style={styles.highlightText}>
              {item.name}
            </Label>
          </View>
        )}
      />
    );
  };

  private renderMapSection = (): React.ReactNode => {
    const { t, assetDetails } = this.props;

    if (!assetDetails) return null;
    const { latitude, longitude } = assetDetails;

    return (
      <View style={styles.sectionContainer}>
        <Text type="small" textType="semiBold" style={styles.textColor}>
          {t('exploreNeighbourhood')}
        </Text>
        <Label type="large" textType="regular" style={styles.neighborhoodAddress}>
          {assetDetails?.projectName}
        </Label>
        <MapView
          pointerEvents="none"
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={{ latitude, longitude }}>
            <CustomMarker selected />
          </Marker>
        </MapView>
        <View style={styles.exploreMapContainer}>
          <Label type="regular" textType="regular" style={styles.exploreMap}>
            {t('exploreMap')}
          </Label>
        </View>
        <Divider containerStyles={styles.divider} />
      </View>
    );
  };

  private renderCarousel = (): React.ReactElement => {
    const { assetDetails } = this.props;
    const { activeSlide } = this.state;
    return (
      <AssetDetailsImageCarousel
        enterFullScreen={this.onFullScreenToggle}
        data={assetDetails?.attachments ?? []}
        activeSlide={activeSlide}
        updateSlide={this.updateSlide}
      />
    );
  };

  private renderFullscreenCarousel = (): React.ReactNode => {
    const { isFullScreen, activeSlide } = this.state;
    const { assetDetails } = this.props;
    if (!isFullScreen) return null;
    return (
      <FullScreenAssetDetailsCarousel
        onFullScreenToggle={this.onFullScreenToggle}
        activeSlide={activeSlide}
        data={assetDetails?.attachments ?? []}
        updateSlide={this.updateSlide}
      />
    );
  };

  public renderSimilarProperties = (): React.ReactElement => {
    const {
      route: {
        params: { propertyTermId },
      },
      filters: { asset_transaction_type },
    } = this.props;
    return (
      <SimilarProperties
        onFavorite={this.onFavorite}
        propertyTermId={propertyTermId}
        transaction_type={asset_transaction_type}
        onSelectedProperty={this.loadSimilarProperty}
      />
    );
  };

  private onFullScreenToggle = (): void => {
    const { isFullScreen } = this.state;
    this.setState({ isFullScreen: !isFullScreen });
  };

  private onContactMailClicked = (): void => {
    const {
      navigation,
      assetDetails,
      route: {
        params: { propertyTermId },
      },
    } = this.props;

    // TODO: Need to add isLoggedIn condition

    if (!assetDetails) return;
    navigation.navigate(ScreensKeys.ContactForm, { contactDetail: assetDetails.contacts, propertyTermId });
  };

  public onFavorite = (propertyId: number): void => {
    // TODO: add the logic of favorite property
  };

  public updateSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private fixedHeader = (): React.ReactElement => {
    const { isScroll } = this.state;
    const color = isScroll ? theme.colors.white : theme.colors.darkTint1;
    const sectionStyle = StyleSheet.flatten([styles.fixedSection, isScroll && styles.initialSection]);
    return (
      <View key="fixed-header" style={sectionStyle}>
        <View style={styles.headerLeftIcon}>
          <Icon name={icons.leftArrow} size={22} color={color} onPress={this.goBack} />
        </View>
        <View style={styles.headerRightIcon}>
          <Icon name={icons.heartOutline} size={22} color={color} />
          <Icon name={icons.share} size={22} color={color} />
        </View>
      </View>
    );
  };

  private stickyHeader = (): React.ReactElement => {
    const { assetDetails } = this.props;
    return (
      <WithShadowView outerViewStyle={styles.shadowView}>
        <View key="sticky-header" style={styles.stickySection}>
          <Text type="regular" textType="semiBold" style={styles.headerTitle} numberOfLines={1}>
            {assetDetails?.projectName ?? ''}
          </Text>
        </View>
      </WithShadowView>
    );
  };

  public goBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  public loadSimilarProperty = (propertyTermId: number, propertyId: number): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertyAssetDescription, {
      propertyTermId,
      propertyId,
    });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    reviews: AssetSelectors.getAssetReviews(state),
    assetDetails: AssetSelectors.getAsset(state),
    isLoading: AssetSelectors.getLoadingState(state),
    filters: SearchSelector.getFilters(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetReviews, getAsset } = AssetActions;
  return bindActionCreators({ getAssetReviews, getAsset }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetDescription)(AssetDescription));

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.layout.screenPadding,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.darkTint10,
  },
  listContainer: {
    marginTop: 16,
  },
  featureItem: {
    flex: 1,
    marginBottom: 16,
  },
  amenityItem: {
    width: (theme.viewport.width - 32) / 3,
    alignItems: 'center',
    marginBottom: 16,
  },
  highlightItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textColor: {
    color: theme.colors.darkTint4,
  },
  sectionContainer: {
    marginTop: 24,
  },
  mapView: {
    flex: 1,
    marginTop: 12,
    height: 180,
  },
  divider: {
    marginTop: 24,
  },
  apartmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  timelineContainer: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconStyle: {
    marginHorizontal: 6,
  },
  primaryText: {
    color: theme.colors.primaryColor,
  },
  description: {
    color: theme.colors.darkTint4,
    marginTop: 12,
  },
  helperText: {
    marginTop: 12,
    color: theme.colors.active,
  },
  highlightText: {
    color: theme.colors.darkTint4,
    marginStart: 16,
  },
  headerLeftIcon: {
    position: 'absolute',
    left: relativeWidth(2),
  },
  headerRightIcon: {
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'space-between',
    right: relativeWidth(4),
    width: 80,
  },
  fixedSection: {
    position: 'absolute',
    width: theme.viewport.width,
    top: PlatformUtils.isIOS() ? 5 : 15,
    flexDirection: 'row',
  },
  initialSection: {
    top: PlatformUtils.isIOS() ? 50 : 40,
  },
  stickySection: {
    paddingBottom: 10,
  },
  shadowView: {
    marginTop: 0,
  },
  headerTitle: {
    marginLeft: 40,
    marginTop: PlatformUtils.isIOS() ? 0 : 10,
    width: theme.viewport.width / 2,
    color: theme.colors.darkTint1,
  },
  utilityItem: {
    marginRight: 20,
    marginLeft: 4,
  },
  neighborhoodAddress: {
    marginTop: 12,
    color: theme.colors.darkTint3,
  },
  featureTitle: {
    color: theme.colors.darkTint4,
    marginBottom: 4,
  },
  amenityText: {
    color: theme.colors.darkTint4,
    marginTop: 4,
  },
  exploreMapContainer: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  exploreMap: {
    color: theme.colors.primaryColor,
  },
  textIcon: {
    flexDirection: 'row',
  },
  subAddress: {
    marginHorizontal: 0,
  },
  verticalDivider: {
    borderWidth: 1,
    height: 30,
    marginRight: 14,
    borderColor: theme.colors.darkTint10,
  },
  amenitiesContainer: {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
});
