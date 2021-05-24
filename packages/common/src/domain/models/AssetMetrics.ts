import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Data } from '@homzhub/common/src/domain/models/Asset';
import { MetricsCount } from '@homzhub/common/src/domain/models/MetricsCount';
import { ICount, Count } from '@homzhub/common/src/domain/models/Count';

interface IUserServicePlan {
  id: number;
  name: string;
  label: string;
}

interface IAssetMetricsData {
  asset: ICount;
  miscellaneous: IMiscellaneous;
}

interface IMiscellaneous {
  name: string;
  label: string;
  count: number;
  colorCode: string;
}

interface IUpdates {
  notifications: ICount;
  tickets: ICount;
  dues: ICount;
}

interface IAssetMetrics {
  user_service_plan: IUserServicePlan;
  asset_metrics: IAssetMetricsData;
  updates: IUpdates;
}

@JsonObject('UserServicePlan')
export class UserServicePlan {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('label', String)
  private _label = '';

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }
}

@JsonObject('Miscellaneous')
export class Miscellaneous {
  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('label', String)
  private _label = '';

  @JsonProperty('count', Number)
  private _count = 0;

  @JsonProperty('currency_symbol', String, true)
  private _currency_symbol = '';

  @JsonProperty('color_code', String)
  private _colorCode = '';

  get colorCode(): string {
    return this._colorCode;
  }

  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }

  get count(): number {
    return this._count;
  }

  get currencySymbol(): string {
    return this._currency_symbol;
  }
}

@JsonObject('AssetMetricsData')
export class AssetMetricsData {
  @JsonProperty('assets', Count)
  private _assets = new Count();

  @JsonProperty('miscellaneous', [Miscellaneous], true)
  private _miscellaneous: Miscellaneous[] = [];

  @JsonProperty('asset_groups', [Data], true)
  private _assetGroups: Data[] = [];

  get assets(): Count {
    return this._assets;
  }

  get miscellaneous(): Miscellaneous[] {
    return this._miscellaneous;
  }

  get assetGroups(): Data[] {
    return this._assetGroups;
  }
}

@JsonObject('AssetUpdates')
export class AssetUpdates {
  @JsonProperty('notifications', MetricsCount)
  private _notifications = new MetricsCount();

  @JsonProperty('tickets', MetricsCount)
  private _tickets = new MetricsCount();

  // Optional not to break web functionality.
  @JsonProperty('dues', Count, true)
  private _dues = new Count();

  @JsonProperty('messages', MetricsCount, true)
  private _messages = new MetricsCount();

  get notifications(): MetricsCount {
    return this._notifications;
  }

  get tickets(): MetricsCount {
    return this._tickets;
  }

  get dues(): Count {
    return this._dues;
  }

  get messages(): MetricsCount {
    return this._messages;
  }
}

@JsonObject('AssetMetrics')
export class AssetMetrics {
  @JsonProperty('user_service_plan', UserServicePlan)
  private _userServicePlan = new UserServicePlan();

  @JsonProperty('asset_metrics', AssetMetricsData)
  private _assetMetrics = new AssetMetricsData();

  @JsonProperty('updates', AssetUpdates, true)
  private _updates = new AssetUpdates();

  get userServicePlan(): UserServicePlan {
    return this._userServicePlan;
  }

  get assetMetrics(): AssetMetricsData {
    return this._assetMetrics;
  }

  get updates(): AssetUpdates {
    return this._updates;
  }
}
