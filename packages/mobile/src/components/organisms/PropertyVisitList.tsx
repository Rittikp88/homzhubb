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
import { withTranslation, WithTranslation } from 'react-i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Rating } from '@homzhub/common/src/components/atoms/Rating';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { Loader } from '@homzhub/mobile/src/components';
import { AddressWithVisitDetail } from '@homzhub/mobile/src/components/molecules/AddressWithVisitDetail';
import { ReviewForm } from '@homzhub/mobile/src/components/molecules/ReviewForm';
import {
  AssetVisit,
  IVisitActions,
  IVisitByKey,
  RoleType,
  VisitActions,
  VisitStatusType,
} from '@homzhub/common/src/domain/models/AssetVisit';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { VisitStatus } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

// CONSTANTS
const confirmation = ['Yes', 'No'];

// END CONSTANTS

interface IProps {
  visitType?: VisitStatusType;
  visitData: IVisitByKey[];
  dropdownData?: PickerItemProps[];
  isLoading?: boolean;
  isFromProperty?: boolean;
  dropdownValue?: number;
  isUserView?: boolean;
  handleAction: (id: number, action: VisitActions) => void;
  handleUserView?: (id: number) => void;
  handleConfirmation?: (id: number) => void;
  handleReschedule: (id: number, userId?: number) => void;
  handleDropdown?: (value: string | number, visitType: VisitStatusType) => void;
  containerStyle?: StyleProp<ViewStyle>;
  pillars?: Pillar[];
  resetData?: () => void;
  reviewVisitId?: number;
}

interface IScreenState {
  isCancelSheet: boolean;
  showReviewForm: boolean;
  reviewAsset: AssetVisit | null;
  currentVisitId: number;
  height: number;
}

type Props = IProps & WithTranslation;

class PropertyVisitList extends PureComponent<Props, IScreenState> {
  public state = {
    isCancelSheet: false,
    showReviewForm: false,
    reviewAsset: null,
    currentVisitId: 0,
    height: theme.viewport.height,
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
              onDonePress={(value): void => handleDropdown(value, visitType)}
              containerStyle={styles.dropdownStyle}
            />
          </View>
        )}
        {visitData.length > 0 ? (
          <ScrollView style={{ minHeight: height }} showsVerticalScrollIndicator={false}>
            {visitData.map((item) => {
              const results = item.results as AssetVisit[];
              return (
                <>
                  {!isUserView && (
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
    } = item;
    const { visitType, handleReschedule, isUserView, handleUserView } = this.props;
    const visitStatus = visitType ?? this.getUserVisitStatus(startDate, status);
    const isMissed = visitStatus === VisitStatusType.MISSED;
    const isCompleted = visitStatus === VisitStatusType.COMPLETED;

    const userRole = this.getUserRole(role);

    const containerStyle = [styles.container, actions.length > 1 && styles.newVisit];

    const onReschedule = (): void => handleReschedule(id, user.id);
    const onPressIcon = (): void => handleUserView && handleUserView(user.id);

    return (
      <View style={styles.mainContainer} key={id}>
        <View style={containerStyle}>
          {!isUserView && (
            <Avatar
              fullName={user.fullName}
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
          />
          {visitStatus === VisitStatusType.UPCOMING && this.renderUpcomingView(item)}
          {visitStatus === VisitStatusType.COMPLETED && this.renderCompletedButtons(item)}
        </View>
      </View>
    );
  };

  private renderUpcomingView = (item: AssetVisit): React.ReactElement => {
    const { actions, status, id } = item;
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
            const actionData = this.getActions(action);
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
    const onPress = (): void => {
      this.setState({ reviewAsset: item, showReviewForm: true });
    };
    const { review, isAssetOwner } = item;

    if (isAssetOwner && !review) return null;

    return (
      <>
        <Divider containerStyles={styles.dividerStyle} />
        <View style={[styles.buttonContainer, { flexDirection: !item.review ? 'row' : 'column' }]}>
          {!item.review ? (
            <TouchableOpacity style={styles.writeReviewButton} onPress={onPress}>
              <Label textType="semiBold" type="regular" style={styles.writeReviewText}>
                {t('writeReview')}
              </Label>
            </TouchableOpacity>
          ) : (
            <Rating isOverallRating value={item.review.rating} />
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
      handleAction(currentVisitId, VisitActions.CANCEL);
    }
    this.onCancelSheet();
  };

  private onCancelSheet = (): void => {
    this.setState({
      isCancelSheet: false,
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

  private getActions = (action: string): IVisitActions | null => {
    const { handleAction, t, handleConfirmation } = this.props;
    const { APPROVE, REJECT, CANCEL } = VisitActions;
    switch (action) {
      case APPROVE:
        return {
          title: t('common:accept'),
          color: theme.colors.green,
          icon: icons.circularCheckFilled,
          action: (id): void => handleAction(id, VisitActions.APPROVE),
        };
      case REJECT:
        return {
          title: t('common:reject'),
          color: theme.colors.error,
          icon: icons.circularCrossFilled,
          action: (id): void => handleAction(id, VisitActions.REJECT),
        };
      case CANCEL:
        return {
          title: t('common:cancel'),
          color: theme.colors.error,
          action: (id): void => (handleConfirmation ? handleConfirmation(id) : this.handleVisitCancel(id)),
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

  private getUserVisitStatus = (startDate: string, status: string): VisitStatusType => {
    const formattedDate = DateUtils.getDisplayDate(startDate, DateFormats.ISO24Format);
    const currentDate = DateUtils.getDisplayDate(new Date().toISOString(), DateFormats.ISO24Format);
    const dateDiff = DateUtils.getDateDiff(formattedDate, currentDate);
    if (dateDiff > 0) {
      return VisitStatusType.UPCOMING;
    }
    if (dateDiff < 0 && status === VisitStatus.PENDING) {
      return VisitStatusType.MISSED;
    }
    return VisitStatusType.COMPLETED;
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

  private handleVisitCancel = (id: number): void => {
    this.setState({
      isCancelSheet: true,
      currentVisitId: id,
    });
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
});
