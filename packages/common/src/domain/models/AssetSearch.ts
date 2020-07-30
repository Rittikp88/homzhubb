import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IProperties } from '@homzhub/common/src/domain/models/Search';

export interface IAssetSearch {
  count: number;
  links: ILinks;
  results: IProperties[];
}

export interface ILinks {
  next: string | null;
  previous: string | null;
}

@JsonObject('Links')
export class Links {
  @JsonProperty('next', String, true)
  private _next = '';

  @JsonProperty('previous', String, true)
  private _previous = '';

  get next(): string {
    return this._next;
  }

  get previous(): string {
    return this._previous;
  }
}

@JsonObject('AssetSearch')
export class AssetSearch {
  @JsonProperty('count', Number)
  private _count = 0;

  @JsonProperty('links', Links)
  private _links: Links = new Links();

  @JsonProperty('results', [Asset])
  private _results: Asset[] = [];

  get count(): number {
    return this._count;
  }

  get links(): Links {
    return this._links;
  }

  get results(): Asset[] {
    return this._results;
  }
}
