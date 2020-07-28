import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Collapsible from 'react-native-collapsible';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import {
  CustomMarker,
  Divider,
  Label,
  PricePerUnit,
  PropertyAddress,
  Text,
  WithShadowView,
} from '@homzhub/common/src/components';
import { StatusBarComponent } from '@homzhub/mobile/src/components/atoms/StatusBar';
import { AssetRatings } from '@homzhub/mobile/src/components/molecules/AssetRatings';
import ShieldGroup from '@homzhub/common/src/components/molecules/ShieldGroup';
import { AssetDetailsImageCarousel } from '@homzhub/mobile/src/components/molecules/AssetDetailsImageCarousel';
import { FullScreenAssetDetailsCarousel } from '@homzhub/mobile/src/components/molecules/FullScreenAssetDetailsCarousel';
import PropertyAmenities from '@homzhub/mobile/src/components/molecules/PropertyAmenities';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetHighlight } from '@homzhub/common/src/domain/models/AssetHighlight';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';

interface IStateProps {
  reviews: AssetReview[];
  assetDetails: Asset | null;
}

interface IDispatchProps {
  getAssetReviews: (id: number) => void;
}

interface IOwnState {
  isFullScreen: boolean;
  activeSlide: number;
  descriptionShowMore: boolean;
  isScroll: boolean;
}

const { width, height } = theme.viewport;
const realWidth = height > width ? width : height;
const relativeWidth = (num: number): number => (realWidth * num) / 100;

const PARALLAX_HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = 60;

type Props = IStateProps & IDispatchProps & WithTranslation;
// TODO: Get from redux once set up
const IMAGES = [
  {
    id: 1,
    name: 'image1.png',
    link: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
    attachment_type: 'IMAGE',
    mime_type: 'Image/Jpeg',
    is_cover_image: true,
  },
  {
    id: 2,
    name: 'image2.png',
    link: 'https://www.youtube.com/watch?v=L7OLY4HCctQ',
    attachment_type: 'VIDEO',
    mime_type: 'Image/Jpeg',
    is_cover_image: true,
  },
  {
    id: 3,
    name: 'image3.png',
    link: 'https://homepages.cae.wisc.edu/~ece533/images/baboon.png',
    attachment_type: 'IMAGE',
    mime_type: 'Image/Jpeg',
    is_cover_image: true,
  },
  {
    id: 4,
    name: 'image4.png',
    link: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
    attachment_type: 'IMAGE',
    mime_type: 'Image/Jpeg',
    is_cover_image: true,
  },
  {
    id: 5,
    name: 'image5.png',
    link: 'https://homepages.cae.wisc.edu/~ece533/images/monarch.png',
    attachment_type: 'IMAGE',
    mime_type: 'Image/Jpeg',
    is_cover_image: true,
  },
];

interface ICollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  initialCollapsedValue?: boolean;
}
const CollapsibleSection = (props: ICollapsibleSectionProps): React.ReactElement => {
  const { title, children, initialCollapsedValue = false } = props;
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsedValue);

  const onPress = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <TouchableOpacity style={styles.ratingsHeading} onPress={onPress}>
        <Text type="small" textType="semiBold" style={styles.textColor}>
          {title}
        </Text>
        <Icon name={isCollapsed ? icons.plus : icons.minus} size={20} color={theme.colors.darkTint4} />
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>{children}</Collapsible>
      <Divider containerStyles={styles.divider} />
    </>
  );
};

class AssetDescription extends React.PureComponent<Props, IOwnState> {
  public state = {
    isFullScreen: false,
    descriptionShowMore: false,
    activeSlide: 0,
    isScroll: true,
  };

  public componentDidMount = (): void => {
    // const { getAssetReviews } = this.props;
    // getAssetReviews(1);
  };

  public render = (): React.ReactNode => {
    const { t, reviews } = this.props;

    return (
      <>
        <StatusBarComponent backgroundColor={theme.colors.white} isTranslucent />
        <ParallaxScrollView
          backgroundColor={theme.colors.white}
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
            <CollapsibleSection title={t('highlights')}>{this.renderAssetHighlights()}</CollapsibleSection>
            {this.renderMapSection()}
            <CollapsibleSection title={t('reviewsRatings')}>
              <AssetRatings reviews={reviews} />
            </CollapsibleSection>
          </View>
        </ParallaxScrollView>
        {this.renderFullscreenCarousel()}
      </>
    );
  };

