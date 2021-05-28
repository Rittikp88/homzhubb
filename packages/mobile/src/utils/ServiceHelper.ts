import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { ServiceOption } from '@homzhub/common/src/constants/Services';

class ServiceHelper {
  public handleServiceActions = (value: string, assetId: number): void => {
    const {
      navigation: { navigate },
    } = NavigationService;
    switch (value) {
      case ServiceOption.ADD_IMAGE:
        navigate(ScreensKeys.AddPropertyImage, { assetId });
        break;
      default:
        FunctionUtils.noop();
    }
  };
}

const serviceHelper = new ServiceHelper();
export { serviceHelper as ServiceHelper };
