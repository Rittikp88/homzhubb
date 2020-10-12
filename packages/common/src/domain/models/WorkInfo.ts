import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Company } from '@homzhub/common/src/domain/models/Company';

@JsonObject('WorkInfo')
export class WorkInfo {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('company_name', String)
  private _companyName = '';

  @JsonProperty('work_email', String)
  private _workEmail = '';

  @JsonProperty('work_employee_id', String)
  private _workEmployeeId = '';

  @JsonProperty('company', Company)
  private _company = new Company();

  get id(): number {
    return this._id;
  }

  get companyName(): string {
    return this._companyName;
  }

  get workEmail(): string {
    return this._workEmail;
  }

  get workEmployeeId(): string {
    return this._workEmployeeId;
  }

  get company(): Company {
    return this._company;
  }
}
