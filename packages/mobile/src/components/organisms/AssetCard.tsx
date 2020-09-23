import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { placeHolderImage } from '@homzhub/common/src/styles/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Avatar, Badge, Button, Divider, Label } from '@homzhub/common/src/components';
import { PropertyAddressCountry, LeaseProgress, RentAndMaintenance } from '@homzhub/mobile/src/components';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';

const initialCarouselData: Attachment[] = [
  {
    link: placeHolderImage,
    isCoverImage: true,
    fileName: 'sample',
    mediaType: 'IMAGE',
    // @ts-ignore
    mediaAttributes: {},
  },
];

interface IListProps {
  assetData: Asset;
  onViewProperty?: (id: number) => void;
  isDetailView?: boolean;
  expandedId?: number;
  onPressArrow?: (id: number) => void;
  enterFullScreen?: (attachments: Attachment[]) => void;
}

type Props = WithTranslation & IListProps;

export class AssetCard extends Component<Props> {
  public render(): React.ReactNode {
    const { assetData, isDetailView, onViewProperty, onPressArrow, expandedId = 0 } = this.props;
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
    } = assetData;
    const handlePropertyView = (): void => onViewProperty && onViewProperty(id);
    const handleArrowPress = (): void => onPressArrow && onPressArrow(id);
    const isExpanded: boolean = expandedId === id;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          {!isDetailView && (
            <View style={[styles.topView, isExpanded && styles.expandedView]}>
              <View style={styles.topLeftView}>
                <Badge
                  title={assetStatusInfo?.tag.label}
                  badgeColor={assetStatusInfo?.tag.color}
                  badgeStyle={styles.badgeStyle}
                />
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
                  title={assetStatusInfo?.tag.label}
                  badgeColor={assetStatusInfo?.tag.color}
                  badgeStyle={[styles.badgeStyle, styles.detailViewBadge]}
                />
              )}
              <PropertyAddressCountry
                primaryAddress={projectName}
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

  private renderAttachmentView = (attachments: Attachment[], handlePropertyView: () => void): React.ReactElement => {
    const { isDetailView, enterFullScreen } = this.props;
    let item;
    let handleFullScreen;
    if (attachments && attachments.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      item = attachments[0];
      handleFullScreen = (): void => enterFullScreen && enterFullScreen(attachments);
    } else {
      // eslint-disable-next-line prefer-destructuring
      item = initialCarouselData[0];
      handleFullScreen = (): void => enterFullScreen && enterFullScreen(initialCarouselData);
    }
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

  private renderExpandedView = (): React.ReactElement => {
    const { assetData, t } = this.props;
    const {
      assetStatusInfo: {
        action,
        tag: { label },
        leaseTenantInfo,
        leaseListingId,
        saleListingId,
        leaseTransaction: { rent, securityDeposit, leasePeriod },
      },
      formattedPercentage,
    } = assetData;

    const buttonAction = leasePeriod ? leasePeriod.action : action;
    const isListed = leaseListingId || saleListingId;
    return (
      <>
        {!!leaseTenantInfo.fullName && (
          <>
            <Divider containerStyles={styles.divider} />
            <Avatar fullName={leaseTenantInfo.fullName} designation="Tenant" />
          </>
        )}
        {rent && securityDeposit && (
          <>
            <Divider containerStyles={styles.divider} />
            <RentAndMaintenance rentData={rent} depositData={securityDeposit} />
          </>
        )}
        {(leasePeriod || (label === Filters.VACANT && !isListed)) && (
          <>
            <Divider containerStyles={styles.divider} />
            <LeaseProgress
              progress={leasePeriod ? leasePeriod.totalSpendPeriod : formattedPercentage}
              fromDate={leasePeriod?.leaseStartDate}
              toDate={leasePeriod?.leaseEndDate}
              width={theme.viewport.width > 400 ? 320 : 280}
              isPropertyVacant={label === Filters.VACANT}
            />
          </>
        )}
        <View style={styles.buttonGroup}>
          {buttonAction && (
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
          {!isListed && formattedPercentage < 100 && (
            <Button
              type="primary"
              textType="label"
              textSize="regular"
              fontType="semiBold"
              containerStyle={styles.buttonStyle}
              title={t('complete')}
              titleStyle={styles.buttonTitle}
            />
          )}
        </View>
      </>
    );
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
  expandedView: {
    marginBottom: 18,
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
    minWidth: theme.viewport.width > 400 ? 350 : 300,
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
});
