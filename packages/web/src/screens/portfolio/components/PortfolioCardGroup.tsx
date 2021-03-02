import React, { Component } from 'react';
import { Image, StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import ProgressBar from 'components/atoms/ProgressBar';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { PropertyAmenities } from '@homzhub/common/src/components/molecules/PropertyAmenities';
import { RentAndMaintenance } from '@homzhub/common/src/components/molecules/RentAndMaintenance';
import LatestUpdates from '@homzhub/web/src/screens/dashboard/components/VacantProperties/LatestUpdates';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { OffersVisitsSection, OffersVisitsType } from '@homzhub/common/src/components/molecules/OffersVisitsSection';
import { Asset, Data } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { User } from '@homzhub/common/src/domain/models/User';
import { ActionType } from '@homzhub/common/src/domain/models/AssetStatusInfo';
import { TenantInfo } from '@homzhub/common/src/domain/models/TenantInfo';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { IGetHistoryPayload, ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import {
  ClosureReasonType,
  IClosureReasonPayload,
  IListingParam,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

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
  isBottomSheetVisible: boolean;
  listOfTenant: number;
}

type Props = WithTranslation & IListProps;
export class AssetCard extends Component<Props, IState> {
  public state = {
    isBottomSheetVisible: false,
    listOfTenant: 0,
  };

  public render(): React.ReactElement {
    const { assetData, isDetailView, onViewProperty, containerStyle } = this.props;
    const {
      id,
      projectName,
      unitNumber,
      blockNumber,
      notifications,
      serviceTickets,
      attachments,
      assetStatusInfo,
      address,
      country: { flag },
      carpetArea,
      carpetAreaUnit,
      assetGroup,
      furnishing,
      spaces,
    } = assetData;
    let detailPayload: ISetAssetPayload;
    if (assetStatusInfo) {
      detailPayload = PropertyUtils.getAssetPayload(assetStatusInfo, id);
    }
    const amenitiesData: IAmenitiesIcons[] = PropertyUtils.getAmenities(
      spaces ?? ([] as Data[]),
      furnishing,
      assetGroup.code,
      carpetArea,
      carpetAreaUnit?.title ?? '',
      true
    );
    const handlePropertyView = (key?: Tabs): void => onViewProperty && onViewProperty(detailPayload, key);
    return (
      <View style={styles.mainContainer}>
        <View style={[styles.container, containerStyle]}>
          {this.renderAttachmentView(attachments)}
          <View style={styles.topView}>
            <View style={styles.topLeftView}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
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
                <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={8} style={styles.dotStyle} />
                <TouchableOpacity style={styles.topLeftView} onPress={(): void => handlePropertyView(Tabs.TICKETS)}>
                  <Icon name={icons.ticket} color={theme.colors.blue} size={18} style={styles.iconStyle} />
                  <Label type="large" style={styles.count}>
                    {serviceTickets?.count}
                  </Label>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={(): void => handlePropertyView()} activeOpacity={isDetailView ? 1 : 0.3}>
                <View style={{ width: '100%', flexWrap: 'wrap' }}>
                  <PropertyAddressCountry
                    primaryAddress={projectName}
                    countryFlag={flag}
                    subAddress={address ?? `${unitNumber} ${blockNumber}`}
                    containerStyle={styles.addressStyle}
                    primaryAddressTextStyles={{ size: 'small' }}
                  />
                  {amenitiesData.length > 0 && (
                    <PropertyAmenities
                      data={amenitiesData}
                      direction="row"
                      containerStyle={styles.propertyInfoBox}
                      contentContainerStyle={styles.cardIcon}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {this.renderExpandedView()}
        </View>
      </View>
    );
  }

  private renderAttachmentView = (attachments: Attachment[]): React.ReactNode => {
    const { isDetailView } = this.props;
    const item = attachments[0];

    if (!item) return <ImagePlaceholder containerStyle={styles.placeholderImage} />;

    const {
      mediaAttributes: { thumbnailBest, thumbnailHD, thumbnail },
      link,
      mediaType,
    } = item;
    console.log(link, mediaType);
    return (
      <TouchableOpacity>
        {mediaType === 'IMAGE' && (
          <View style={{ width: 310, height: '100%' }}>
            <Image
              source={{
                uri: link,
              }}
              style={styles.detailViewImage}
            />
          </View>
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
    } = assetData;

    const isListed = leaseListingId || saleListingId;
    const userData: User = isFromTenancies ? leaseOwnerInfo : user;
    const userInfo = this.getFormattedInfo(userData, isInviteAccepted);
    const isVacant = label === Filters.VACANT || label === Filters.FOR__RENT || label === Filters.FOR__SALE;
    return (
      <>
        <Divider containerStyles={styles.divider} />
        <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', marginLeft: 20 }}>
          {!isVacant && (
            <>
              <Avatar
                isRightIcon={true}
                onPressRightIcon={FunctionUtils.noop}
                fullName={userData.name}
                image={userData.profilePicture}
                designation={userInfo.designation}
                customDesignation={userInfo.designationStyle}
              />
            </>
          )}

          {rent && securityDeposit && (
            <View style={{ marginTop: 24 }}>
              <RentAndMaintenance currency={currency} rentData={rent} depositData={securityDeposit} />
            </View>
          )}
          {((isVacant && assetCreation.percentage < 100) || !isVacant) && (
            <View style={{ marginTop: 24 }}>
              <ProgressBar
                progress={totalSpendPeriod || assetCreation.percentage / 100}
                isPropertyVacant={isVacant}
                fromDate={leaseStartDate}
                toDate={leaseEndDate}
              />
            </View>
          )}
          {isVacant && assetCreation.percentage < 100 && !action && (
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
                [OffersVisitsType.offers]: [0, 0, 0],
                [OffersVisitsType.visits]: [upcomingVisits, missedVisits, completedVisits],
              }}
            />
          )}
          <View style={styles.buttonGroup}>
            {action && !isVacant ? (
              <Button
                type="primary"
                textType="label"
                textSize="regular"
                fontType="semiBold"
                containerStyle={[
                  styles.buttonStyle,
                  { backgroundColor: action.color },
                  (action.label === ActionType.CANCEL || action.label === ActionType.TERMINATE) && styles.cancelButton,
                ]}
                title={action.label}
                titleStyle={[
                  styles.buttonTitle,
                  (action.label === ActionType.CANCEL || action.label === ActionType.TERMINATE) && styles.cancelTitle,
                ]}
                onPress={this.onPressAction}
              />
            ) : (
              <View style={styles.latestUpdates}>
                <LatestUpdates propertyVisitsData={assetData.listingVisits} />
              </View>
            )}
          </View>
        </View>
      </>
    );
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
          hasTakeAction: action?.label === ActionType.ACTION,
        });
      }
    }
  };

  private getFormattedInfo = (user: User, isInviteAccepted: boolean): IUserInfo => {
    const { t, isFromTenancies = false } = this.props;
    let icon = isInviteAccepted ? undefined : icons.circularCheckFilled;
    let name = isInviteAccepted ? user.name : user.email;
    let image = isInviteAccepted ? user.profilePicture : undefined;
    let designation = t('property:tenant');
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
    flexDirection: 'row',
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '40%',
  },
  topLeftView: {
    flexDirection: 'column',
    marginLeft: '10px',
    width: 'fit-content',
  },
  badgeStyle: {
    minWidth: 75,
    paddingHorizontal: 8,
    paddingVertical: 1,
    alignSelf: 'flex-start',
    letterSpacing: 2,
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
    height: '100%',
    width: '100%',
    resizeMode: 'stretch',
  },
  buttonStyle: {
    flex: 1,
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
    width: 147,
    height: 33,
    marginTop: 24,
    marginLeft: 'auto',
  },
  placeholderImage: {
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.ratingLow,
    alignSelf: 'flex-end',
  },
  cancelTitle: {
    marginVertical: 10,
    color: theme.colors.error,
  },
  designation: {
    color: theme.colors.green,
  },
  propertyInfoBox: {
    justifyContent: undefined,
    marginRight: 16,
    marginTop: 10,
  },
  cardIcon: {
    marginRight: 8,
  },
  latestUpdates: {
    flex: 1,
    marginTop: 16,
  },
});
