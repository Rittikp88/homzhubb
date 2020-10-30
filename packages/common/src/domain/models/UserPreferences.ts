import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { ILanguage, Language } from '@homzhub/common/src/domain/models/Language';

export enum UserPreferencesKeys {
  CurrencyKey = 'currency',
  LanguageKey = 'language',
  FinancialYear = 'financial_year',
  MetricUnit = 'metric_unit',
  AccountDeactivated = 'account_deactivated',
}

export interface IUserPreferences {
  currency: ICurrency;
  language: ILanguage;
  financial_year: IUnit;
  metric_unit: IUnit;
  account_deactivated: boolean;
}

@JsonObject('UserPreferences')
export class UserPreferences {
  @JsonProperty('currency', Currency)
  private _currency = new Currency();

  @JsonProperty('language', Language)
  private _language = new Language();

  @JsonProperty('financial_year', Unit)
  private _financialYear = new Unit();

  @JsonProperty('metric_unit', Unit)
  private _metricUnit = new Unit();

  @JsonProperty('account_deactivated', Boolean)
  private _accountDeactivated = false;

  get currency(): string {
    return this._currency.currencyCode;
  }

  get language(): string {
    return this._language.name;
  }

  get financialYear(): string {
    return this._financialYear.name;
  }

  get metricUnit(): string {
    return this._metricUnit.name;
  }

  get accountDeactivated(): boolean {
    return this._accountDeactivated;
  }
}
