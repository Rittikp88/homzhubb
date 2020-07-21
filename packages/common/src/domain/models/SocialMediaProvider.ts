import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ISocialMediaProvider {
  provider: string;
  description: string;
  clientID: string;
}

@JsonObject('SocialMediaProvider')
export class SocialMediaProvider {
  @JsonProperty('provider', String)
  private _provider = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('client_id', String)
  private _clientID = '';

  get provider(): string {
    return this._provider;
  }

  get description(): string {
    return this._description;
  }

  get clientID(): string {
    return this._clientID;
  }
}
