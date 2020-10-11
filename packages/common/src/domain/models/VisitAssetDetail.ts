import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IVisitAssetDetail {
  id: number;
  project_name: string;
  address: string;
}

@JsonObject('VisitAssetDetail')
export class VisitAssetDetail {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('project_name', String)
  private _projectName = '';

  @JsonProperty('address', String)
  private _address = '';

  get id(): number {
    return this._id;
  }

  get projectName(): string {
    return this._projectName;
  }

  get address(): string {
    return this._address;
  }
}
