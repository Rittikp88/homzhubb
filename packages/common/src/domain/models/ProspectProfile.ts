import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface IProspectProfile {
  jobType: IUnit;
  companyName: string;
  workEmail: string;
  occupants: number;
  tenantType: IUnit;
}

@JsonObject('ProspectProfile')
export class ProspectProfile {
  @JsonProperty('job_type', Unit)
  private _jobType = new Unit();

  @JsonProperty('company_name', String)
  private _companyName = '';

  @JsonProperty('work_email', String)
  private _workEmail = '';

  @JsonProperty('number_of_occupants', Number)
  private _occupants = 0;

  @JsonProperty('tenant_type', Unit)
  private _tenantType = new Unit();

  get jobType(): Unit {
    return this._jobType;
  }

  get workEmail(): string {
    return this._workEmail;
  }

  get companyName(): string {
    return this._companyName;
  }

  get occupants(): number {
    return this._occupants;
  }

  get tenantType(): Unit {
    return this._tenantType;
  }
}
