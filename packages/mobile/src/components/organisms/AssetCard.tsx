import React, { Component } from 'react';
import { Image, StyleProp, StyleSheet, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { OffersVisitsSection, OffersVisitsType } from '@homzhub/common/src/components/molecules/OffersVisitsSection';
import { LeaseProgress } from '@homzhub/mobile/src/components/molecules/LeaseProgress';
import { RentAndMaintenance } from '@homzhub/common/src/components/molecules/RentAndMaintenance';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { EditTenantDetails } from '@homzhub/mobile/src/components/molecules/EditTenantDetails';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { User } from '@homzhub/common/src/domain/models/User';
import { IGetHistoryPayload, ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Tabs } from '@homzhub/common/src/constants/Tabs';
import {
  ClosureReasonType,
  IClosureReasonPayload,
  IListingParam,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { ActionType } from '@homzhub/common/src/domain/models/AssetStatusInfo';
import { TenantInfo } from '@homzhub/common/src/domain/models/TenantInfo';

interface IUserInfo {
  name: string;
  icon?: string;
  image?: string;
  designation: string;
  designationStyle?: TextStyle;
}

interface IListProps {
  assetData: Asset;
  expandedId?: number;
  isDetailView?: boolean;
  isFromTenancies?: boolean;
  customDesignation?: string;
  onPressArrow?: (id: number) => void;
  onCompleteDetails: (id: number) => void;
  onOfferVisitPress: (type: OffersVisitsType) => void;
  containerStyle?: StyleProp<ViewStyle>;
  enterFullScreen?: (attachments: Attachment[]) => void;
  onViewProperty?: (data: ISetAssetPayload, key?: Tabs) => void;
  onHandleAction?: (payload: IClosureReasonPayload, param?: IListingParam) => void;
}

interface IState {
  isOwnerSheetVisible: boolean;
  isBottomSheetVisible: boolean;
  listOfTenant: number;
}

type Props = WithTranslation & IListProps;
export class AssetCard extends Component<Props, IState> {
  public state = {
    isBottomSheetVisible: false,
    isOwnerSheetVisible: false,
    listOfTenant: 0,
  };

  public render(): React.ReactElement {
    const { assetData, isDetailView, onViewProperty, onPressArrow, expandedId = 0, containerStyle } = this.props;
    const {
      id,
      unitNumber,
      blockNumber,
      notifications,
      serviceTickets,
      attachments,
      assetStatusInfo,
      address,
      formattedProjectName,
      country: { flag },
    } = assetData;
    let detailPayload: ISetAssetPayload;
    if (assetStatusInfo) {
      detailPayload = PropertyUtils.getAssetPayload(assetStatusInfo, id);
    }

    const handlePropertyView = (key?: Tabs): void => onViewProperty && onViewProperty(detailPayload, key);
    const handleArrowPress = (): void => onPressArrow && onPressArrow(id);
    const isExpanded: boolean = expandedId === id;
    return (
      <View style={styles.mainContainer}>
        <View style={[styles.container, containerStyle]}>
          {!isDetailView && (
            <View style={styles.topView}>
              <View style={styles.topLeftView}>
                <Badge
                  title={assetStatusInfo?.tag.label ?? ''}
                  badgeColor={assetStatusInfo?.tag.color ?? ''}
                  badgeStyle={styles.badgeStyle}
                />
                <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={8} style={styles.dotStyle} />
                <TouchableOpacity
                  style={styles.topLeftView}
                  onPress={(): void => handlePropertyView(Tabs.NOTIFICATIONS)}
                >
                  <Icon name={icons.bell} color={theme.colors.blue} size={18} style={styles.iconStyle} />
                  <Label type="large" style={styles.count}>
                    {notifications?.count}
                  </Label>
                </TouchableOpacity>
                <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={8} style={styles.dotStyle} />
                <TouchableOpacity style={styles.topLeftView} onPress={(): void => handlePropertyView(Tabs.TICKETS)}>
                  <Icon name={icons.headPhone} color={theme.colors.blue} size={18} style={styles.iconStyle} />
                  <Label type="large" style={styles.count}>
                    {serviceTickets?.count}
                  </Label>
                </TouchableOpacity>
              </View>
              <Icon
                name={isExpanded ? icons.upArrow : icons.downArrow}
                color={theme.colors.blue}
                size={20}
                onPress={handleArrowPress}
                testID="collapseIcon"
              />
            </View>
          )}
          <TouchableOpacity onPress={(): void => handlePropertyView()} activeOpacity={isDetailView ? 1 : 0.3}>
            <>
              {(isExpanded || isDetailView) && this.renderAttachmentView(attachments, handlePropertyView)}
              {isDetailView && (
                <Badge
                  title={assetStatusInfo?.tag.label ?? ''}
                  badgeColor={assetStatusInfo?.tag.color ?? ''}
                  badgeStyle={[styles.badgeStyle, styles.detailViewBadge]}
                />
              )}
              <PropertyAddressCountry
                primaryAddress={formattedProjectName}
                countryFlag={flag}
                subAddress={address ?? `${unitNumber} ${blockNumber}`}
                containerStyle={styles.addressStyle}
              />
            </>
          </TouchableOpacity>
          {(isExpanded || isDetailView) && this.renderExpandedView()}
        </View>
      </View>
    );
  }

  private renderAttachmentView = (attachments: Attachment[], handlePropertyView: () => void): React.ReactNode => {
    const { isDetailView, enterFullScreen } = this.props;
    const item = attachments[0];
    const handleFullScreen = (): void => enterFullScreen && enterFullScreen(attachments);

    if (!item) return <ImagePlaceholder containerStyle={styles.placeholderImage} />;

    const {
      mediaAttributes: { thumbnailBest, thumbnailHD, thumbnail },
      link,
      mediaType,
    } = item;

    return (
      <TouchableOpacity onPress={isDetailView ? handleFullScreen : (): void => handlePropertyView()}>
        {mediaType === 'IMAGE' && (
          <Image
            source={{
              uri: link,
            }}
            style={[styles.image, isDetailView && styles.detailViewImage]}
          />
        )}
        {mediaType === 'VIDEO' && (
          <>
            <Image
              source={{
                uri: thumbnailBest ?? thumbnailHD ?? thumbnail,
              }}
              style={[styles.image, isDetailView && styles.detailViewImage]}
            />
          </>
        )}
      </TouchableOpacity>
    );
  };

  public renderBottomSheet = (): React.ReactNode => {
    const { isBottomSheetVisible, listOfTenant } = this.state;
    const { t, assetData } = this.props;
    if (!assetData || !assetData.assetStatusInfo) return null;
    const {
      id,
      assetStatusInfo: { leaseTenantInfo, leaseTransaction, action },
    } = assetData;
    const isActive = action ? action.label === 'TERMINATE' : false;
    return (
      <BottomSheet
        visible={isBottomSheetVisible}
        sheetHeight={theme.viewport.height * 0.7}
        headerTitle={t('common:editInvite')}
        onCloseSheet={this.onCloseBottomSheet}
      >
        <ScrollView>
          <EditTenantDetails
            onHandleActionProp={this.onPressAction}
            numberOfTenants={listOfTenant}
            details={leaseTenantInfo.user}
            assetId={id}
            isActive={isActive}
            endDate={leaseTransaction?.leaseEndDate ?? ''}
            leaseTransaction={leaseTransaction.id}
            leaseTenantId={leaseTenantInfo.leaseTenantId}
            onCloseSheet={this.onCloseBottomSheet}
          />
        </ScrollView>
      </BottomSheet>
    );
  };

  public renderOwnerSheet = (): React.ReactNode => {
    const { isOwnerSheetVisible } = this.state;
    const { t, assetData, isFromTenancies = false } = this.props;
    if (!assetData || !assetData.assetStatusInfo) return null;
    const {
      assetStatusInfo: {
        leaseOwnerInfo: { name, profilePicture },
        leaseTenantInfo: { user },
      },
    } = assetData;
    const showName = isFromTenancies ? name : user.name;
    const image = isFromTenancies ? profilePicture : user.profilePicture;
    const title = isFromTenancies ? t('common:ownerInfo') : t('common:tenantInfo');
    return (
      <BottomSheet
        visible={isOwnerSheetVisible}
        sheetHeight={theme.viewport.height * 0.5}
        headerTitle={title}
        onCloseSheet={this.onCloseBottomSheet}
      >
        <ScrollView>
          <View style={styles.ownerView}>
            <Avatar fullName={showName} isOnlyAvatar imageSize={72} image={image} />
            <Text type="regular" style={styles.name}>
              {showName}
            </Text>
          </View>
        </ScrollView>
      </BottomSheet>
    );
  };

  private renderExpandedView = (): React.ReactNode => {
    const { assetData, t, onOfferVisitPress, isDetailView, isFromTenancies = false } = this.props;
    if (!assetData || !assetData.assetStatusInfo) return null;
    const {
      assetStatusInfo: {
        action,
        tag: { label },
        leaseTenantInfo: { user, isInviteAccepted },
        leaseListingId,
        saleListingId,
        leaseOwnerInfo,
        leaseTransaction: { rent, securityDeposit, totalSpendPeriod, leaseEndDate, leaseStartDate, currency },
      },
      listingVisits: { upcomingVisits, missedVisits, completedVisits },
      lastVisitedStep: { assetCreation },
      isVerificationDocumentUploaded,
      spaces,
      listingOffers: { totalOffers, activeOffers, pendingOffers },
    } = assetData;
    const isListed = (leaseListingId || saleListingId) && label !== Filters.OCCUPIED;
    const userData: User = isFromTenancies ? leaseOwnerInfo : user;
    const userInfo = this.getFormattedInfo(userData, isInviteAccepted);
    const isVacant = label === Filters.VACANT || label === Filters.FOR__RENT || label === Filters.FOR__SALE;
    const progress = totalSpendPeriod >= 0 ? totalSpendPeriod : assetCreation.percentage / 100;
    return (
      <>
        {!!userData.fullName && (
          <>
            <Divider containerStyles={styles.divider} />
            <Avatar
              isRightIcon
              onPressRightIcon={this.onToggleBottomSheet}
              icon={userInfo.icon}
              fullName={userInfo.name}
              image={userInfo.image}
              designation={userInfo.designation}
              customDesignation={userInfo.designationStyle}
            />
          </>
        )}
        {rent && securityDeposit && (
          <>
            <Divider containerStyles={styles.divider} />
            <RentAndMaintenance currency={currency} rentData={rent} depositData={securityDeposit} />
          </>
        )}
        {((isVacant && assetCreation.percentage < 100) || !isVacant) && (
          <>
            <Divider containerStyles={styles.divider} />
            <LeaseProgress
              progress={progress}
              fromDate={leaseStartDate}
              toDate={leaseEndDate}
              isPropertyVacant={isVacant}
              assetCreation={assetCreation}
            />
          </>
        )}
        {isVacant && assetCreation.percentage < 100 && (spaces.length < 1 || !action) && (
          <Button
            type="primary"
            textType="label"
            textSize="regular"
            fontType="semiBold"
            containerStyle={styles.buttonStyle}
            title={t('complete')}
            titleStyle={styles.buttonTitle}
            onPress={this.onCompleteDetails}
          />
        )}
        {isVerificationDocumentUploaded && isListed && (
          <OffersVisitsSection
            onNav={onOfferVisitPress}
            isDetailView={isDetailView}
            values={{
              [OffersVisitsType.offers]: [totalOffers, activeOffers, pendingOffers],
              [OffersVisitsType.visits]: [upcomingVisits, missedVisits, completedVisits],
            }}
          />
        )}
        <View style={styles.buttonGroup}>
          {spaces.length > 0 && action && (
            <Button
              type="primary"
              textType="label"
              textSize="regular"
              fontType="semiBold"
              containerStyle={[
                styles.buttonStyle,
                { backgroundColor: action.color },
                action.label === ActionType.CANCEL && styles.cancelButton,
              ]}
              title={action.label}
              titleStyle={[styles.buttonTitle, action.label === ActionType.CANCEL && styles.cancelTitle]}
              onPress={this.onPressAction}
            />
          )}
        </View>
        {this.renderBottomSheet()}
        {this.renderOwnerSheet()}
      </>
    );
  };

  public onCloseBottomSheet = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };

  public onToggleBottomSheet = (): void => {
    const { isBottomSheetVisible, isOwnerSheetVisible } = this.state;
    const { assetData, isFromTenancies = false } = this.props;
    if (!assetData || !assetData.assetStatusInfo) return;
    const {
      assetStatusInfo: {
        leaseTenantInfo: { isInviteAccepted },
      },
    } = assetData;

    if (isFromTenancies || isInviteAccepted) {
      this.setState({ isOwnerSheetVisible: !isOwnerSheetVisible });
    } else if (!isInviteAccepted) {
      this.setState({ isBottomSheetVisible: !isBottomSheetVisible });
      if (!isBottomSheetVisible) {
        this.activeTenantList().then();
      }
    }
  };

  private onCompleteDetails = (): void => {
    const { onCompleteDetails, assetData } = this.props;
    onCompleteDetails(assetData.id);
  };

  private onPressAction = (): void => {
    const {
      onHandleAction,
      assetData: { assetGroup, country, assetStatusInfo },
    } = this.props;
    const { LEASE_LISTING_CANCELLATION, SALE_LISTING_CANCELLATION, LEASE_TRANSACTION_TERMINATION } = ClosureReasonType;
    if (assetStatusInfo) {
      const {
        action,
        leaseListingId,
        leaseTransaction: { id, leaseEndDate },
      } = assetStatusInfo;
      const type =
        action?.label === ActionType.CANCEL
          ? leaseListingId
            ? LEASE_LISTING_CANCELLATION
            : SALE_LISTING_CANCELLATION
          : LEASE_TRANSACTION_TERMINATION;
      const payload = {
        type,
        asset_group: assetGroup.id,
        asset_country: country.id,
      };
      if (onHandleAction) {
        onHandleAction(payload, {
          id,
          endDate: leaseEndDate,
          hasTakeAction: action?.label === ActionType.NEXT,
        });
      }
    }
  };

  private getFormattedInfo = (user: User, isInviteAccepted: boolean): IUserInfo => {
    const { t, isFromTenancies = false } = this.props;
    let icon = isInviteAccepted ? undefined : icons.circularCheckFilled;
    let name = isInviteAccepted ? user.name : user.email;
    let image = isInviteAccepted ? user.profilePicture : undefined;
    let designation = isInviteAccepted ? t('property:tenant') : t('common:invitationSent');
    let designationStyle = isInviteAccepted ? undefined : styles.designation;

    if (isFromTenancies) {
      icon = undefined;
      name = user.name;
      image = user.profilePicture;
      designation = t('property:owner');
      designationStyle = undefined;
    }

    return {
      name,
      designation,
      icon,
      image,
      designationStyle,
    };
  };

  public activeTenantList = async (): Promise<void> => {
    const {
      assetData: { id, assetStatusInfo },
    } = this.props;

    if (!assetStatusInfo) return;

    const { leaseTransaction } = assetStatusInfo;

    const data: IGetHistoryPayload = {
      lease_transaction_id: leaseTransaction.id,
      active: true,
    };
    try {
      const tenants: TenantInfo[] = await PortfolioRepository.getTenantHistory(id, data);
      this.setState({ listOfTenant: tenants.length });
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(AssetCard);

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 14,
  },
  container: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.white,
    borderWidth: 0.5,
    borderRadius: 4,
    padding: 16,
    marginBottom: 2,
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topLeftView: {
    flexDirection: 'row',
  },
  badgeStyle: {
    minWidth: 75,
    paddingHorizontal: 8,
    paddingVertical: 1,
    alignSelf: 'flex-start',
  },
  detailViewBadge: {
    marginTop: 12,
  },
  dotStyle: {
    marginTop: 8,
    marginHorizontal: 12,
  },
  count: {
    color: theme.colors.primaryColor,
    marginLeft: 6,
  },
  iconStyle: {
    marginTop: 2,
  },
  addressStyle: {
    marginTop: 14,
  },
  divider: {
    marginVertical: 12,
    borderColor: theme.colors.background,
    borderWidth: 1,
  },
  image: {
    marginTop: 12,
    width: '100%',
    height: 200,
  },
  detailViewImage: {
    borderRadius: 4,
    height: 130,
  },
  buttonStyle: {
    flex: 0,
    alignSelf: 'flex-end',
    borderRadius: 2,
    marginTop: 12,
    backgroundColor: theme.colors.green,
    marginLeft: 10,
  },
  buttonTitle: {
    marginVertical: 1,
    marginHorizontal: 18,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  placeholderImage: {
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.ratingLow,
  },
  cancelTitle: {
    marginVertical: 10,
    color: theme.colors.error,
  },
  designation: {
    color: theme.colors.green,
  },
  name: {
    marginVertical: 8,
  },
  ownerView: {
    alignItems: 'center',
    marginTop: 10,
  },
});
