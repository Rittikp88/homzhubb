import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Data } from '@homzhub/common/src/domain/models/Asset';

interface IUserServicePlan {
  id: number;
  name: string;
  label: string;
}

interface ICount {
  count: number;
}

interface IAssetMetricsData {
  asset: ICount;
  miscellaneous: IMiscellaneous;
}

interface IColorGradient {
  angle: number;
  location: number[];
  hex_color_A: string;
  hex_color_B: string;
}

interface IMiscellaneous {
  name: string;
  label: string;
  count: number;
  color_gradient: IColorGradient;
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

@JsonObject('Count')
export class Count {
  @JsonProperty('count', Number)
  private _count = 0;

  get count(): number {
    return this._count;
  }
}

@JsonObject('ColorGradient')
export class ColorGradient {
  @JsonProperty('angle', Number)
  private _angle = 0;

  @JsonProperty('location', [Number])
  private _location = [];

  @JsonProperty('hex_color_a', String)
  private _hexColorA = '';

  @JsonProperty('hex_color_b', String)
  private _hexColorB = '';

  get angle(): number {
    return this._angle;
  }

  get location(): number[] {
    return this._location;
  }

  get hexColorA(): string {
    return this._hexColorA;
  }

  get hexColorB(): string {
    return this._hexColorB;
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

  @JsonProperty('color_gradient', ColorGradient)
  private _colorGradient = new ColorGradient();

  get name(): string {
    return this._name;
  }

  get label(): string {
    return this._label;
  }

  get count(): number {
    return this._count;
  }

  get colorGradient(): ColorGradient {
    return this._colorGradient;
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
  @JsonProperty('notifications', Count)
  private _notifications = new Count();

  @JsonProperty('tickets', Count)
  private _tickets = new Count();

  @JsonProperty('dues', Count)
  private _dues = new Count();

  get notifications(): Count {
    return this._notifications;
  }

  get tickets(): Count {
    return this._tickets;
  }

  get dues(): Count {
    return this._dues;
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
