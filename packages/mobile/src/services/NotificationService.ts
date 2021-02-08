import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { Logger } from '@homzhub/common/src/utils/Logger';
import { StorageService, StorageKeys } from '@homzhub/common/src/services/storage/StorageService';

class NotificationService {
  private messageObject: FirebaseMessagingTypes.Module;

  constructor() {
    this.messageObject = messaging();
  }
  // TODO: (shivam: 3/2/21) remove loggers

  public async init(): Promise<void> {
    await this.messageObject.requestPermission({ sound: true, announcement: true });
    const deviceToken = await this.messageObject.getToken();
    Logger.info(`device token - ${deviceToken}`);
    await StorageService.set(StorageKeys.DEVICE_TOKEN, deviceToken);
    // Called when a new registration token is generated for the device/token expires/server invalidates the token.
    this.messageObject.onTokenRefresh(async (token) => {
      // TODO: (shivam: 3/2/21) send new device token to backend.
      await StorageService.set(StorageKeys.DEVICE_TOKEN, token);
    });

    await this.addNotificationListeners();
  }

  public addNotificationListeners = async (): Promise<void> => {
    // foreground message
    this.messageObject.onMessage((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      Logger.info(`foreground notification message: ${remoteMessage} `);
      // TODO: (shivam: 3/2/21) destruct data and redirect to screen.
      if (remoteMessage.data) {
        const {
          data: { body },
        } = remoteMessage;
        AlertHelper.success({
          message: body,
        });
      }
    });
    // handle backgound app
    this.messageObject.onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      Logger.info(`background notification message: ${remoteMessage} `);
    });
    // handle quit app
    const remoteMessage: FirebaseMessagingTypes.RemoteMessage | null = await this.messageObject.getInitialNotification();
    Logger.info(`quit app notification message: ${remoteMessage} `);
  };

  public getDeviceToken = async (): Promise<string | null> => {
    return await StorageService.get(StorageKeys.DEVICE_TOKEN);
  };
}

const notificationService = new NotificationService();
export { notificationService as NotificationService };
