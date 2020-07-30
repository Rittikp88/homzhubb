import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { SpaceAvailableTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { IData } from '@homzhub/common/src/domain/models/Asset';
import { LeaseTerms } from '@homzhub/common/src/domain/models/LeaseTerms';
import { SaleTerms } from '@homzhub/common/src/domain/models/SaleTerms';

class PropertyUtils {
  public getAmenities = (
    carpet_area: string,
    carpet_area_unit: string,
    spaces: IData[],
    floor_number: number,
    name: string,
    isFullDetail?: boolean
  ): IAmenitiesIcons[] => {
    let amenities: IAmenitiesIcons[] = [];
    if (spaces.length === 0) {
      return [];
    }
    const bedroom: IData[] = spaces.filter((space: IData) => {
      return space.name === SpaceAvailableTypes.BEDROOM;
    });

    const bathroom: IData[] = spaces.filter((space: IData) => {
      return space.name === SpaceAvailableTypes.BATHROOM;
    });

    const carpetArea = `${carpet_area} ${carpet_area_unit}`
      ? `${parseInt(carpet_area, 10).toLocaleString()} ${carpet_area_unit}`
      : '-';

    const balcony: IData[] = spaces.filter((space: IData) => {
      return space.name === SpaceAvailableTypes.BALCONY;
    });

    const bedFloor =
      name === 'Residential' && bedroom.length > 0 ? bedroom[0].count.toString() : floor_number.toString();
    const baths = bathroom.length > 0 ? bathroom[0].count.toString() : '-';

    amenities = [
      {
        icon: name === 'Residential' ? icons.bed : icons.floor,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: isFullDetail ? (name === 'Residential' ? `${bedFloor} Beds` : `${bedFloor}th Floor`) : bedFloor,
      },
      {
        icon: name === 'Residential' ? icons.bathTub : icons.washroom,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: isFullDetail ? (name === 'Residential' ? `${baths} Baths` : `${baths} Washrooms`) : baths,
      },
    ];

    if (parseInt(carpet_area, 10) !== 0) {
      amenities.push({
        icon: icons.area,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: carpetArea,
      });
    }

    if (balcony.length > 0) {
      amenities.push({
        icon: icons.balcony,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: balcony[0].count ? `${balcony[0].count.toString()}` : '-',
      });
    }

    return amenities;
  };

  public getAreaUnit = (unit: string, value: number): string => {
    const newValue = value.toFixed(2);
    switch (unit) {
      case 'SQ_FT':
        return `${newValue}Sqft`;
      case 'SQ_YARD':
        return `${newValue}SqYard`;
      default:
        return `${newValue.toLocaleString()}${unit}`;
    }
  };

  // TODO: (Shikha) - Need to add proper data once api integrate
  public getPropertyTimelineData = (
    name: string,
    leaseTerm: LeaseTerms | null,
    saleTerm: SaleTerms | null,
    postedOn: string,
    availableFrom: string | null
  ): any[] => {
    switch (name) {
      case 'Residential':
        if (leaseTerm) {
          return [
            { label: 'Posted on', value: postedOn },
            { label: 'Available from', value: availableFrom },
          ];
        }
        return [
          { label: 'Posted on', value: postedOn },
          { label: 'Possession', value: availableFrom },
          { label: 'Tenanted till', value: 'Immediately' },
        ];

      case 'Commercial':
        if (leaseTerm) {
          return [
            { label: 'Posted on', value: postedOn },
            { label: 'Available from', value: availableFrom },
          ];
        }
        return [
          { label: 'Posted on', value: postedOn },
          { label: 'Available from', value: availableFrom },
          { label: 'Tenanted till', value: 'Immediatily' },
        ];

      default:
        return [];
    }
  };
}

const propertyUtils = new PropertyUtils();
export { propertyUtils as PropertyUtils };
