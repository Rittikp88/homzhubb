import { PickerItemProps } from 'react-native';
import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';

@JsonObject('ReceivedOfferFilter')
export class ReceivedOfferFilter {
  @JsonProperty('assets', [VisitAssetDetail])
  private _assets = [];

  @JsonProperty('listing', [Unit])
  private _listing = [];

  @JsonProperty('country', [Country])
  private _country = [];

  get assets(): VisitAssetDetail[] {
    return this._assets;
  }

  get listing(): Unit[] {
    return this._listing;
  }

  get country(): Country[] {
    return this._country;
  }

  get assetsDropdownData(): PickerItemProps[] {
    return this.assets.map(
      (asset: VisitAssetDetail): PickerItemProps => {
        const { id, projectName } = asset;
        return { label: projectName, value: id };
      }
    );
  }

  get listingDropdownData(): PickerItemProps[] {
    return this.listing.map(
      (listData: Unit): PickerItemProps => {
        const { name, label } = listData;
        return { label, value: name };
      }
    );
  }

  get countryDropdownData(): PickerItemProps[] {
    return this.country.map(
      (country: Country): PickerItemProps => {
        const { name, id } = country;
        return { label: name, value: id };
      }
    );
  }
}
