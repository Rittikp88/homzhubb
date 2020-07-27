import React from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Collapsible from 'react-native-collapsible';
import ImageZoom from 'react-native-image-pan-zoom';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider, Image, ImageVideoPagination, Text, WithShadowView } from '@homzhub/common/src/components';
import { StatusBarComponent } from '@homzhub/mobile/src/components/atoms/StatusBar';
import { AssetRatings } from '@homzhub/mobile/src/components/molecules/AssetRatings';
import { PropertyDetailsImageCarousel } from '@homzhub/mobile/src/components/molecules/PropertyDetailsImageCarousel';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';

interface IStateProps {
  reviews: AssetReview[];
}

interface IDispatchProps {
  getAssetReviews: (id: number) => void;
}

interface IOwnState {
  isRatingCollapsed: boolean;
  isFullScreen: boolean;
  activeSlide: number;
  isScroll: boolean;
}

const { width, height } = theme.viewport;
const realWidth = height > width ? width : height;
const relativeWidth = (num: number): number => (realWidth * num) / 100;

const PARALLAX_HEADER_HEIGHT = 200;
const STICKY_HEADER_HEIGHT = 60;

type Props = IStateProps & IDispatchProps & WithTranslation;
// TODO: Get from redux once set up
const IMAGES = [
  'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
  'https://homepages.cae.wisc.edu/~ece533/images/arctichare.png',
  'https://homepages.cae.wisc.edu/~ece533/images/baboon.png',
  'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
  'https://homepages.cae.wisc.edu/~ece533/images/monarch.png',
];

class AssetDescription extends React.PureComponent<Props, IOwnState> {
  public state = {
    isRatingCollapsed: false,
    isFullScreen: false,
    activeSlide: 0,
    isScroll: true,
  };

  public componentDidMount = (): void => {
    // const { getAssetReviews } = this.props;
    // getAssetReviews(1);
  };

  public render = (): React.ReactNode => {
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
          <View style={styles.screen}>{this.renderReviews()}</View>
        </ParallaxScrollView>
        {this.renderFullscreenCarousel()}
      </>
    );
  };

  private renderCarousel = (): React.ReactElement => {
    const { activeSlide } = this.state;
    return (
      <PropertyDetailsImageCarousel
        toggleImage={this.onFullScreenToggle}
        images={IMAGES}
        activeSlide={activeSlide}
        updateSlide={this.updateSlide}
      />
    );
  };

  private renderFullscreenCarousel = (): React.ReactNode => {
    const { isFullScreen } = this.state;
    if (!isFullScreen) return null;
    return (
      <View style={styles.fullscreen}>
        {this.renderListHeader()}
        {this.renderImageAndVideo()}
      </View>
    );
  };

  public renderListHeader = (): React.ReactElement => {
    const { activeSlide } = this.state;
    return (
      <View style={styles.fullscreenContainer}>
        <Icon name={icons.close} size={20} color={theme.colors.white} onPress={this.onFullScreenToggle} />
        <ImageVideoPagination currentSlide={activeSlide} totalSlides={IMAGES.length} type="image" />
        <Icon name={icons.star} size={40} color={theme.colors.white} onPress={this.onFullScreenToggle} />
      </View>
    );
  };

  public renderImageAndVideo = (): React.ReactElement => {
    const { activeSlide } = this.state;
    const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
      const pageNumber =
        Math.min(
          Math.max(Math.floor(e.nativeEvent.contentOffset.x / theme.viewport.width + 0.5) + 1, 0),
          IMAGES.length
        ) - 1;
      this.setState({ activeSlide: pageNumber });
    };
    return (
      <FlatList
        data={IMAGES} // TODO: Get the value from redux
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={this.renderItem}
        onMomentumScrollEnd={onScrollEnd}
        keyExtractor={this.renderKeyExtractor}
        initialScrollIndex={activeSlide}
      />
    );
  };

  public renderItem = (item: any): React.ReactElement => {
    return (
      <ImageZoom
        cropWidth={theme.viewport.width}
        cropHeight={theme.viewport.height}
        imageWidth={theme.viewport.width}
        imageHeight={500}
        enableSwipeDown
        useHardwareTextureAndroid
        onSwipeDown={this.onFullScreenToggle}
      >
        <Image source={{ uri: item.item }} style={styles.carouselImage} />
      </ImageZoom>
    );
  };

  private renderReviews = (): React.ReactNode => {
    const { t, reviews } = this.props;
    const { isRatingCollapsed } = this.state;
    return (
      <>
        <TouchableOpacity style={styles.ratingsHeading} onPress={this.onReviewsToggle}>
          <Text type="small" textType="semiBold" style={styles.sectionHeading}>
            {t('reviewsRatings')}
          </Text>
          <Icon name={isRatingCollapsed ? icons.plus : icons.minus} size={20} color={theme.colors.darkTint4} />
        </TouchableOpacity>
        <Collapsible collapsed={isRatingCollapsed}>
          <AssetRatings reviews={reviews} />
        </Collapsible>
        <Divider containerStyles={styles.divider} />
      </>
    );
  };

  private renderKeyExtractor = (item: any, index: number): string => {
    return `${item}-${index}`;
  };

  private onReviewsToggle = (): void => {
    const { isRatingCollapsed } = this.state;
    this.setState({ isRatingCollapsed: !isRatingCollapsed });
  };

  private onFullScreenToggle = (): void => {
    const { isFullScreen } = this.state;
    this.setState({ isFullScreen: !isFullScreen });
  };

  public fixedHeader = (): React.ReactElement => {
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

  public stickyHeader = (): React.ReactElement => {
    return (
      <WithShadowView outerViewStyle={styles.shadowView}>
        <View key="sticky-header" style={styles.stickySection}>
          <Text type="regular" textType="semiBold" style={styles.headerTitle}>
            Property Name
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
  ratingsHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeading: {
    color: theme.colors.darkTint4,
  },
  divider: {
    marginTop: 24,
  },
  fullscreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: theme.colors.darkTint1,
    flexGrow: 1,
  },
  fullscreenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    margin: theme.layout.screenPadding,
  },
  carouselImage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: theme.viewport.height / 2,
    width: theme.viewport.width,
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
});
