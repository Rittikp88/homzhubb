import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('Property')
export class Property {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('project_name', String)
  private _projectName = '';

  get id(): number {
    return this._id;
  }

  get projectName(): string {
    return this._projectName;
  }
}