  private renderHeaderSection = (): React.ReactElement | null => {
    const { assetDetails, t } = this.props;
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
      availableFrom,
      projectName,
      assetGroup: { name },
    } = assetDetails;
    const propertyType = assetType ? assetDetails.assetType.name : '';
    const term = leaseTerm || saleTerm;

    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      carpetArea,
      carpetAreaUnit,
      spaces,
      floorNumber,
      name,
      true
    );

    const propertyTimelineData = PropertyUtils.getPropertyTimelineData(
      name,
      leaseTerm,
      saleTerm,
      postedOn,
      availableFrom
    );

    return (
      <View style={styles.headerContainer}>
        <ShieldGroup text={propertyType} />
        <View style={styles.apartmentContainer}>
          <PricePerUnit price={term.expectedPrice || 0} currency="INR" unit="month" />
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
            primaryAddress="Eaton Garth Manor" // TODO: (Shikha) - remove once api integrate
            subAddress={projectName}
            subAddressStyle={styles.subAddress}
          />
          <View style={styles.textIcon}>
            <View style={styles.verticalDivider} />
            <Icon name={icons.houseMarker} size={30} color={theme.colors.blue} style={styles.iconStyle} />
          </View>
        </View>
        <PropertyAmenities
          data={amenitiesData}
          direction="row"
          containerStyle={styles.amenitiesContainer}
          contentContainerStyle={styles.amenitiesContent}
        />
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
    const { descriptionShowMore } = this.state;

    const onPress = (): void => {
      this.setState({ descriptionShowMore: !descriptionShowMore });
    };

    return (
      <>
        <Label
          type="large"
          textType="regular"
          style={styles.description}
          numberOfLines={descriptionShowMore ? undefined : 3}
        >
          {assetDetails?.description}
        </Label>
        <Label type="large" textType="semiBold" style={styles.helperText} onPress={onPress}>
          {descriptionShowMore ? t('property:showLess') : t('property:showMore')}
        </Label>
      </>
    );
  };

  private renderAssetHighlights = (): React.ReactNode => {
    const { assetDetails } = this.props;
    return (
      <FlatList<AssetHighlight>
        data={assetDetails?.highlights}
        numColumns={2}
        contentContainerStyle={styles.highlightsContainer}
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
      <View style={styles.neighborhoodContainer}>
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
    const { activeSlide } = this.state;
    return (
      <AssetDetailsImageCarousel
        enterFullScreen={this.onFullScreenToggle}
        images={IMAGES}
        activeSlide={activeSlide}
        updateSlide={this.updateSlide}
      />
    );
  };

  private renderFullscreenCarousel = (): React.ReactNode => {
    const { isFullScreen, activeSlide } = this.state;
    if (!isFullScreen) return null;
    return (
      <FullScreenAssetDetailsCarousel
        onFullScreenToggle={this.onFullScreenToggle}
        activeSlide={activeSlide}
        data={IMAGES}
        updateSlide={this.updateSlide}
      />
    );
  };

  private onFullScreenToggle = (): void => {
    const { isFullScreen } = this.state;
    this.setState({ isFullScreen: !isFullScreen });
  };

  private fixedHeader = (): React.ReactElement => {
    const { isScroll } = this.state;
    const color = isScroll ? theme.colors.white : theme.colors.darkTint1;
    return (
      <View key="fixed-header" style={styles.fixedSection}>
        <View style={styles.headerLeftIcon}>
          <Icon name={icons.leftArrow} size={22} color={color} />
        </View>
        <View style={styles.headerRightIcon}>
          <Icon name={icons.heartOutline} size={22} color={color} />
          <Icon name={icons.compare} size={22} color={color} />
        </View>
      </View>
    );
  };

  private stickyHeader = (): React.ReactElement => {
    return (
      <WithShadowView outerViewStyle={styles.shadowView}>
        <View key="sticky-header" style={styles.stickySection}>
          <Text type="regular" textType="semiBold" style={styles.headerTitle}>
            Eaton Garth Manor
          </Text>
        </View>
      </WithShadowView>
    );
  };

  public updateSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    reviews: AssetSelectors.getAssetReviews(state),
    assetDetails: AssetSelectors.getAsset(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetReviews } = AssetActions;
  return bindActionCreators({ getAssetReviews }, dispatch);
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
  ratingsHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  highlightsContainer: {
    marginTop: 16,
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
  neighborhoodContainer: {
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
    top: 20,
    flexDirection: 'row',
  },
  stickySection: {
    paddingBottom: 10,
    width: 300,
    justifyContent: 'flex-end',
  },
  shadowView: {
    marginTop: 15,
  },
  headerTitle: {
    marginLeft: 40,
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
    justifyContent: 'flex-start',
    marginBottom: 14,
  },
  amenitiesContent: {
    marginRight: 16,
  },
});
