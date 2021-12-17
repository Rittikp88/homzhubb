import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import {
  ISpaceInspectionAttachment,
  SpaceInspectionAttachment,
} from '@homzhub/common/src/domain/models/SpaceInspectionAttachment';

export interface ISpaceInspection {
  id: number;
  condition_of_space: number;
  comments: string;
  space_inspection_attachments: ISpaceInspectionAttachment[];
}

@JsonObject('SpaceInspection')
export class SpaceInspection {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('condition_of_space', Number)
  private _conditionOfSpace = 0;

  @JsonProperty('comments', String)
  private _comments = '';

  @JsonProperty('space_inspection_attachments', [SpaceInspectionAttachment])
  private _spaceInspectionAttachments = [];

  get id(): number {
    return this._id;
  }

  get conditionOfSpace(): number {
    return this._conditionOfSpace;
  }

  get comments(): string {
    return this._comments;
  }

  get spaceInspectionAttachments(): SpaceInspectionAttachment[] {
    return this._spaceInspectionAttachments;
  }
}
