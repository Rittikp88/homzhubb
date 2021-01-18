import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export enum UserRole {
  OWNER = 'OWNER',
  TENANT = 'TENANT',
}

export interface IUser {
  id?: number;
  full_name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone_code: string;
  phone_number: string;
  access_token: string;
  refresh_token: string;
  profile_picture?: string;
  rating?: number;
}

@JsonObject('User')
export class User {
  @JsonProperty('id', Number, true)
  private _id = 0;

  @JsonProperty('full_name', String, true)
  private _fullName = '';

  @JsonProperty('first_name', String, true)
  private _firstName = '';

  @JsonProperty('last_name', String, true)
  private _lastName = '';

  @JsonProperty('email', String, true)
  private _email = '';

  @JsonProperty('phone_code', String, true)
  private _countryCode = '';

  @JsonProperty('phone_number', String, true)
  private _phoneNumber = '';

  @JsonProperty('profile_picture', String, true)
  private _profilePicture = '';

  @JsonProperty('refresh_token', String, true)
  private _refreshToken = '';

  @JsonProperty('access_token', String, true)
  private _accessToken = '';

  @JsonProperty('rating', Number, true)
  private _rating = 0;

  get refreshToken(): string {
    return this._refreshToken;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get fullName(): string {
    return this._fullName;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
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

  get profilePicture(): string {
    return this._profilePicture;
  }
}
