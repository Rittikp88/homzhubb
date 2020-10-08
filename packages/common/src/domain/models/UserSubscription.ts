import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IServiceBundleItems, ServiceBundleItems } from '@homzhub/common/src/domain/models/ServiceBundleItems';

interface ISubscribedPlan {
  id: number;
  name: string;
  label: string;
  service_plan_bundles: IServiceBundleItems;
}

interface IUserSubscription {
  user_service_plan: ISubscribedPlan;
  recommended_plan: ISubscribedPlan;
}

@JsonObject('SubscribedPlan')
export class SubscribedPlan {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('label', String)
  private _label = '';

  @JsonProperty('service_plan_bundles', [ServiceBundleItems])
  private _serviceBundleItems: ServiceBundleItems[] = [];

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }

  get serviceBundleItems(): ServiceBundleItems[] {
    return this._serviceBundleItems;
  }
}

@JsonObject('UserSubscription')
export class UserSubscription {
  @JsonProperty('user_service_plan', SubscribedPlan)
  private _userServicePlan = new SubscribedPlan();

  @JsonProperty('recommended_plan', SubscribedPlan)
  private _recommendedPlan = new SubscribedPlan();

  get userServicePlan(): SubscribedPlan {
    return this._userServicePlan;
  }

  get recommendedPlan(): SubscribedPlan {
    return this._recommendedPlan;
  }
}
