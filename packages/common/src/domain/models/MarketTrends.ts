import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ILinks, Links } from '@homzhub/common/src/domain/models/PaginationLinks';

export interface IMarketTrends {
  count: number;
  links: ILinks;
  results: IMarketTrendsResults[];
}

export interface IMarketTrendsResults {
  id: number;
  title: string;
  posted_at: string;
  link: string;
}

@JsonObject('MarketTrendsResults')
export class MarketTrendsResults {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('title', String)
  private _title = '';

  @JsonProperty('posted_at', String)
  private _postedAt = '';

  @JsonProperty('link', String)
  private _link = '';

  @JsonProperty('image_url', String)
  private _imageUrl = '';

  @JsonProperty('trend_type', String)
  private _trendType = '';

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get postedAt(): string {
    return this._postedAt;
  }

  get postedAtDate(): string {
    return DateUtils.getDateFromISO(this._postedAt, 'DD/MM/YYYY');
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get trendType(): string {
    return this._trendType;
  }

  get link(): string {
    return this._link;
  }
}

@JsonObject('MarketTrends')
export class MarketTrends {
  @JsonProperty('count', Number)
  private _count = 0;

  @JsonProperty('links', Links)
  private _links: Links = new Links();

  @JsonProperty('results', [MarketTrendsResults])
  private _results: MarketTrendsResults[] = [];

  get count(): number {
    return this._count;
  }

  get links(): Links {
    return this._links;
  }

  get results(): MarketTrendsResults[] {
    return this._results;
  }
}
