import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { LocationDetails } from '@homzhub/common/src/domain/models/LocationDetails';

@JsonObject('Company')
export class Company {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('long_name', String)
  private _longName = '';

  @JsonProperty('email_domain', String)
  private _emailDomain = '';

  @JsonProperty('hq_address_line_1', String)
  private _hqAddressLine1 = '';

  @JsonProperty('hq_address_line_2', String)
  private _hqAddressLine2 = '';

  @JsonProperty('postal_code', String)
  private _postalCode = '';

  @JsonProperty('location', LocationDetails)
  private _location = new LocationDetails();
}
