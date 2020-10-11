import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export enum UserRole {
  OWNER = 'OWNER',
  TENANT = 'TENANT',
}

export interface IUser {
  id?: number;
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  access_token?: string;
  refresh_token?: string;
  rating?: number;
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

  @JsonProperty('id', Number, true)
  private _id = 0;

  @JsonProperty('rating', Number, true)
  private _rating = 0;

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

  get id(): number {
    return this._id;
  }

  get rating(): number {
    return this._rating;
  }
}
