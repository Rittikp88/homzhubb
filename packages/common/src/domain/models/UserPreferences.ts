import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';

export enum UserPreferencesKeys {
  CurrencyKey = 'currency',
  LanguageKey = 'language',
  FinancialYear = 'financial_year',
  MetricUnit = 'metric_unit',
  AccountDeactivated = 'account_deactivated',
  FaceId = 'face_id',
  Fingerprint = 'fingerprint',
  TwoFactorAuthentication = 'two_factor_authentication',
  Theme = 'theme',
  ShowLastName = 'show_last_name',
  ShowMobileNumber = 'showMobileNumber',
  ShowEmail = 'showEmail',
  AnalyseAppIssuesAndEvents = 'analyseAppIssuesAndEvents',
  PushNotifications = 'push_notifications',
  EmailsText = 'email',
  MessagesText = 'message',
  WebView = 'webview',
}

export interface IUserPreferences {
  currency: ICurrency;
  language: IUnit;
  financial_year: IUnit;
  metric_unit: IUnit;
  account_deactivated: boolean;
}

@JsonObject('UserPreferences')
export class UserPreferences {
  @JsonProperty('currency', Currency)
  private _currency = new Currency();

  @JsonProperty('language', Unit)
  private _language = new Unit();

  @JsonProperty('financial_year', Unit)
  private _financialYear = new Unit();

  @JsonProperty('metric_unit', String)
  private _metricUnit = '';

  @JsonProperty('account_deactivated', Boolean)
  private _accountDeactivated = false;

  @JsonProperty('face_id', Boolean, true)
  private _faceId = false;

  @JsonProperty('fingerprint', Boolean, true)
  private _fingerprint = false;

  @JsonProperty('two_factor_authentication', Boolean, true)
  private _twoFactorAuthentication = false;

  @JsonProperty('theme', String, true)
  private _theme = '';

  @JsonProperty('show_last_name', Boolean, true)
  private _showLastName = false;

  @JsonProperty('push_notifications', Boolean, true)
  private _pushNotifications = false;

  @JsonProperty('email', Boolean, true)
  private _email = false;

  @JsonProperty('message', Boolean, true)
  private _message = false;

  get currency(): string {
    return this._currency.currencyCode;
  }

  get faceId(): boolean {
    return this._faceId;
  }

  get fingerprint(): boolean {
    return this._fingerprint;
  }

  get twoFactorAuthentication(): boolean {
    return this._twoFactorAuthentication;
  }

  get theme(): string {
    return this._theme;
  }

  get showLastName(): boolean {
    return this._showLastName;
  }

  get pushNotifications(): boolean {
    return this._pushNotifications;
  }

  get email(): boolean {
    return this._email;
  }

  get message(): boolean {
    return this._message;
  }

  get language(): number {
    return this._language.id;
  }

  get financialYear(): number {
    return this._financialYear.id;
  }

  get metricUnit(): string {
    return this._metricUnit;
  }

  get accountDeactivated(): boolean {
    return this._accountDeactivated;
  }
}
