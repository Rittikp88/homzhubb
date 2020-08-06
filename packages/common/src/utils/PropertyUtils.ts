import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { SpaceAvailableTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { IData } from '@homzhub/common/src/domain/models/Asset';

class PropertyUtils {
  public getAmenities = (
    spaces: IData[],
    floorNumber: number,
    name: string,
    carpetArea?: string,
    carpetAreaUnit?: string,
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

    const carpetAreaValue = carpetArea ? parseInt(carpetArea, 10).toLocaleString() : '-';

    const balcony: IData[] = spaces.filter((space: IData) => {
      return space.name === SpaceAvailableTypes.BALCONY;
    });

    const ordinalSuffix = (value: number): string => {
      return ['st', 'nd', 'rd'][((((value + 90) % 100) - 10) % 10) - 1] || 'th';
    };

    const bedFloor =
      name === 'Residential' && bedroom.length > 0 && bedroom[0].count
        ? bedroom[0].count.toString()
        : `${floorNumber}${isFullDetail ? ordinalSuffix(floorNumber) : ''}`;
    const baths = bathroom.length > 0 && bathroom[0].count ? bathroom[0].count.toString() : '-';
    const balconies = balcony.length > 0 && balcony[0].count ? balcony[0].count.toString() : '-';
    amenities = [
      {
        icon: name === 'Residential' ? icons.bed : icons.floor,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: isFullDetail ? (name === 'Residential' ? `${bedFloor} Beds` : `${bedFloor} Floor`) : bedFloor,
      },
      {
        icon: name === 'Residential' ? icons.bathTub : icons.washroom,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: isFullDetail ? (name === 'Residential' ? `${baths} Baths` : `${baths} Washrooms`) : baths,
      },
    ];

    if (carpetArea && parseInt(carpetAreaValue, 10) !== 0) {
      amenities.push({
        icon: icons.area,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: isFullDetail ? `${carpetAreaValue} ${carpetAreaUnit}` : carpetAreaValue,
      });
    }

    if (balcony.length > 0) {
      amenities.push({
        icon: icons.balcony,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: isFullDetail ? `${balconies} Balcony` : balconies,
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
    postedOn: string,
    availableFrom: string,
    transaction_type: number
  ): any[] => {
    const currentDay = new Date();
    const availableFromDate = new Date(availableFrom);
    const formattedAvailableFrom = DateUtils.getDisplayDate(availableFrom, 'DD MMM YYYY');
    const postedOnDisplayDate = DateUtils.getDisplayDate(postedOn, 'DD MMM YYYY');
    const availableFromDisplayDate = availableFromDate < currentDay ? 'Immediately' : formattedAvailableFrom;
    switch (transaction_type) {
      // 0 - RENT and 1 - BUY
      case 0:
        return [
          { label: 'Posted on', value: postedOnDisplayDate },
          { label: 'Available from', value: availableFromDisplayDate },
        ];
      case 1:
        return [
          { label: 'Posted on', value: postedOnDisplayDate },
          { label: 'Possession', value: availableFromDisplayDate },
          { label: 'Tenanted till', value: postedOnDisplayDate },
        ];
      default:
        return [];
    }
  };
}

const propertyUtils = new PropertyUtils();
export { propertyUtils as PropertyUtils };
