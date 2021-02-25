import React, { PureComponent } from 'react';
import {
  LayoutChangeEvent,
  PickerItemProps,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { MoreStackNavigatorParamList, PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { AssetReviewCard } from '@homzhub/mobile/src/components/molecules/AssetReviewCard';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { AddressWithVisitDetail } from '@homzhub/mobile/src/components/molecules/AddressWithVisitDetail';
import { ReviewForm } from '@homzhub/mobile/src/components/molecules/ReviewForm';
import {
  AssetVisit,
  IVisitActions,
  IVisitByKey,
  RoleType,
  VisitActions,
} from '@homzhub/common/src/domain/models/AssetVisit';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { IVisitActionParam, VisitStatus } from '@homzhub/common/src/domain/repositories/interfaces';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

// CONSTANTS
const confirmation = ['Yes', 'No'];
// END CONSTANTS

type NavigationType =
  | StackNavigationProp<MoreStackNavigatorParamList, ScreensKeys.PropertyVisits>
  | StackNavigationProp<PortfolioNavigatorParamList, ScreensKeys.PropertyDetailScreen>;

interface IProps {
  visitType?: Tabs;
  visitData: IVisitByKey[];
  dropdownData?: PickerItemProps[];
  isLoading?: boolean;
  isFromProperty?: boolean;
  dropdownValue?: number;
  isUserView?: boolean;
  handleAction: (param: IVisitActionParam) => void;
  handleUserView?: (id: number) => void;
  handleConfirmation?: (param: IVisitActionParam) => void;
  handleReschedule: (asset: AssetVisit, userId?: number) => void;
  handleDropdown?: (value: string | number, visitType: Tabs) => void;
  containerStyle?: StyleProp<ViewStyle>;
  pillars?: Pillar[];
  resetData?: () => void;
  reviewVisitId?: number;
  isResponsiveHeightRequired?: boolean;
  navigation?: NavigationType;
}

interface IScreenState {
  isCancelSheet: boolean;
  showReviewForm: boolean;
  showDeleteForm: boolean;
  reviewAsset: AssetVisit | null;
  currentVisitId: number;
  height: number;
  replyReview: boolean;
  reviewData: AssetReview | null;
}

type Props = IProps & WithTranslation;

class PropertyVisitList extends PureComponent<Props, IScreenState> {
  public state = {
    isCancelSheet: false,
    showReviewForm: false,
    showDeleteForm: false,
    reviewAsset: null,
    currentVisitId: 0,
    height: theme.viewport.height,
    replyReview: false,
    reviewData: null,
  };

  public componentDidMount = (): void => {
    this.openReviewForm();
  };

  public componentDidUpdate = (prevProps: Props): void => {
    const { visitData } = this.props;

    if (prevProps.visitData.length <= 0 && visitData.length > 0) {
      this.openReviewForm();
    }
  };

  public render(): React.ReactNode {
    const {
      visitData,
      isLoading,
      t,
      dropdownData,
      dropdownValue,
      visitType,
      handleDropdown,
      isUserView,
      containerStyle,
      isResponsiveHeightRequired = true,
    } = this.props;

    const { height } = this.state;

    const totalVisit = visitData[0] ? visitData[0].totalVisits : 0;

    return (
      <View onLayout={this.onLayout} style={[styles.mainView, containerStyle]}>
        {dropdownData && handleDropdown && visitType && (
          <View style={styles.headerView}>
            <Label type="regular" style={styles.count}>
              {t('totalVisit', { totalVisit })}
            </Label>
            <Dropdown
              isOutline
              data={dropdownData}
              value={dropdownValue ?? ''}
              icon={icons.downArrow}
              textStyle={{ color: theme.colors.blue }}
              iconColor={theme.colors.blue}
              onDonePress={(value: string | number): void => handleDropdown(value, visitType)}
              containerStyle={styles.dropdownStyle}
            />
          </View>
        )}
        {visitData.length > 0 ? (
          <ScrollView
            style={isResponsiveHeightRequired ? { minHeight: height } : {}}
            showsVerticalScrollIndicator={false}
          >
            {visitData.map((item) => {
              const results = item.results as AssetVisit[];
              return (
                <>
                  {!isUserView && results.length > 0 && (
                    <View style={styles.dateView}>
                      <View style={styles.dividerView} />
                      <Text type="small" style={styles.horizontalStyle}>
                        {item.key}
                      </Text>
                      <View style={styles.dividerView} />
                    </View>
                  )}
                  {results.map((asset: AssetVisit) => {
                    return this.renderItem(asset);
                  })}
                </>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.emptyView}>
            <EmptyState icon={icons.schedule} title={t('noVisits')} />
          </View>
        )}
        <Loader visible={isLoading ?? false} />
        {this.renderCancelConfirmation()}
        {this.renderReviewForm()}
        {this.deleteForm()}
        {this.replyReviewForm()}
      </View>
    );
  }

  private renderItem = (item: AssetVisit): React.ReactElement => {
    const {
      asset,
      user,
      actions,
      startDate,
      endDate,
      id,
      role,
      createdAt,
      comments,
      isAssetOwner,
      status,
      updatedAt,
      leaseListing,
      saleListing,
      isValidVisit,
    } = item;

    const { visitType, handleReschedule, isUserView, handleUserView } = this.props;
    const visitStatus = visitType ?? this.getUserVisitStatus(startDate, status);
    const isMissed = visitStatus === Tabs.MISSED;
    const isCompleted = visitStatus === Tabs.COMPLETED;
    const listingId = saleListing === 0 || !saleListing ? leaseListing : saleListing;
    const userRole = this.getUserRole(role);

    const containerStyle = [styles.container, actions.length > 1 && styles.newVisit];

    const onReschedule = (): void => handleReschedule(item, user.id);
    const onPressIcon = (): void => handleUserView && handleUserView(user.id);
    const onNavigation = (): void => this.navigateToAssetDetails(listingId, asset.id, isValidVisit);
    return (
      <View style={styles.mainContainer} key={id}>
        <View style={containerStyle}>
          {!isUserView && (
            <Avatar
              fullName={user.name}
              isRightIcon
              onPressRightIcon={onPressIcon}
              designation={userRole}
              date={updatedAt ?? createdAt}
              image={user.profilePicture}
              containerStyle={styles.avatar}
            />
          )}
          <AddressWithVisitDetail
            primaryAddress={asset.projectName}
            subAddress={asset.address}
            startDate={startDate}
            isPropertyOwner={isAssetOwner}
            endDate={endDate}
            comments={comments}
            isMissedVisit={isMissed}
            isCompletedVisit={isCompleted}
            onPressSchedule={onReschedule}
            containerStyle={styles.horizontalStyle}
            navigateToAssetDetails={onNavigation}
          />
          {visitStatus === Tabs.UPCOMING && this.renderUpcomingView(item)}
          {visitStatus === Tabs.COMPLETED && this.renderCompletedButtons(item)}
        </View>
      </View>
    );
  };

  private renderUpcomingView = (item: AssetVisit): React.ReactElement => {
    const { actions, status, id, isValidVisit } = item;
    const visitStatus = this.getVisitStatus(status);
    const isSmallerView = (visitStatus?.title?.length ?? 0) > 16 && theme.viewport.width < 350;

    return (
      <>
        <Divider containerStyles={styles.dividerStyle} />
        <View style={isSmallerView ? styles.buttonSmallerView : styles.buttonView}>
          {actions.length < 2 && (
            <Button
              type="secondary"
              icon={visitStatus?.icon}
              iconColor={visitStatus?.color}
              iconSize={20}
              title={visitStatus?.title}
              containerStyle={styles.statusView}
              titleStyle={[styles.statusTitle, { color: visitStatus?.color }]}
            />
          )}
          {actions.map((action: string, index: number): React.ReactElement | null => {
            const actionData = this.getActions(action, isValidVisit);
            if (!actionData) return null;
            const onPressButton = (): void => actionData.action && actionData.action(id);
            return (
              <Button
                key={index}
                type="secondary"
                icon={actionData.icon}
                iconColor={actionData.color}
                iconSize={20}
                onPress={onPressButton}
                title={actionData.title}
                containerStyle={[styles.statusView, isSmallerView && styles.smallStatusView]}
                titleStyle={[styles.actionTitle, { color: actionData.color }]}
              />
            );
          })}
        </View>
      </>
    );
  };

  private renderCompletedButtons = (item: AssetVisit): React.ReactNode => {
    const { t } = this.props;
    const { review, isAssetOwner } = item;
    if (isAssetOwner && !review) return null;
    const onPress = (): void => {
      if (isAssetOwner) {
        this.setState({ replyReview: true });
        this.getReview(review.id);
      } else {
        this.setState({ reviewAsset: item, showReviewForm: true });
      }
    };

    return (
      <>
        <Divider containerStyles={styles.dividerStyle} />
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={[styles.buttonContainer, { flexDirection: !item.review ? 'row' : 'column' }]}>
          {!item.review ? (
            <TouchableOpacity style={styles.writeReviewButton} onPress={onPress}>
              <Label textType="semiBold" type="regular" style={styles.writeReviewText}>
                {t('writeReview')}
              </Label>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.writeReviewButton} onPress={onPress}>
              <Rating isOverallRating value={item.review.rating ?? 0} />
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  };

  private renderCancelConfirmation = (): React.ReactElement => {
    const { isCancelSheet } = this.state;
    const { t } = this.props;
    return (
      <BottomSheet visible={isCancelSheet} headerTitle={t('cancelVisit')} onCloseSheet={this.onCancelSheet}>
        <View style={styles.sheetContent}>
          <Text type="small" style={{ color: theme.colors.darkTint1 }}>
            {t('wantCancelVisit')}
          </Text>
          <View style={styles.sheetButtonView}>
            {confirmation.map((item, index) => {
              return (
                <Button
                  type="secondary"
                  key={index}
                  title={item}
                  onPress={(): void => this.onPressConfirmation(item)}
                  containerStyle={styles.confirmationContainer}
                  titleStyle={styles.confirmationTitle}
                />
              );
            })}
          </View>
        </View>
      </BottomSheet>
    );
  };

  private renderReviewForm = (): React.ReactNode => {
    const { showReviewForm, reviewAsset } = this.state;
    const { t, pillars } = this.props;

    if (reviewAsset === null) return null;
    const { asset, leaseListing, saleListing } = (reviewAsset as unknown) as AssetVisit;
    return (
      <BottomSheet
        visible={showReviewForm}
        sheetHeight={theme.viewport.height * 0.85}
        headerTitle={t('propertyReview')}
        onCloseSheet={this.onCancelReview}
      >
        <ReviewForm
          deleted={this.delete}
          onClose={this.onCancelReview}
          asset={asset}
          ratingCategories={pillars ?? []}
          leaseListingId={leaseListing}
          saleListingId={saleListing}
        />
      </BottomSheet>
    );
  };

  private onPressConfirmation = (item: string): void => {
    const { handleAction } = this.props;
    const { currentVisitId } = this.state;
    if (item === 'Yes') {
      handleAction({
        id: currentVisitId,
        action: VisitActions.CANCEL,
      });
    }
    this.onCancelSheet();
  };

  private onCancelSheet = (): void => {
    this.setState({
      isCancelSheet: false,
    });
  };

  private onCancelReviewReply = (): void => {
    this.setState({
      replyReview: false,
    });
  };

  private onCancelReview = (reset = false): void => {
    const { resetData } = this.props;
    this.setState(
      {
        showReviewForm: false,
      },
      () => {
        if (!reset || !resetData) return;
        resetData();
      }
    );
  };

  private onLayout = (e: LayoutChangeEvent): void => {
    const { height } = this.state;
    const { height: newHeight } = e.nativeEvent.layout;
    if (newHeight === height) {
      this.setState({ height: newHeight });
    }
  };

  public navigateToAssetDetails = (listingId: number | null, id: number, isValidVisit: boolean): void => {
    const { navigation, t } = this.props;
    if (isValidVisit && navigation) {
      // @ts-ignore
      navigation.navigate(ScreensKeys.BottomTabs, {
        screen: ScreensKeys.Search,
        params: {
          screen: ScreensKeys.PropertyAssetDescription,
          initial: false,
          params: {
            propertyTermId: listingId,
            propertyId: id,
          },
        },
      });
    } else {
      AlertHelper.error({ message: t('property:inValidVisit') });
    }
  };

  private replyReviewForm = (): React.ReactNode => {
    const { replyReview, reviewData } = this.state;
    const { t } = this.props;
    if (!reviewData) return null;
    return (
      <BottomSheet
        visible={replyReview}
        sheetHeight={theme.viewport.height * 0.65}
        headerTitle={t('propertyReview')}
        onCloseSheet={this.onCancelReviewReply}
      >
        <ScrollView>
          <AssetReviewCard
            hideShowMore
            key={reviewData.id}
            review={reviewData}
            reportCategories={reviewData.pillarRatings}
          />
        </ScrollView>
      </BottomSheet>
    );
  };

  private delete = (): void => {
    const { showDeleteForm } = this.state;
    this.setState({ showDeleteForm: !showDeleteForm });
  };

  private closeBottomSheet = (): void => {
    const { showDeleteForm, showReviewForm } = this.state;
    this.setState({ showDeleteForm: !showDeleteForm, showReviewForm: !showReviewForm });
  };

  private deleteForm = (): React.ReactElement => {
    const { showDeleteForm } = this.state;
    const { t } = this.props;
    return (
      <BottomSheet
        visible={showDeleteForm}
        headerTitle={t('common:deleteReview')}
        onCloseSheet={this.onCancelSheet}
        sheetHeight={theme.viewport.height * 0.4}
      >
        <View style={styles.deleteView}>
          <Text type="small">{t('common:deleteReviewText')}</Text>

          <View style={styles.deleteViewText}>
            <Text type="small">{t('common:doYouWantToRemove')}</Text>
          </View>

          <View style={styles.buttonContaine}>
            <Button
              onPress={this.closeBottomSheet}
              type="secondary"
              title={t('common:no')}
              titleStyle={styles.buttonTitle}
            />
            <Button onPress={this.delete} type="primary" title={t('common:yes')} containerStyle={styles.submitButton} />
          </View>
        </View>
      </BottomSheet>
    );
  };

  private getActions = (action: string, isValidVisit: boolean): IVisitActions | null => {
    const { handleAction, t, handleConfirmation } = this.props;
    const { APPROVE, REJECT, CANCEL } = VisitActions;
    switch (action) {
      case APPROVE:
        return {
          title: t('common:accept'),
          color: theme.colors.green,
          icon: icons.circularCheckFilled,
          action: (id): void =>
            handleAction({
              id,
              action: VisitActions.APPROVE,
              isValidVisit,
            }),
        };
      case REJECT:
        return {
          title: t('common:reject'),
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
          action: (id): void =>
            handleAction({
              id,
              action: VisitActions.REJECT,
              isValidVisit,
            }),
        };
      case CANCEL:
        return {
          title: t('common:cancel'),
          color: theme.colors.error,
          action: (id): void =>
            handleConfirmation ? handleConfirmation({ id, isValidVisit }) : this.handleVisitCancel(id, isValidVisit),
        };
      default:
        return null;
    }
  };

  private getVisitStatus = (status: string): IVisitActions | null => {
    const { t } = this.props;
    switch (status) {
      case VisitStatus.ACCEPTED:
        return {
          title: t('visitScheduled'),
          color: theme.colors.green,
          icon: icons.circularCheckFilled,
        };
      case VisitStatus.REJECTED:
        return {
          title: t('visitDeclined'),
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
        };
      case VisitStatus.CANCELLED:
        return {
          title: t('visitCancelled'),
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
        };
      case VisitStatus.PENDING:
        return {
          title: t('awaiting'),
          color: theme.colors.darkTint3,
          icon: icons.watch,
        };
      default:
        return null;
    }
  };

  private getUserVisitStatus = (startDate: string, status: string): Tabs => {
    const formattedDate = DateUtils.getDisplayDate(startDate, DateFormats.ISO24Format);
    const currentDate = DateUtils.getDisplayDate(new Date().toISOString(), DateFormats.ISO24Format);
    const dateDiff = DateUtils.getDateDiff(formattedDate, currentDate);
    if (dateDiff > 0) {
      return Tabs.UPCOMING;
    }
    if (dateDiff < 0 && status === VisitStatus.PENDING) {
      return Tabs.MISSED;
    }
    return Tabs.COMPLETED;
  };

  private getUserRole = (role: RoleType): string => {
    const { t } = this.props;
    switch (role) {
      case RoleType.PROPERTY_AGENT:
        return t('propertyAgent');
      case RoleType.BUYER:
        return t('buyer');
      case RoleType.TENANT:
        return t('tenant');
      case RoleType.OWNER:
        return t('owner');
      default:
        return role;
    }
  };

  private handleVisitCancel = (id: number, isValidVisit: boolean): void => {
    const { t } = this.props;
    if (!isValidVisit) {
      AlertHelper.error({ message: t('property:inValidVisit') });
      return;
    }

    this.setState({
      isCancelSheet: true,
      currentVisitId: id,
    });
  };

  private getReview = (id: number): void => {
    try {
      AssetRepository.getReview(id).then((response) => {
        this.setState({ reviewData: response });
      });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private openReviewForm = (): void => {
    const { reviewVisitId, visitData } = this.props;

    if (!reviewVisitId || visitData.length <= 0) return;

    const visits: any[] = [];
    visitData.forEach((date) => visits.push(...date.results));
    const visitToReview = visits.find((item: AssetVisit) => item.id === reviewVisitId);

    if (!visitToReview || visitToReview.review) return;

    setTimeout(() => {
      this.setState({ reviewAsset: visitToReview, showReviewForm: true });
    }, 500);
  };
}

export default withTranslation(LocaleConstants.namespacesKey.property)(PropertyVisitList);

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  mainView: {
    marginBottom: 75,
  },
  container: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 16,
    borderColor: theme.colors.darkTint10,
  },
  newVisit: {
    borderWidth: 0,
    backgroundColor: theme.colors.moreSeparator,
  },
  dividerStyle: {
    backgroundColor: theme.colors.background,
    marginVertical: 16,
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  buttonSmallerView: {
    alignItems: 'flex-start',
    marginHorizontal: 16,
  },
  statusView: {
    borderWidth: 0,
    flex: 0,
    flexDirection: 'row-reverse',
    backgroundColor: theme.colors.transparent,
  },
  statusTitle: {
    marginVertical: 0,
    marginHorizontal: 6,
  },
  actionTitle: {
    marginVertical: 0,
    marginHorizontal: 16,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  count: {
    color: theme.colors.darkTint6,
  },
  dropdownStyle: {
    width: 140,
  },
  dividerView: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    width: 100,
  },
  horizontalStyle: {
    marginHorizontal: 16,
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sheetContent: {
    alignSelf: 'center',
  },
  sheetButtonView: {
    flexDirection: 'row',
    marginTop: 24,
  },
  confirmationContainer: {
    marginHorizontal: 6,
  },
  confirmationTitle: {
    marginVertical: 0,
    paddingVertical: 8,
  },
  emptyView: {
    marginBottom: 20,
  },
  avatar: {
    paddingHorizontal: 10,
  },
  smallStatusView: {
    marginRight: 10,
    marginTop: 4,
  },
  writeReviewButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.lightGrayishBlue,
  },
  writeReviewText: {
    color: theme.colors.primaryColor,
  },
  buttonContainer: {
    marginHorizontal: 12,
  },

  buttonContaine: {
    marginTop: 16,
    flexDirection: 'row',
    marginBottom: 12,
  },
  submitButton: {
    marginStart: 16,
  },
  buttonTitle: {
    marginHorizontal: 0,
  },
  deleteView: {
    margin: 10,
  },
  deleteViewText: {
    marginVertical: 10,
  },
});
