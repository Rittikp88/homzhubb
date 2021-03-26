import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { DateUtils, DateFormats } from '@homzhub/common/src/utils/DateUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { IOfferValue, Offer, OfferAction, Status } from '@homzhub/common/src/domain/models/Offer';
import { IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';

interface IActionStyle {
  title: string;
  icon?: string;
  iconColor?: string;
  container: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  onAction?: () => void;
}

interface IActionPayload {
  item: string;
  initialButtonStyle: ViewStyle;
  initialTextStyle: TextStyle;
  onAction?: (action: OfferAction) => void;
}

class OfferUtils {
  public getOfferValues = (offer: Offer, compareData: IOfferCompare): IOfferValue[] => {
    const { annualRentIncrementPercentage: percentage, securityDeposit, moveInDate, price, bookingAmount } = offer;

    const annualRent = {
      key: I18nService.t('property:annualIncrementSuffix'),
      value: percentage ? percentage.toString() : '',
      icon: this.offerComparison(percentage ?? 0, compareData.incrementPercentage).icon,
      iconColor: this.offerComparison(percentage ?? 0, compareData.incrementPercentage).color,
    };

    if (price > 0) {
      return [
        {
          key: I18nService.t('property:bookingAmount'),
          value: bookingAmount.toString(),
          icon: this.offerComparison(bookingAmount, compareData.bookingAmount).icon,
          iconColor: this.offerComparison(bookingAmount, compareData.bookingAmount).color,
        },
      ];
    }

    return [
      ...(percentage ? [annualRent] : []),
      {
        key: I18nService.t('property:securityDeposit'),
        value: securityDeposit.toString(),
        icon: this.offerComparison(securityDeposit, compareData.deposit).icon,
        iconColor: this.offerComparison(securityDeposit, compareData.deposit).color,
      },
      {
        key: I18nService.t('property:moveInDate'),
        value: DateUtils.getUtcFormatted(moveInDate, DateFormats.YYYYMMDD, DateFormats.DoMMM_YYYY),
      },
    ];
  };

  public getOfferHeader = (offer: Offer, compareData: IOfferCompare): IOfferValue => {
    const { rent, price } = offer;

    if (rent > 1) {
      return {
        key: I18nService.t('property:rent'),
        value: rent.toString(),
        icon: this.offerComparison(rent, compareData.rent).icon,
        iconColor: this.offerComparison(rent, compareData.rent).color,
      };
    }

    return {
      key: I18nService.t('property:sellingPrice'),
      value: price.toString(),
      icon: this.offerComparison(price, compareData.price).icon,
      iconColor: this.offerComparison(price, compareData.price).color,
    };
  };

  public getActionData = (payload: IActionPayload): IActionStyle => {
    const { item, onAction, initialButtonStyle, initialTextStyle } = payload;
    switch (item) {
      case OfferAction.ACCEPT:
        return {
          title: StringUtils.toTitleCase(item),
          icon: icons.circularCheckFilled,
          iconColor: theme.colors.green,
          onAction: (): void => (onAction ? onAction(OfferAction.ACCEPT) : FunctionUtils.noop()),
          container: {
            ...initialButtonStyle,
            backgroundColor: theme.colors.reviewCardOpacity,
          },
          textStyle: {
            ...initialTextStyle,
            color: theme.colors.green,
          },
        };
      case OfferAction.REJECT:
        return {
          title: StringUtils.toTitleCase(item),
          icon: icons.circularCrossFilled,
          iconColor: theme.colors.red,
          onAction: (): void => (onAction ? onAction(OfferAction.REJECT) : FunctionUtils.noop()),
          container: {
            ...initialButtonStyle,
            backgroundColor: theme.colors.redOpacity,
          },
          textStyle: {
            ...initialTextStyle,
            color: theme.colors.red,
          },
        };
      default:
        return {
          title: I18nService.t('offers:cancelOffer'),
          container: {
            backgroundColor: theme.colors.transparent,
          },
          textStyle: {
            color: theme.colors.red,
          },
        };
    }
  };

  public getButtonStatus = (status: Status): IActionStyle => {
    switch (status) {
      case Status.ACCEPTED:
        return {
          title: I18nService.t('offers:offerAccepted'),
          icon: icons.circularCheckFilled,
          iconColor: theme.colors.green,
          container: {
            backgroundColor: theme.colors.greenOpacity,
            flexDirection: 'row-reverse',
          },
          textStyle: {
            color: theme.colors.green,
            marginHorizontal: 8,
          },
        };
      case Status.REJECTED:
        return {
          title: I18nService.t('offers:offerRejected'),
          icon: icons.circularCrossFilled,
          iconColor: theme.colors.error,
          container: {
            backgroundColor: theme.colors.redOpacity,
            flexDirection: 'row-reverse',
          },
          textStyle: {
            color: theme.colors.error,
            marginHorizontal: 8,
          },
        };
      case Status.PENDING:
      default:
        return {
          title: I18nService.t('property:awaiting'),
          icon: icons.wait,
          iconColor: theme.colors.darkTint5,
          container: {
            backgroundColor: theme.colors.grayOpacity,
            flexDirection: 'row-reverse',
          },
          textStyle: {
            color: theme.colors.darkTint3,
            marginHorizontal: 8,
          },
        };
    }
  };

  public offerComparison = (value: number, compareValue = 0): { icon: string; color: string } => {
    if (value > compareValue) {
      return {
        icon: icons.arrowUp,
        color: theme.colors.green,
      };
    }
    if (value < compareValue) {
      return {
        icon: icons.arrowDown,
        color: theme.colors.error,
      };
    }

    return {
      icon: '',
      color: '',
    };
  };
}

const offerUtils = new OfferUtils();
export { offerUtils as OfferUtils };
