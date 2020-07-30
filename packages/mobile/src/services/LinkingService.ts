import { Linking } from 'react-native';

class LinkingService {
  public openDialer = async (phoneNumber: string): Promise<void> => {
    await Linking.openURL(`tel:${phoneNumber}`);
  };

  public whatsappMessage = async (phoneNumber: string, message: string): Promise<void> => {
    await Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=Hey`);
  };
}

const linkingService = new LinkingService();
export { linkingService as LinkingService };
