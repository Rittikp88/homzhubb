import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DeviceUtils } from '@homzhub/common/src/utils/DeviceUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { NotificationScreens, NotificationTypes } from '@homzhub/mobile/src/services/constants';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DetailType, IDeviceTokenPayload, ListingType } from '@homzhub/common/src/domain/repositories/interfaces';

const notificationScreenMap = {
  [NotificationTypes.Chat]: ScreensKeys.ChatScreen,
  [NotificationTypes.ServiceTicket]: ScreensKeys.ServiceTicketDetail,
  [NotificationTypes.Offer]: ScreensKeys.OfferDetail,
  [NotificationTypes.Asset]: ScreensKeys.Portfolio,
};

const notificationSubScreenMap = {
  [NotificationScreens.OffersReceived]: ScreensKeys.PropertyOfferList,
  [NotificationScreens.OffersMade]: ScreensKeys.PropertyOfferList,
  [NotificationScreens.OfferDetail]: ScreensKeys.OfferDetail,
  // Todo (Praharsh) : Check this navigation once BE fixes it.
  [NotificationScreens.OfferChats]: ScreensKeys.ChatScreen,
};

const notificationParamsMap = {
  [NotificationScreens.OffersReceived]: { isReceivedFlow: true },
  [NotificationScreens.OffersMade]: { isReceivedFlow: false },
  [NotificationScreens.OfferDetail]: {},
  [NotificationScreens.OfferChats]: { isFromOffers: true },
};

interface INotificationData {
  [key: string]: string;
}

class NotificationService {
  private messageObject: FirebaseMessagingTypes.Module;

  constructor() {
    this.messageObject = messaging();
  }

  public async init(): Promise<void> {
    await this.requestPermisson();

    // Called when a new registration token is generated for the device/token expires/server invalidates the token.
    this.messageObject.onTokenRefresh(async (token) => {
      await StorageService.set(StorageKeys.DEVICE_TOKEN, token);
      await this.postDeviceToken();
    });

    await this.addNotificationListeners();
  }

  public addNotificationListeners = async (): Promise<void> => {
    // Handled Notification for foreground message / App is opened.
    this.messageObject.onMessage((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      if (remoteMessage.data) {
        const {
          data: { message, deeplink_metadata, title },
          data,
        } = remoteMessage;
        const JSONDeeplinkData: INotificationData = JSON.parse(deeplink_metadata);
        const { type } = JSONDeeplinkData;

        const store = StoreProviderService.getStore();

        switch (type) {
          case NotificationTypes.Chat:
            {
              const { message_group_id, message_group_name } = JSONDeeplinkData;
              const { navigation } = NavigationService;
              const currentRoute = navigation.getCurrentRoute();
              const { name, params } = currentRoute;
              const groupId = params && params.groupId ? params.groupId : null;

              const isOnChatScreen = name === ScreensKeys.ChatScreen && groupId === message_group_id;

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
            break;
          default:
            AlertHelper.success({
              message,
              onPress: () => this.redirectOnNotification(data),
              description: title,
              duration: 5000,
            });
        }
      }
    });

    // Handle Notification when App is in backgound.
    this.messageObject.onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      const { data } = remoteMessage;
      if (data) {
        this.redirectOnNotification(data);
      }
    });
    // Handle Notification when App is quit / App is not opened.
    // eslint-disable-next-line max-len
    const remoteMessage: FirebaseMessagingTypes.RemoteMessage | null = await this.messageObject.getInitialNotification();
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

    const isDeviceTokenChanged = !oldDeviceToken || !newDeviceToken || newDeviceToken !== oldDeviceToken;

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
    const { type, screen } = JSONDeeplinkData;

    let navigationTab = ScreensKeys.More;
    const screenName =
      (screen
        ? notificationSubScreenMap[screen as NotificationScreens] || ScreensKeys.ChatScreen
        : notificationScreenMap[type as NotificationTypes]) || ScreensKeys.ChatScreen;

    const params = notificationParamsMap[screen as NotificationScreens] || {};
    const store = StoreProviderService.getStore();

    switch (type) {
      case NotificationTypes.Chat:
        {
          const { message_group_id, message_group_name } = JSONDeeplinkData;

          store.dispatch(
            CommonActions.setCurrentChatDetail({
              groupName: message_group_name,
              groupId: Number(message_group_id),
            })
          );

          NavigationService.notificationNavigation(screenName, params, navigationTab);
        }
        break;
      case NotificationTypes.ServiceTicket:
        {
          navigationTab = ScreensKeys.More;

          const { object_id } = JSONDeeplinkData;
          store.dispatch(
            TicketActions.setCurrentTicket({
              ticketId: Number(object_id),
            })
          );

          NavigationService.notificationNavigation(screenName, params, navigationTab);
        }
        break;
      case NotificationTypes.Offer:
        {
          const { lease_listing_id, sale_listing_id, message_group_id } = JSONDeeplinkData;
          navigationTab = ScreensKeys.More;

          store.dispatch(
            OfferActions.setCurrentOfferPayload({
              type: lease_listing_id ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
              listingId: Number(lease_listing_id) ?? Number(sale_listing_id) ?? 0,
              ...(Boolean(message_group_id.length) && { threadId: message_group_id }),
            })
          );

          NavigationService.notificationNavigation(screenName, params, navigationTab);
        }
        break;

      case NotificationTypes.Asset:
        {
          const { asset_id, lease_unit_id } = JSONDeeplinkData;
          navigationTab = ScreensKeys.Portfolio;

          store.dispatch(
            PortfolioActions.setCurrentAsset({
              asset_id: Number(asset_id),
              listing_id: Number(lease_unit_id),
              assetType: DetailType.LEASE_UNIT,
            })
          );
          NavigationService.notificationNavigation(screenName, params, navigationTab);
        }
        break;
      default:
        NavigationService.notificationNavigation(screenName, params, navigationTab);
    }
  };
}

const notificationService = new NotificationService();
export { notificationService as NotificationService };
