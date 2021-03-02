import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DeviceUtils } from '@homzhub/common/src/utils/DeviceUtils';
import { Logger } from '@homzhub/common/src/utils/Logger';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { StorageService, StorageKeys } from '@homzhub/common/src/services/storage/StorageService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { NotificationTypes } from '@homzhub/mobile/src/services/constants';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IDeviceTokenPayload } from '@homzhub/common/src/domain/repositories/interfaces';

const notificationScreenMap = {
  [NotificationTypes.Chat]: ScreensKeys.ChatScreen,
};

interface INotificationData {
  [key: string]: string;
}

class NotificationService {
  private messageObject: FirebaseMessagingTypes.Module;

  constructor() {
    this.messageObject = messaging();
  }
  // TODO: (shivam: 3/2/21) remove loggers

  public async init(): Promise<void> {
    await this.requestPermisson();

    // Called when a new registration token is generated for the device/token expires/server invalidates the token.
    this.messageObject.onTokenRefresh(async (token) => {
      await StorageService.set(StorageKeys.DEVICE_TOKEN, token);
      this.postDeviceToken();
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
          data: { message, deeplink_metadata, title },
          data,
        } = remoteMessage;
        // TODO: check the current rout name and show alert accordingly
        const { navigation } = NavigationService;
        const currentRoute = navigation.getCurrentRoute();
        const { name, params } = currentRoute;
        const JSONDeeplinkData: INotificationData = JSON.parse(deeplink_metadata);
        const { message_group_id, message_group_name } = JSONDeeplinkData;

        const groupId = params && params.groupId ? params.groupId : null;
        const isOnChatScreen = name === ScreensKeys.ChatScreen && groupId === message_group_id;

        const store = StoreProviderService.getStore();

        if (isOnChatScreen) {
          store.dispatch(
            CommonActions.getMessages({
              groupId: Number(message_group_id),
            })
          );
          CommonActions.setCurrentChatDetail({
            groupName: message_group_name,
            groupId: Number(message_group_id),
          });
        } else {
          store.dispatch(
            CommonActions.getMessages({
              groupId: Number(message_group_id),
            })
          );
          AlertHelper.success({
            message,
            onPress: () => this.redirectOnNotification(data),
            description: title,
            duration: 5000,
          });
        }
      }
    });

    this.messageObject.setBackgroundMessageHandler(async (remoteMessage) => {
      return Promise.resolve(this.redirectOnNotification(remoteMessage.data));
    });

    // handle backgound app
    this.messageObject.onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      Logger.info(`background notification message: ${remoteMessage} `);
      const { data } = remoteMessage;
      if (data) {
        this.redirectOnNotification(data);
      }
    });
    // handle quit app
    const remoteMessage: FirebaseMessagingTypes.RemoteMessage | null = await this.messageObject.getInitialNotification();
    Logger.info(`quit app notification message: ${remoteMessage} `);
    if (remoteMessage && remoteMessage.data) {
      this.redirectOnNotification(remoteMessage.data);
    }
  };

  public getDeviceToken = async (): Promise<string | null> => {
    return await StorageService.get(StorageKeys.DEVICE_TOKEN);
  };

  public postDeviceToken = async (): Promise<void> => {
    const newDeviceToken = await this.messageObject.getToken();
    const oldDeviceToken = await this.getDeviceToken();

    Logger.info(`device toke: ${newDeviceToken}`);

    const isDeviceTokenChanged = !oldDeviceToken || newDeviceToken !== oldDeviceToken;

    if (!newDeviceToken || !isDeviceTokenChanged) {
      return;
    }

    await StorageService.set(StorageKeys.DEVICE_TOKEN, newDeviceToken);

    const deviceName = await DeviceUtils.getDeviceName();
    const deviceId = DeviceUtils.getDeviceId();

    const payload: IDeviceTokenPayload = {
      registration_id: newDeviceToken,
      device_id: deviceId,
      name: deviceName,
      type: PlatformUtils.getPlatform(),
    };

    CommonRepository.postDeviceToken(payload);
  };

  public requestPermisson = async (): Promise<void> => {
    await this.messageObject.requestPermission({ sound: true, announcement: true });
  };

  public checkIsPermissionGranted = async (): Promise<boolean> => {
    const authStatus = await this.messageObject.hasPermission();
    if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      return true;
    }

    return false;
  };

  private redirectOnNotification = (data: { [key: string]: string } | undefined): void => {
    if (!data || !data.deeplink_metadata) {
      return;
    }

    const { deeplink_metadata } = data as INotificationData;
    const JSONDeeplinkData: INotificationData = JSON.parse(deeplink_metadata);
    const { type } = JSONDeeplinkData;

    const navigationTab = ScreensKeys.More;
    const params = {};
    let screeName = notificationScreenMap[type as NotificationTypes] || ScreensKeys.ChatScreen;

    switch (type) {
      case NotificationTypes.Chat:
        {
          const { message_group_id, message_group_name } = JSONDeeplinkData;

          const store = StoreProviderService.getStore();
          store.dispatch(
            CommonActions.setCurrentChatDetail({
              groupName: message_group_name,
              groupId: Number(message_group_id),
            })
          );

          screeName = notificationScreenMap[type];
          NavigationService.notificationNavigation(screeName, params, navigationTab);
        }
        break;
      default:
        NavigationService.notificationNavigation(screeName, params, navigationTab);
    }
  };
}

const notificationService = new NotificationService();
export { notificationService as NotificationService };
