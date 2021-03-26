import React, { Component } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { OfferUtils } from '@homzhub/common/src/utils/OfferUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import TextWithIcon from '@homzhub/common/src/components/atoms/TextWithIcon';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  offer: Offer;
  isFromAccept?: boolean;
  onPressAction?: (action: OfferAction) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

interface IOwnState {
  hasMore: boolean;
}

type Props = IProps & WithTranslation;

class OfferCard extends Component<Props, IOwnState> {
  public state = {
    hasMore: false,
  };

  public render(): React.ReactElement {
    const { hasMore } = this.state;
    const {
      t,
      offer: { canCounter },
      containerStyle,
    } = this.props;

    // TODO: (Shikha) Add more list view once counter flow is ready
    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderCardContent()}
        {canCounter && (
          <Button
            iconSize={20}
            type="primary"
            title={hasMore ? t('lessInfo') : t('moreInfo')}
            icon={hasMore ? icons.upArrow : icons.downArrow}
            containerStyle={styles.infoButton}
            titleStyle={styles.infoTitle}
            iconColor={theme.colors.primaryColor}
            onPress={this.onInfoToggle}
          />
        )}
      </View>
    );
  }

  private renderCardContent = (): React.ReactElement => {
    const { hasMore } = this.state;
    const {
      t,
      isFromAccept = false,
      offer: {
        minLockInPeriod,
        leasePeriod,
        price,
        role,
        createdAt,
        validDays,
        validCount,
        user: { name },
      },
      offer,
    } = this.props;

    const isOfferValid = validCount > 1;
    const isOfferExpired = validCount < 1;

    const offerValues = OfferUtils.getOfferValues(offer);

    // TODO: Use values from API
    return (
      <View style={styles.cardContainer}>
        <Avatar fullName={name} designation={StringUtils.toTitleCase(role)} />
        {isFromAccept ? (
          <PropertyAddressCountry
            isIcon
            primaryAddress="Selway Apartments"
            subAddress="2972 Westheimer Rd. Santa Ana, NY"
            countryFlag={null}
            containerStyle={styles.addressView}
          />
        ) : (
          <View style={styles.dateView}>
            <Label type="regular" style={styles.date}>
              {t('createdDate', { date: DateUtils.getDisplayDate(createdAt, DateFormats.DoMMM_YYYY) })}
            </Label>
            {!isOfferExpired && (
              <TextWithIcon
                icon={icons.timeValid}
                text={t('validFor')}
                value={validDays}
                variant="label"
                textSize="regular"
                iconColor={isOfferValid ? theme.colors.darkTint5 : theme.colors.red}
                textStyle={[styles.time, isOfferValid && styles.validTime]}
                containerStyle={[styles.timeView, isOfferValid && styles.validOffer]}
              />
            )}
          </View>
        )}
        {this.renderOfferHeader()}
        <View style={styles.valuesView}>
          {offerValues.map((item, index) => {
            return (
              <TextWithIcon
                key={index}
                icon={item.icon}
                iconColor={item.iconColor}
                text={`${item.key}: `}
                value={item.value}
                variant="label"
                textSize="large"
                containerStyle={styles.textContainer}
              />
            );
          })}
          {price < 1 && (
            <View style={styles.flexRow}>
              <TextWithIcon
                text={t('common:minYear')}
                variant="label"
                textSize="large"
                value={`${minLockInPeriod} Year`}
                containerStyle={styles.textContainer}
              />
              <TextWithIcon
                text={t('common:totalYear')}
                variant="label"
                textSize="large"
                value={`${leasePeriod} Year`}
                containerStyle={[styles.textContainer, { marginHorizontal: 30 }]}
              />
            </View>
          )}
        </View>
        {!hasMore && this.renderPreferences()}
        {!hasMore && !isFromAccept && !isOfferExpired && this.renderActionView()}
      </View>
    );
  };

  private renderOfferHeader = (): React.ReactElement => {
    const { offer } = this.props;
    const offerHeader = OfferUtils.getOfferHeader(offer);
    return (
      <View style={styles.headerView}>
        <TextWithIcon
          icon={icons.circularFilledInfo}
          text={offerHeader.key}
          variant="label"
          textSize="large"
          iconColor={theme.colors.darkTint4}
          textStyle={styles.headerKey}
        />
        <TextWithIcon
          icon={offerHeader.icon}
          text={offerHeader.value}
          variant="text"
          textSize="large"
          fontWeight="semiBold"
          iconColor={offerHeader.iconColor}
          textStyle={styles.offerValue}
          containerStyle={styles.headerValue}
        />
      </View>
    );
  };

  private renderActionView = (): React.ReactElement => {
    const {
      t,
      offer: { status, actions, canCounter },
      onPressAction,
    } = this.props;
    const buttonData = OfferUtils.getButtonStatus(status);
    return (
      <>
        {actions.length < 2 && (
          <Button
            type="primary"
            title={buttonData.title}
            icon={buttonData.icon}
            iconColor={buttonData.iconColor}
            iconSize={16}
            titleStyle={buttonData.textStyle}
            containerStyle={buttonData.container}
            disabled
          />
        )}
        <View style={styles.actionView}>
          {actions.map((item, index) => {
            const { title, icon, iconColor, container, textStyle, onAction } = OfferUtils.getActionData({
              item,
              initialButtonStyle: styles.actionButton,
              initialTextStyle: styles.titleStyle,
              onAction: onPressAction,
            });
            return (
              <Button
                key={index}
                type="primary"
                title={title}
                icon={icon}
                iconSize={20}
                textType="label"
                textSize="large"
                iconColor={iconColor}
                containerStyle={container}
                titleStyle={textStyle}
                onPress={onAction}
              />
            );
          })}
        </View>
        {canCounter && <Button type="primary" title={t('common:counter')} />}
      </>
    );
  };

  private renderPreferences = (): React.ReactElement => {
    const {
      offer: { tenantPreferences },
    } = this.props;
    return (
      <View style={styles.preferenceView}>
        {!!tenantPreferences.length &&
          tenantPreferences.map((item, index) => {
            return (
              <TextWithIcon
                key={index}
                icon={item.isSelected ? icons.check : icons.close}
                text={item.name}
                variant="label"
                textSize="large"
                iconColor={item.isSelected ? theme.colors.green : theme.colors.error}
                containerStyle={styles.preferenceContent}
              />
            );
          })}
      </View>
    );
  };

  private onInfoToggle = (): void => {
    const { hasMore } = this.state;
    this.setState({ hasMore: !hasMore });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.offers)(OfferCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    marginBottom: 16,
  },
  textContainer: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  infoButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.moreSeparator,
  },
  infoTitle: {
    color: theme.colors.primaryColor,
  },
  cardContainer: {
    padding: 16,
  },
  addressView: {
    marginTop: 16,
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  date: {
    color: theme.colors.darkTint5,
  },
  timeView: {
    flexDirection: 'row-reverse',
    backgroundColor: theme.colors.redOpacity,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  validOffer: {
    backgroundColor: theme.colors.background,
  },
  time: {
    color: theme.colors.red,
  },
  validTime: {
    color: theme.colors.darkTint1,
  },
  headerView: {
    paddingVertical: 10,
    marginVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: theme.colors.background,
    borderBottomColor: theme.colors.background,
  },
  offerValue: {
    color: theme.colors.darkTint1,
  },
  valuesView: {
    marginTop: 16,
  },
  flexRow: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row-reverse',
    flex: 0.45,
  },
  titleStyle: {
    marginHorizontal: 6,
  },
  actionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerValue: {
    marginVertical: 10,
  },
  headerKey: {
    marginRight: 6,
  },
  preferenceContent: {
    flexDirection: 'row-reverse',
    marginLeft: 20,
  },
  preferenceView: {
    flexDirection: 'row',
    marginBottom: 16,
  },
});
