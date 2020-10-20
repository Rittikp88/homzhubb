import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { SpaceAvailableTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { IData } from '@homzhub/common/src/domain/models/Asset';
import { UpcomingSlot } from '@homzhub/common/src/domain/models/UpcomingSlot';
import { ISlotItem } from '@homzhub/common/src/domain/models/AssetVisit';
import { SaleTerm } from '@homzhub/common/src/domain/models/SaleTerm';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { TimeSlot } from '@homzhub/common/src/constants/ContactFormData';

class PropertyUtils {
  public getAmenities = (
    spaces: IData[],
    furnishing: string,
    code: AssetGroupTypes,
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

    const openParking: IData[] = spaces.filter((space: IData) => {
      return space.name === SpaceAvailableTypes.OPEN_PARKING;
    });

    const bedRoom = bedroom.length > 0 && bedroom[0].count ? bedroom[0].count.toString() : '-';

    const baths = bathroom.length > 0 && bathroom[0].count ? bathroom[0].count.toString() : '-';

    const parking = openParking.length > 0 && openParking[0].count ? openParking[0].count.toString() : '-';

    if (code === AssetGroupTypes.RES) {
      amenities.push({
        icon: icons.bed,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: isFullDetail ? `${bedRoom} Beds` : bedRoom,
      });
      amenities.push({
        icon: icons.bathTub,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: isFullDetail ? `${baths} Baths` : baths,
      });
    } else {
      amenities.push({
        icon: icons.furnishing,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: furnishing,
      });
      amenities.push({
        icon: icons.openParking,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: parking,
      });
    }

    amenities.push({
      icon: icons.area,
      iconSize: 20,
      iconColor: theme.colors.darkTint3,
      label: isFullDetail && carpetArea && carpetArea > 0 ? `${carpetArea} ${carpetAreaUnit}` : '-',
    });

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
    const date = DateUtils.getDisplayDate(formattedStartDate[0], 'D ddd');
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
    const formattedDate = DateUtils.getDisplayDate(startDate[0], 'D dddd');
    const date = DateUtils.getDateString(formattedDate);

    const timeObj = TimeSlot.find((item) => item.from === startTime);
    const time = timeObj?.formatted.split('-') ?? [''];

    return `Join next visit at ${time[0].trim()}, ${date}`;
  };
}

const propertyUtils = new PropertyUtils();
export { propertyUtils as PropertyUtils };
