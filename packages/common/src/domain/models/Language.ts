import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Unit } from '@homzhub/common/src/domain/models/Unit';

export interface ILanguage {
  name: string;
  label: string;
  language_code: string;
}

@JsonObject('Language')
export class Language extends Unit {
  @JsonProperty('language_code', String)
  private _languageCode = '';

  get languageCode(): string {
    return this._languageCode;
  }
}
