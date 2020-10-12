import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { LocationDetails } from '@homzhub/common/src/domain/models/LocationDetails';

@JsonObject('Address')
export class Address {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('address_line_1', String)
  private _addressLine1 = '';

  @JsonProperty('address_line_2', String)
  private _addressLine2 = '';

  @JsonProperty('postal_code', String)
  private _postalCode = '';

  @JsonProperty('is_primary', Boolean)
  private _isPrimary = false;

  @JsonProperty('location', LocationDetails)
  private _location = new LocationDetails();

  get id(): number {
    return this._id;
  }

  get addressLine1(): string {
    return this._addressLine1;
  }

  get addressLine2(): string {
    return this._addressLine2;
  }

  get postalCode(): string {
    return this._postalCode;
  }

  get isPrimary(): boolean {
    return this._isPrimary;
  }

  get location(): LocationDetails {
    return this._location;
  }
}
