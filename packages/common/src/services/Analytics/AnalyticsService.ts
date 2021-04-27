import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { User } from '@homzhub/common/src/domain/models/User';
import { EventDataType } from '@homzhub/common/src/services/Analytics/interfaces';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Mixpanel } from './index';

class AnalyticsService {
  private projectToken: string = ConfigHelper.getMixpanelKey();
  private mixPanelInstance: any;

  public initMixpanel = async (): Promise<void> => {
    if (PlatformUtils.isWeb()) {
      this.mixPanelInstance = require('mixpanel-browser');
      this.mixPanelInstance.init(this.projectToken);
    } else {
      this.mixPanelInstance = await Mixpanel.init(this.projectToken);
    }
  };

  public setUser = (user: User): void => {
    if (user.email) {
      this.mixPanelInstance.identify(user.email);
    }
    const name = user.fullName || `${user.firstName} ${user.lastName}`;
    this.mixPanelInstance.people.set({ $email: user.email, $name: name });
  };

  public track = (eventName: EventType, data?: EventDataType): void => {
    const user = StoreProviderService.getUserData();
    const properties = {
      token: this.projectToken,
      $event_name: eventName,
      email: user && user.email ? user.email : 'Anonymous',
      ...data,
    };

    this.mixPanelInstance.track(eventName, properties);
  };
}

const analyticsService = new AnalyticsService();
export { analyticsService as AnalyticsService };
