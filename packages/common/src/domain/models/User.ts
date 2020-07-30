import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IUser {
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  access_token?: string;
  refresh_token?: string;
}

@JsonObject('User')
export class User {
  @JsonProperty('full_name', String)
  private _fullName = '';

  @JsonProperty('email', String)
  private _email = '';

  @JsonProperty('country_code', String)
  private _countryCode = '';

  @JsonProperty('phone_number', String)
  private _phoneNumber = '';

  @JsonProperty('refresh_token', String, true)
  private _refreshToken = '';

  @JsonProperty('access_token', String, true)
  private _accessToken = '';

  get refreshToken(): string {
    return this._refreshToken;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get fullName(): string {
    return this._fullName ?? '';
  }

  get email(): string {
    return this._email;
  }

  get countryCode(): string {
    return this._countryCode;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }
}
