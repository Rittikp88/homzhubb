import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, StyleProp, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PropertyUtils } from '@homzhub/common/src/utils/PropertyUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { OffersVisitsSection, OffersVisitsType } from '@homzhub/common/src/components/molecules/OffersVisitsSection';
import { LeaseProgress, RentAndMaintenance } from '@homzhub/mobile/src/components';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { User } from '@homzhub/common/src/domain/models/User';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IListProps {
  assetData: Asset;
  onViewProperty?: (data: ISetAssetPayload) => void;
  isDetailView?: boolean;
  expandedId?: number;
  isFromTenancies?: boolean;
  onPressArrow?: (id: number) => void;
  enterFullScreen?: (attachments: Attachment[]) => void;
  onCompleteDetails: (id: number) => void;
  onOfferVisitPress: (type: OffersVisitsType) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

type Props = WithTranslation & IListProps;

const ShowInMvpRelease = false;

export class AssetCard extends Component<Props> {
  public render(): React.ReactNode {
    const { assetData, isDetailView, onViewProperty, onPressArrow, expandedId = 0, containerStyle } = this.props;
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
    } = assetData;
    let detailPayload: ISetAssetPayload;

    if (assetStatusInfo) {
      detailPayload = PropertyUtils.getAssetPayload(assetStatusInfo, id);
    }

    const handlePropertyView = (): void => onViewProperty && onViewProperty(detailPayload);
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
                {ShowInMvpRelease && (
                  <>
                    <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={8} style={styles.dotStyle} />
                    <Icon name={icons.bell} color={theme.colors.blue} size={18} style={styles.iconStyle} />
                    <Label type="large" style={styles.count}>
                      {notifications?.count}
                    </Label>
                    <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={8} style={styles.dotStyle} />
                    <Icon name={icons.headPhone} color={theme.colors.blue} size={18} style={styles.iconStyle} />
                    <Label type="large" style={styles.count}>
                      {serviceTickets?.count}
                    </Label>
                  </>
                )}
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
          <TouchableOpacity onPress={handlePropertyView} activeOpacity={isDetailView ? 1 : 0.3}>
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
                primaryAddress={projectName}
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

    return (
      <TouchableOpacity onPress={isDetailView ? handleFullScreen : handlePropertyView}>
        {item.mediaType === 'IMAGE' && (
          <Image
            source={{
              uri: item.link,
            }}
            style={[styles.image, isDetailView && styles.detailViewImage]}
          />
        )}
        {item.mediaType === 'VIDEO' && (
          <>
            <Image
              source={{ uri: item.mediaAttributes.thumbnailHD ?? item.mediaAttributes.thumbnail }}
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
        leaseTenantInfo,
        leaseListingId,
        saleListingId,
        leaseOwnerInfo,
        leaseTransaction: { rent, securityDeposit, leasePeriod },
      },
      listingVisits: { upcomingVisits, missedVisits, completedVisits },
      lastVisitedStep: { assetCreation },
      isVerificationDocumentUploaded,
    } = assetData;

    const buttonAction = leasePeriod ? leasePeriod.action : action;
    const isListed = leaseListingId || saleListingId;
    const user: User = isFromTenancies ? leaseOwnerInfo : leaseTenantInfo;

    return (
      <>
        {!!user.fullName && (
          <>
            <Divider containerStyles={styles.divider} />
            <Avatar
              fullName={user.fullName}
              image={user.profilePicture}
              designation={isFromTenancies ? t('property:owner') : t('property:tenant')}
            />
          </>
        )}
        {rent && securityDeposit && (
          <>
            <Divider containerStyles={styles.divider} />
            <RentAndMaintenance rentData={rent} depositData={securityDeposit} />
          </>
        )}
        {(leasePeriod || (label === Filters.VACANT && assetCreation.percentage < 100)) && (
          <>
            <Divider containerStyles={styles.divider} />
            <LeaseProgress
              progress={leasePeriod ? leasePeriod.totalSpendPeriod : assetCreation.percentage / 100}
              fromDate={leasePeriod?.leaseStartDate}
              toDate={leasePeriod?.leaseEndDate}
              isPropertyVacant={label === Filters.VACANT}
              assetCreation={assetCreation}
            />
            {label !== Filters.OCCUPIED && assetCreation.percentage < 100 && (
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
          </>
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
          {ShowInMvpRelease && buttonAction && (
            <Button
              type="primary"
              textType="label"
              textSize="regular"
              fontType="semiBold"
              containerStyle={[styles.buttonStyle, { backgroundColor: buttonAction.color }]}
              title={buttonAction.label}
              titleStyle={styles.buttonTitle}
            />
          )}
        </View>
      </>
    );
  };

  private onCompleteDetails = (): void => {
    const { onCompleteDetails, assetData } = this.props;
    onCompleteDetails(assetData.id);
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
});
