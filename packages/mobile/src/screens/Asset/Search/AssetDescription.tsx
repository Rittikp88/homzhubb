import React from 'react';
import { Share, StyleSheet, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { CommonActions } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { IGetAssetPayload } from '@homzhub/common/src/modules/asset/interfaces';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import {
  IAssetVisitPayload,
  ISendNotificationPayload,
  VisitType,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { CustomMarker } from '@homzhub/common/src/components/atoms/CustomMarker';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Favorite } from '@homzhub/common/src/components/atoms/Favorite';
import { PricePerUnit } from '@homzhub/common/src/components/atoms/PricePerUnit';
import { StatusBar } from '@homzhub/mobile/src/components/atoms/StatusBar';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';
import { ContactPerson } from '@homzhub/common/src/components/molecules/ContactPerson';
import { PropertyAddress } from '@homzhub/common/src/components/molecules/PropertyAddress';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import {
  AssetDetailsImageCarousel,
  CollapsibleSection,
  FullScreenAssetDetailsCarousel,
  Loader,
  ShieldGroup,
} from '@homzhub/mobile/src/components';
import { AssetReviewsSummary } from '@homzhub/mobile/src/components/molecules/AssetReviewsSummary';
import { PropertyReviewCard } from '@homzhub/mobile/src/components/molecules/PropertyReviewCard';
import PropertyDetail from '@homzhub/mobile/src/components/organisms/PropertyDetail';
import SimilarProperties from '@homzhub/mobile/src/components/organisms/SimilarProperties';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { ContactActions, IAmenitiesIcons, IFilter } from '@homzhub/common/src/domain/models/Search';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { DynamicLinkParamKeys, DynamicLinkTypes, RouteTypes } from '@homzhub/mobile/src/services/constants';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

interface IStateProps {
  reviews: AssetReview | null;
  assetDetails: Asset | null;
  isLoading: boolean;
  filters: IFilter;
  isLoggedIn: boolean;
}

interface IDispatchProps {
  getAsset: (payload: IGetAssetPayload) => void;
  setChangeStack: (flag: boolean) => void;
  setSelectedPlan: (payload: ISelectedAssetPlan) => void;
  setAssetId: (payload: number) => void;
  getAssetById: () => void;
  setVisitIds: (payload: number[]) => void;
  getAssetVisit: (payload: IAssetVisitPayload) => void;
}

interface IOwnState {
  isFullScreen: boolean;
  activeSlide: number;
  isScroll: boolean;
  isFavourite: boolean;
  startDate: string;
}

const { width, height } = theme.viewport;
const realWidth = height > width ? width : height;
const relativeWidth = (num: number): number => (realWidth * num) / 100;

const PARALLAX_HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = 100;

// TODO: Do we require a byId reducer here?
const initialState = {
  isFullScreen: false,
  activeSlide: 0,
  isScroll: true,
  isFavourite: false,
  startDate: '',
};

type libraryProps = WithTranslation & NavigationScreenProps<SearchStackParamList, ScreensKeys.PropertyAssetDescription>;
type Props = IStateProps & IDispatchProps & libraryProps;

export class AssetDescription extends React.PureComponent<Props, IOwnState> {
  public focusListener: any;
  public state = initialState;

  public componentDidMount = (): void => {
    const { navigation } = this.props;
    const startDate = this.getFormattedDate();
    this.setState({ startDate });
    this.focusListener = navigation.addListener('focus', () => {
      this.getAssetData();
    });
  };

  // TODO: Do we require a byId reducer here?
  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<IOwnState>, snapshot?: any): void {
    const {
      route: {
        params: { propertyTermId: oldPropertyTermId },
      },
    } = prevProps;
    const {
      getAsset,
      route: {
        params: { propertyTermId: newPropertyTermId },
      },
    } = this.props;
    if (oldPropertyTermId !== newPropertyTermId) {
      const payload: IGetAssetPayload = {
        propertyTermId: newPropertyTermId,
      };
      getAsset(payload);
      const startDate = this.getFormattedDate();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ ...initialState, startDate });
    }
  }

  public componentWillUnmount = async (): Promise<void> => {
    await this.getViewCounts();
  };

  public render = (): React.ReactNode => {
    const { isLoading } = this.props;

    return (
      <>
        <Loader visible={isLoading} />
        {this.renderComponent()}
      </>
    );
  };

  private renderComponent = (): React.ReactElement | null => {
    const {
      t,
      assetDetails,
      reviews,
      route: {
        params: { isPreview },
      },
    } = this.props;
    const { isFullScreen, isScroll } = this.state;

    if (!assetDetails) return null;

    const {
      contacts: { fullName, phoneNumber, countryCode, profilePicture },
      appPermissions,
    } = assetDetails;

    return (
      <>
        <StatusBar
          statusBarBackground={!isScroll ? theme.colors.white : theme.colors.darkTint1}
          barStyle={isScroll ? 'light-content' : 'dark-content'}
        />
        <ParallaxScrollView
          backgroundColor={theme.colors.transparent}
          stickyHeaderHeight={STICKY_HEADER_HEIGHT}
          parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
          backgroundSpeed={10}
          onChangeHeaderVisibility={(isChanged: boolean): void => this.setState({ isScroll: isChanged })}
          renderForeground={this.renderCarousel}
          renderStickyHeader={this.renderStickyHeader}
          renderFixedHeader={this.renderFixedHeader}
          testID="parallaxView"
        >
          <View style={styles.screen}>
            {this.renderHeaderSection()}
            <PropertyDetail detail={assetDetails} />
            {this.renderMapSection()}
            {reviews && (
              <CollapsibleSection title={t('reviewsRatings')} isDividerRequired>
                <>
                  <AssetReviewsSummary
                    reviewSummary={reviews}
                    titleRequired={false}
                    showDivider={false}
                    sliderWidth={theme.viewport.width - theme.layout.screenPadding * 2}
                  />
                  {/* <TouchableOpacity onPress={this.onReadReviews}>
                    <Label type="large" textType="semiBold" style={styles.primaryText}>
                      {t('readReviews')}
                    </Label>
                  </TouchableOpacity> */}
                </>
              </CollapsibleSection>
            )}
            {!isPreview && this.renderSimilarProperties()}
          </View>
        </ParallaxScrollView>
        {this.renderFullscreenCarousel()}
        {appPermissions?.addListingVisit && !isFullScreen && !isPreview && (
          <ContactPerson
            fullName={fullName}
            phoneNumber={`${countryCode}${phoneNumber}`}
            designation="Owner"
            image={profilePicture}
            onContactTypeClicked={this.onContactTypeClicked}
          />
        )}
        {!isFullScreen && isPreview && (
          <View style={styles.buttonContainer}>
            <Button
              type="secondary"
              title={t('common:edit')}
              icon={icons.noteBook}
              iconColor={theme.colors.blue}
              iconSize={20}
              titleStyle={styles.buttonTitle}
              onPress={this.onEdit}
              containerStyle={styles.editButton}
            />
            <Button
              type="primary"
              title={t('common:done')}
              icon={icons.circularCheckFilled}
              iconColor={theme.colors.white}
              iconSize={20}
              onPress={this.onDone}
              titleStyle={styles.buttonTitle}
              containerStyle={styles.doneButton}
            />
          </View>
        )}
      </>
    );
  };

  private renderHeaderSection = (): React.ReactElement | null => {
    const {
      assetDetails,
      t,
      filters: { asset_transaction_type },
      route: {
        params: { isPreview },
      },
    } = this.props;
    if (!assetDetails) {
      return null;
    }
    const {
      spaces,
      carpetArea,
      carpetAreaUnit,
      furnishing,
      assetType,
      leaseTerm,
      saleTerm,
      postedOn,
      address,
      projectName,
      unitNumber,
      blockNumber,
      country: { currencies },
      visitDate,
      verifications: { description },
      assetGroup: { code, name },
      appPermissions,
    } = assetDetails;
    const propertyType = assetType ? assetDetails.assetType.name : '';

    const scheduleVisit = visitDate ? DateUtils.getDisplayDate(visitDate, 'LL') : t('bookTour');

    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces,
      furnishing,
      code,
      carpetArea,
      carpetAreaUnit?.title ?? '',
      true
    );

    const propertyTimelineData = PropertyUtils.getPropertyTimelineData(
      name,
      postedOn,
      (leaseTerm?.availableFromDate || saleTerm?.availableFromDate) ?? '',
      asset_transaction_type || 0,
      saleTerm
    );

    let currencyData = currencies[0];

    if (leaseTerm && leaseTerm.currency) {
      currencyData = leaseTerm.currency;
    }

    if (saleTerm && saleTerm.currency) {
      currencyData = saleTerm.currency;
    }

    return (
      <View style={styles.headerContainer}>
        <ShieldGroup propertyType={propertyType} text={description} isInfoRequired />
        <View style={styles.apartmentContainer}>
          <PricePerUnit
            price={(Number(leaseTerm?.expectedPrice) || Number(saleTerm?.expectedPrice)) ?? 0}
            currency={currencyData}
            unit={asset_transaction_type === 0 ? 'mo' : ''}
          />
          {appPermissions?.addListingVisit && (
            <TouchableOpacity style={styles.textIcon} disabled={isPreview} onPress={this.onBookVisit}>
              <Icon name={icons.timer} size={22} color={theme.colors.blue} style={styles.iconStyle} />
              <Text type="small" textType="regular" style={styles.primaryText}>
                {scheduleVisit}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.apartmentContainer}>
          <PropertyAddress
            isIcon={false}
            primaryAddress={projectName}
            subAddress={address || `${unitNumber ?? ''} ${blockNumber ?? ''}`}
            subAddressStyle={styles.subAddress}
          />
          <TouchableOpacity style={styles.textIcon} onPress={this.onExploreNeighborhood} disabled={isPreview || false}>
            <View style={styles.verticalDivider} />
            <Icon name={icons.houseMarker} size={30} color={theme.colors.blue} style={styles.iconStyle} />
          </TouchableOpacity>
        </View>
        <PropertyAmenities data={amenitiesData} direction="row" containerStyle={styles.amenitiesContainer} />
        <Divider />
        <View style={styles.timelineContainer}>{this.renderPropertyTimelines(propertyTimelineData)}</View>
        <Divider />
        {isPreview && <PropertyReviewCard containerStyle={styles.reviewCard} />}
      </View>
    );
  };

  private renderPropertyTimelines = (data: { label: string; value: string }[]): React.ReactElement => {
    return (
      <>
        {data.map((item: { label: string; value: string }, index: number) => {
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

  private renderMapSection = (): React.ReactNode => {
    const {
      t,
      assetDetails,
      route: {
        params: { isPreview },
      },
    } = this.props;

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
        <TouchableOpacity style={styles.exploreMapContainer} disabled={isPreview} onPress={this.onExploreNeighborhood}>
          <Label type="regular" textType="regular" style={styles.exploreMap}>
            {t('exploreMap')}
          </Label>
        </TouchableOpacity>
        <Divider containerStyles={styles.divider} />
      </View>
    );
  };

  private renderCarousel = (): React.ReactElement => {
    const { activeSlide } = this.state;
    const { assetDetails } = this.props;

    if (assetDetails && assetDetails?.attachments.length <= 0) {
      return <ImagePlaceholder height="100%" containerStyle={styles.placeholder} />;
    }

    return (
      <AssetDetailsImageCarousel
        enterFullScreen={this.onFullScreenToggle}
        data={assetDetails?.attachments ?? []}
        activeSlide={activeSlide}
        updateSlide={this.updateSlide}
        containerStyles={styles.carousel}
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
        onShare={this.handleShare}
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
        propertyTermId={propertyTermId}
        transaction_type={asset_transaction_type || 0}
        onSelectedProperty={this.loadSimilarProperty}
      />
    );
  };

  private renderFixedHeader = (): React.ReactElement | null => {
    const { isScroll } = this.state;
    const {
      assetDetails,
      route: { params },
    } = this.props;
    if (!assetDetails) return null;
    const { leaseTerm, saleTerm } = assetDetails;
    const color = isScroll ? theme.colors.white : theme.colors.darkTint1;
    const sectionStyle = StyleSheet.flatten([styles.fixedSection, isScroll && styles.initialSection]);
    return (
      <View key="fixed-header" style={sectionStyle}>
        <View style={styles.headerLeftIcon}>
          <Icon name={icons.leftArrow} size={26} color={color} onPress={this.onGoBack} />
        </View>
        <View style={styles.headerRightIcon}>
          <Favorite
            isDisable={params.isPreview}
            iconColor={color}
            iconSize={24}
            leaseId={leaseTerm?.id}
            saleId={saleTerm?.id}
            fromScreen={ScreensKeys.PropertyAssetDescription}
          />
          <Icon name={icons.share} size={22} color={color} onPress={this.handleShare} />
        </View>
      </View>
    );
  };

  private renderStickyHeader = (): React.ReactElement => {
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

  private onFullScreenToggle = (): void => {
    const { isFullScreen } = this.state;
    this.setState({ isFullScreen: !isFullScreen });
  };

  private onReadReviews = (): void => {};

  private onContactTypeClicked = async (type: ContactActions, phoneNumber: string, message: string): Promise<void> => {
    const { isLoggedIn, setChangeStack, navigation, assetDetails } = this.props;
    const sendWhatsappMessage = async (): Promise<void> => {
      AnalyticsService.track(EventType.ContactOwner, {
        source: ContactActions.WHATSAPP,
        property_address: assetDetails?.address ?? '',
      });
      return await LinkingService.whatsappMessage(phoneNumber, message);
    };
    const openDialer = async (): Promise<void> => {
      AnalyticsService.track(EventType.ContactOwner, {
        source: ContactActions.CALL,
        property_address: assetDetails?.address ?? '',
      });
      return await LinkingService.openDialer(phoneNumber);
    };
    switch (type) {
      case ContactActions.WHATSAPP:
        if (!isLoggedIn) {
          setChangeStack(false);
          navigation.navigate(ScreensKeys.AuthStack, {
            screen: ScreensKeys.SignUp,
            params: { onCallback: sendWhatsappMessage },
          });
        } else {
          await sendWhatsappMessage();
        }
        break;
      case ContactActions.CALL:
        if (!isLoggedIn) {
          setChangeStack(false);
          navigation.navigate(ScreensKeys.AuthStack, {
            screen: ScreensKeys.SignUp,
            params: { onCallback: openDialer },
          });
        } else {
          await openDialer();
        }
        break;
      default:
        this.onContactMailClicked();
    }
  };

  private onContactMailClicked = (): void => {
    const { navigation, assetDetails, isLoggedIn, setChangeStack } = this.props;

    if (!assetDetails) return;
    AnalyticsService.track(EventType.ContactOwner, {
      source: ContactActions.MAIL,
      property_address: assetDetails.address,
    });
    if (!isLoggedIn) {
      setChangeStack(false);
      navigation.navigate(ScreensKeys.AuthStack, {
        screen: ScreensKeys.SignUp,
        params: { onCallback: this.navigateToContactForm },
      });
    } else {
      this.navigateToContactForm();
    }
  };

  private onExploreNeighborhood = (): void => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(ScreensKeys.AssetNeighbourhood);
  };

  private onGoBack = (): void => {
    const {
      navigation,
      isLoggedIn,
      route: { params },
    } = this.props;

    if (params && params.isPreview) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreensKeys.BottomTabs }],
        })
      );
      return;
    }

    // Todo (Sriram 2020.09.11) Do we have to move this logic to Utils?
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    // TODO: Remove if there is no use-case
    if (isLoggedIn) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: ScreensKeys.PropertyPostLandingScreen }],
        })
      );
    }
  };

  private onBookVisit = (): void => {
    const { navigation, isLoggedIn, setChangeStack } = this.props;
    if (!isLoggedIn) {
      setChangeStack(false);
      navigation.navigate(ScreensKeys.AuthStack, {
        screen: ScreensKeys.SignUp,
        params: { onCallback: this.navigateToVisitForm },
      });
    } else {
      this.navigateToVisitForm();
    }
  };

  private onEdit = (): void => {
    const {
      navigation,
      route: {
        params: { propertyId },
      },
      setSelectedPlan,
      setAssetId,
      filters: { asset_transaction_type },
      getAssetById,
    } = this.props;
    if (propertyId) {
      setAssetId(propertyId);
    }

    const selectedPlan = asset_transaction_type === 0 ? TypeOfPlan.RENT : TypeOfPlan.SELL;
    setSelectedPlan({ id: 1, selectedPlan });
    getAssetById();
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AssetLeaseListing,
      params: {
        previousScreen: ScreensKeys.PropertyAssetDescription,
        isEditFlow: true,
      },
    });
  };

  private onDone = async (): Promise<void> => {
    const { navigation, assetDetails } = this.props;
    if (!assetDetails) return;

    const { leaseTerm, saleTerm } = assetDetails;
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreensKeys.BottomTabs }],
      })
    );

    // Trigger notification for under review properties
    const payload: ISendNotificationPayload = {
      lease_listings: leaseTerm ? [leaseTerm.id] : [],
      sale_listing: saleTerm ? saleTerm.id : null,
    };

    try {
      await AssetRepository.sendNotification(payload);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private navigateToVisitForm = (): void => {
    const {
      navigation,
      route: {
        params: { propertyTermId },
      },
      setVisitIds,
      assetDetails,
      getAssetVisit,
    } = this.props;
    if (!assetDetails) return;
    const { leaseTerm, saleTerm, nextVisit } = assetDetails;

    if (nextVisit) {
      setVisitIds([nextVisit.id]);
      getAssetVisit({ id: nextVisit.id });
    }

    const param = {
      propertyTermId,
      ...(leaseTerm && { lease_listing_id: leaseTerm.id }),
      ...(saleTerm && { sale_listing_id: saleTerm.id }),
      ...(nextVisit && { isReschedule: true }),
    };

    navigation.navigate(ScreensKeys.BookVisit, param);
  };

  private navigateToContactForm = (): void => {
    const {
      navigation,
      assetDetails,
      route: {
        params: { propertyTermId },
      },
    } = this.props;
    navigation.navigate(ScreensKeys.ContactForm, { contactDetail: assetDetails?.contacts ?? null, propertyTermId });
  };

  public updateSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  public loadSimilarProperty = (propertyTermId: number, propertyId: number): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertyAssetDescription, {
      propertyTermId,
      propertyId,
    });
  };

  private getAssetData = (): void => {
    const {
      getAsset,
      route: {
        params: { propertyTermId },
      },
    } = this.props;
    const payload: IGetAssetPayload = {
      propertyTermId,
    };
    getAsset(payload);
  };

  private getFormattedDate = (): string => {
    const date = DateUtils.getCurrentDate();
    const time = DateUtils.getCurrentTime();
    const formatted = DateUtils.getISOFormattedDate(date, Number(time));
    return DateUtils.getUtcFormatted(formatted, DateFormats.ISO, DateFormats.ISO24Format);
  };

  private getViewCounts = async (): Promise<void> => {
    const { startDate } = this.state;
    const { isLoggedIn, assetDetails } = this.props;
    const endDate = this.getFormattedDate();
    if (!assetDetails) return;
    const { leaseTerm, saleTerm, appPermissions } = assetDetails;
    if (appPermissions && !appPermissions.addListingVisit) return;

    const payload = {
      visit_type: VisitType.PROPERTY_VIEW,
      lead_type: 11, // TODO: (Shikha) Need to add proper Id once Logic integrated
      start_date: startDate,
      end_date: endDate,
      lease_listing: leaseTerm ? leaseTerm.id : null,
      sale_listing: saleTerm ? saleTerm.id : null,
    };
    if (isLoggedIn) {
      try {
        await AssetRepository.propertyVisit(payload);
      } catch (e) {
        const error = ErrorUtils.getErrorMessage(e);
        AlertHelper.error({ message: error });
      }
    }
  };

  public handleShare = async (): Promise<void> => {
    const {
      t,
      route: {
        params: { propertyTermId, isPreview },
      },
    } = this.props;

    const url = await LinkingService.buildShortLink(
      DynamicLinkTypes.AssetDescription,
      `${DynamicLinkParamKeys.RouteType}=${RouteTypes.Public}&${DynamicLinkParamKeys.PropertyTermId}=${propertyTermId}`
    );

    if (!isPreview) {
      try {
        await Share.share({
          message: t('common:shareMessage', { url }),
        });
      } catch (error) {
        AlertHelper.error({ message: error });
      }
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    reviews: AssetSelectors.getAssetReviews(state),
    assetDetails: AssetSelectors.getAsset(state),
    isLoading: AssetSelectors.getLoadingState(state),
    filters: SearchSelector.getFilters(state),
    isLoggedIn: UserSelector.isLoggedIn(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAsset, setVisitIds, getAssetVisit } = AssetActions;
  const { setChangeStack } = UserActions;
  const { setAssetId, setSelectedPlan, getAssetById } = RecordAssetActions;
  return bindActionCreators(
    {
      getAsset,
      setChangeStack,
      setAssetId,
      setSelectedPlan,
      getAssetById,
      setVisitIds,
      getAssetVisit,
    },
    dispatch
  );
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerLeftIcon: {
    position: 'absolute',
    left: relativeWidth(2),
  },
  headerRightIcon: {
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'space-between',
    right: relativeWidth(4),
    width: 60,
  },
  fixedSection: {
    position: 'absolute',
    width: theme.viewport.width,
    top: 4,
    flexDirection: 'row',
  },
  initialSection: {
    top: 4,
  },
  stickySection: {
    paddingBottom: 10,
  },
  shadowView: {
    marginTop: 0,
  },
  headerTitle: {
    marginLeft: 40,
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
    marginLeft: 0,
    maxWidth: 240,
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
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 22,
  },
  editButton: {
    marginLeft: 10,
    flexDirection: 'row-reverse',
  },
  doneButton: {
    flexDirection: 'row-reverse',
  },
  buttonTitle: {
    marginHorizontal: 4,
  },
  reviewCard: {
    marginVertical: 10,
  },
  placeholder: {
    backgroundColor: theme.colors.darkTint5,
  },
  carousel: {
    borderRadius: 0,
  },
});
