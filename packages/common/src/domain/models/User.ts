import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IUser {
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  access_token: string;
  refresh_token: string;
}

@JsonObject('User')
export class User {
  @JsonProperty('full_name', String)
  private fullName = '';

  @JsonProperty('email', String)
  private _email = '';

  @JsonProperty('country_code', String)
  private countryCode = '';

  @JsonProperty('phone_number', String)
  private phoneNumber = '';

  @JsonProperty('refresh_token', String)
  private _refreshToken = '';

  @JsonProperty('access_token', String)
  private _accessToken = '';

  get refreshToken(): string {
    return this._refreshToken;
  }

  get accessToken(): string {
    return this._accessToken;
  }
}
