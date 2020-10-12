import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Address } from '@homzhub/common/src/domain/models/Address';
import { EmergencyContact } from '@homzhub/common/src/domain/models/EmergencyContact';
import { User } from '@homzhub/common/src/domain/models/User';
import { WorkInfo } from '@homzhub/common/src/domain/models/WorkInfo';

@JsonObject('UserProfile')
export class UserProfile extends User {
  @JsonProperty('first_name', String)
  private _firstName = '';

  @JsonProperty('last_name', String)
  private _lastName = '';

  @JsonProperty('date_of_birth', String, true)
  private _dateOfBirth = '';

  @JsonProperty('email_verified', Boolean)
  private _emailVerified = false;

  @JsonProperty('social_image_url', String)
  private _socialImageUrl = '';

  @JsonProperty('profile_progress', Number)
  private _profileProgress = 0;

  @JsonProperty('referral_code', String)
  private _referralCode = '';

  @JsonProperty('user_address', [Address])
  private _userAddress = [new Address()];

  @JsonProperty('emergency_contact', EmergencyContact)
  private _emergencyContact = new EmergencyContact();

  @JsonProperty('work_info', WorkInfo)
  private _workInfo = new WorkInfo();

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get dateOfBirth(): string {
    return this._dateOfBirth;
  }

  get emailVerified(): boolean {
    return this._emailVerified;
  }

  get socialImageUrl(): string {
    return this._socialImageUrl;
  }

  get profileProgress(): number {
    return this._profileProgress;
  }

  get referralCode(): string {
    return this._referralCode;
  }

  get userAddress(): Address[] {
    return this._userAddress;
  }

  get emergencyContact(): EmergencyContact {
    return this._emergencyContact;
  }

  get workInfo(): WorkInfo {
    return this._workInfo ? this.workInfo : new WorkInfo();
  }
}
