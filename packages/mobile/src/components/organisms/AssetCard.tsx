import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { placeHolderImage } from '@homzhub/common/src/styles/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Avatar, Badge, Button, Divider, Image, Label } from '@homzhub/common/src/components';
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
  onViewProperty?: (data: Asset) => void;
  isDetailView?: boolean;
  expandedId?: number;
  onPressArrow?: (id: number) => void;
  enterFullScreen?: (attachments: Attachment[]) => void;
}

type Props = WithTranslation & IListProps;

export class AssetCard extends Component<Props> {
  public render(): React.ReactNode {
    const { t, assetData, isDetailView, onViewProperty, onPressArrow, expandedId = 0 } = this.props;
    const {
      id,
      projectName,
      unitNumber,
      blockNumber,
      notifications,
      serviceTickets,
      attachments,
      assetStatusInfo: { tag },
    } = assetData;
    const handlePropertyView = (): void => onViewProperty && onViewProperty(assetData);
    const handleArrowPress = (): void => onPressArrow && onPressArrow(id);
    const isExpanded: boolean = expandedId === id;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          {!isDetailView && (
            <View style={[styles.topView, isExpanded && styles.expandedView]}>
              <View style={styles.topLeftView}>
                <Badge title={tag.label} badgeColor={tag.color} badgeStyle={styles.badgeStyle} />
                <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={8} style={styles.dotStyle} />
                <Icon name={icons.bell} color={theme.colors.blue} size={18} style={styles.iconStyle} />
                <Label type="large" style={styles.count}>
                  {notifications.count}
                </Label>
                <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={8} style={styles.dotStyle} />
                <Icon name={icons.headPhone} color={theme.colors.blue} size={18} style={styles.iconStyle} />
                <Label type="large" style={styles.count}>
                  {serviceTickets.count}
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
          {(isExpanded || isDetailView) && this.renderAttachmentView(attachments)}
          {isDetailView && (
            <Badge title={tag.label} badgeColor={tag.color} badgeStyle={[styles.badgeStyle, styles.detailViewBadge]} />
          )}
          <PropertyAddressCountry
            primaryAddress={projectName}
            subAddress={`${unitNumber} ${blockNumber}`}
            containerStyle={styles.addressStyle}
          />
          {(isExpanded || isDetailView) && this.renderExpandedView()}
        </View>
        {isExpanded && (
          <Button
            type="secondary"
            title={t('viewProperty')}
            textSize="small"
            onPress={handlePropertyView}
            containerStyle={styles.buttonStyle}
            titleStyle={styles.buttonTitle}
            testID="btnPropertyView"
          />
        )}
      </View>
    );
  }

  private renderAttachmentView = (attachments: Attachment[]): React.ReactElement => {
    const { isDetailView, enterFullScreen } = this.props;
    let item: Attachment = {} as Attachment;
    let handleFullScreen;
    if (attachments.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      item = attachments[0];
      handleFullScreen = (): void => enterFullScreen && enterFullScreen(attachments);
    } else {
      // eslint-disable-next-line prefer-destructuring
      item = initialCarouselData[0];
      handleFullScreen = (): void => enterFullScreen && enterFullScreen(initialCarouselData);
    }
    return (
      <TouchableOpacity onPress={handleFullScreen}>
        {item.mediaType === 'IMAGE' && (
          <Image
            source={{
              uri: item.link,
            }}
            style={[styles.image, isDetailView && styles.detailViewImage]}
            height={isDetailView ? 130 : 200}
          />
        )}
        {item.mediaType === 'VIDEO' && (
          <>
            <Image
              source={{ uri: item.mediaAttributes.thumbnailHD ?? item.mediaAttributes.thumbnail }}
              style={[styles.image, isDetailView && styles.detailViewImage]}
              height={isDetailView ? 130 : 200}
            />
          </>
        )}
      </TouchableOpacity>
    );
  };

  private renderExpandedView = (): React.ReactElement => {
    const { isDetailView, assetData } = this.props;
    const {
      assetStatusInfo: {
        tag: { label },
        leaseTenantInfo,
        leaseTransaction: { rent, securityDeposit, leasePeriod },
      },
      formattedPercentage,
    } = assetData;
    const isRentVisible = !!(rent && securityDeposit) || false;
    return (
      <>
        {!!leaseTenantInfo.fullName && (
          <>
            <Divider containerStyles={styles.divider} />
            <Avatar fullName={leaseTenantInfo.fullName} designation="Tenant" />
          </>
        )}
        {!isDetailView && isRentVisible && (
          <>
            <Divider containerStyles={styles.divider} />
            <RentAndMaintenance />
          </>
        )}
        {label !== 'FOR SALE' && (
          <>
            <Divider containerStyles={styles.divider} />
            <LeaseProgress
              progress={leasePeriod ? leasePeriod.totalSpendPeriod : formattedPercentage}
              fromDate={leasePeriod?.leaseStartDate}
              toDate={leasePeriod?.leaseEndDate}
              buttonAction={leasePeriod?.action}
              width={theme.viewport.width > 400 ? 320 : 280}
              isPropertyVacant={label === Filters.VACANT}
            />
          </>
        )}
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
  buttonStyle: {
    borderWidth: 0,
  },
  buttonTitle: {
    marginVertical: 14,
  },
  image: {
    minWidth: theme.viewport.width > 400 ? 350 : 300,
  },
  detailViewImage: {
    borderRadius: 4,
  },
});
