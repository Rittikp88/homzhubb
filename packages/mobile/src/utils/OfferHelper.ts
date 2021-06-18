import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { OffersVisitsType } from '@homzhub/common/src/constants/Offers';

class OfferHelper {
  public handleOfferActions = (action: OfferAction): void => {
    const {
      navigation: { navigate },
    } = NavigationService;
    switch (action) {
      case OfferAction.ACCEPT:
        navigate(ScreensKeys.AcceptOffer);
        break;
      case OfferAction.REJECT:
        navigate(ScreensKeys.RejectOffer);
        break;
      case OfferAction.COUNTER:
        navigate(ScreensKeys.SubmitOffer);
        break;
      case OfferAction.CANCEL:
        navigate(ScreensKeys.CancelOffer);
        break;
      default:
        FunctionUtils.noop();
    }
  };

  public handleOfferVisitAction = (type: OffersVisitsType, name: string, id: number): void => {
    const {
      navigation: { navigate },
    } = NavigationService;

    const param = {
      isFromPortfolio: true,
      isFromTenancies: false,
      screenTitle: name,
      propertyId: id,
    };

    switch (type) {
      case OffersVisitsType.offers:
        navigate(ScreensKeys.OfferDetail, param);
        break;
      case OffersVisitsType.visits:
        navigate(ScreensKeys.PropertyVisits, param);
        break;
      default:
        FunctionUtils.noop();
    }
  };
}

const offerHelperUtils = new OfferHelper();
export { offerHelperUtils as OfferHelper };
