import { Linking } from 'react-native';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';

class LinkingService {
  public openDialer = async (phoneNumber: string): Promise<void> => {
    const url = `tel:${phoneNumber}`;
    if (!(await this.canOpenURL(url))) {
      return;
    }
    await Linking.openURL(url);
  };

  public whatsappMessage = async (phoneNumber: string, message: string): Promise<void> => {
    const url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    if (!(await this.canOpenURL(url))) {
      AlertHelper.error({ message: I18nService.t('common:installWhatsapp') });
      return;
    }
    await Linking.openURL(url);
  };

  public canOpenURL = async (url: string): Promise<boolean> => {
    try {
      return await Linking.openURL(url);
    } catch (e) {
      return false;
    }
  };
}

const linkingService = new LinkingService();
export { linkingService as LinkingService };
