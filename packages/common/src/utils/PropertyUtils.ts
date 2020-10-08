import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { SpaceAvailableTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { ISlotItem } from '@homzhub/mobile/src/components/molecules/TimeSlotGroup';
import { IData } from '@homzhub/common/src/domain/models/Asset';
import { UpcomingSlot } from '@homzhub/common/src/domain/models/AssetVisit';
import { SaleTerm } from '@homzhub/common/src/domain/models/SaleTerm';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { TimeSlot } from '@homzhub/common/src/constants/ContactFormData';

class PropertyUtils {
  public getAmenities = (
    spaces: IData[],
    floorNumber: number,
    name: string,
    carpetArea?: number | null,
    carpetAreaUnit?: string | null,
    isFullDetail?: boolean
  ): IAmenitiesIcons[] => {
    const amenities: IAmenitiesIcons[] = [];
    if (spaces.length === 0) {
      return [];
    }
    const bedroom: IData[] = spaces.filter((space: IData) => {
      return space.name === SpaceAvailableTypes.BEDROOM;
    });

    const bathroom: IData[] = spaces.filter((space: IData) => {
      return space.name === SpaceAvailableTypes.BATHROOM;
    });

    const carpetAreaValue = carpetArea ? carpetArea.toLocaleString() : '-';

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

    if ((name === 'Residential' && bedroom.length > 0) || floorNumber > 0) {
      amenities.push({
        icon: name === 'Residential' ? icons.bed : icons.floor,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: isFullDetail ? (name === 'Residential' ? `${bedFloor} Beds` : `${bedFloor} Floor`) : bedFloor,
      });
    }

    if (bathroom.length > 0) {
      amenities.push({
        icon: name === 'Residential' ? icons.bathTub : icons.washroom,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: isFullDetail ? (name === 'Residential' ? `${baths} Baths` : `${baths} Washrooms`) : baths,
      });
    }

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

  public getPropertyTimelineData = (
    name: string,
    postedOn: string,
    availableFrom: string,
    transaction_type: number,
    saleTerm: SaleTerm | null
  ): { label: string; value: string }[] => {
    const currentDay = new Date();
    const availableFromDate = new Date(availableFrom);
    const formattedAvailableFrom = DateUtils.getDisplayDate(availableFrom, 'DD MMM YYYY');
    const postedOnDisplayDate = DateUtils.getDisplayDate(postedOn, 'DD MMM YYYY');
    const tenantedTillDisplayDate = DateUtils.getDisplayDate(saleTerm?.tenantedTill ?? '', 'DD MMM YYYY');
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
          { label: 'Tenanted till', value: tenantedTillDisplayDate ?? '-' },
        ];
      default:
        return [];
    }
  };

  public getUpcomingSlotsData = (slot: UpcomingSlot): { date: string; time: ISlotItem } | null => {
    const formattedStartDate = DateUtils.convertTimeFormat(slot.start_date, 'YYYY-MM-DD HH');

    const startTime = Number(formattedStartDate[1]);
    const date = DateUtils.getDateWithWeekDay(formattedStartDate[0], 'D ddd');
    const time = TimeSlot.find((item) => item.from === startTime);
    if (time && date) {
      return {
        date,
        time,
      };
    }
    return null;
  };

  // TODO: (Shikha) - Move constants to en.json
  public getUpcomingSlotMessage = (slot: UpcomingSlot): string => {
    if (!slot) {
      return 'Join next visit';
    }
    const { start_date } = slot;
    const startDate = DateUtils.convertTimeFormat(start_date, 'YYYY-MM-DD HH');

    const startTime = Number(startDate[1]);
    const formattedDate = DateUtils.getDateWithWeekDay(startDate[0], 'D ddd');
    const date = DateUtils.getDateString(formattedDate);

    const timeObj = TimeSlot.find((item) => item.from === startTime);
    const time = timeObj?.formatted.split('-') ?? [''];

    return `Join next visit at ${time[0].trim()}, ${date}`;
  };
}

const propertyUtils = new PropertyUtils();
export { propertyUtils as PropertyUtils };
