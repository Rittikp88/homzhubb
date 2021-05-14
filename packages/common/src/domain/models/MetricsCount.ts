import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Count } from '@homzhub/common/src/domain/models/Count';

@JsonObject('MetricsCount')
export class MetricsCount {
  @JsonProperty('count', Number)
  private _count = 0;

  @JsonProperty('open', Count, true)
  private _open = new Count();

  @JsonProperty('closed', Count, true)
  private _closed = new Count();

  @JsonProperty('message', Count, true)
  private _message = new Count();

  @JsonProperty('offer', Count, true)
  private _offer = new Count();

  @JsonProperty('site_visit', Count, true)
  private _siteVisit = new Count();

  get count(): number {
    return this._count;
  }

  get open(): Count {
    return this._open;
  }

  get closed(): Count {
    return this._closed;
  }

  get offer(): Count {
    return this._offer;
  }

  get message(): Count {
    return this._message;
  }

  get siteVisit(): Count {
    return this._siteVisit;
  }
}