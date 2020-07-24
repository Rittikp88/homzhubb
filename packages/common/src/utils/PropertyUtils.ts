import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { SpaceAvailableTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { IAmenitiesIcons, IProperties, ISpaces } from '@homzhub/common/src/domain/models/Search';

class PropertyUtils {
  public getAmenities = (property: IProperties): IAmenitiesIcons[] => {
    const {
      carpet_area,
      carpet_area_unit,
      spaces,
      floor_number,
      asset_group: { name },
    } = property;

    let amenities: IAmenitiesIcons[] = [];
    const bedroom: ISpaces[] = spaces.filter((space: ISpaces) => {
      return space.name === SpaceAvailableTypes.BEDROOM;
    });

    const bathroom: ISpaces[] = spaces.filter((space: ISpaces) => {
      return space.name === SpaceAvailableTypes.BATHROOM;
    });

    const carpetArea = `${carpet_area} ${carpet_area_unit}`
      ? `${carpet_area.toLocaleString()} ${carpet_area_unit}`
      : '-';

    const balcony: ISpaces[] = spaces.filter((space: ISpaces) => {
      return space.name === SpaceAvailableTypes.BALCONY;
    });

    amenities = [
      {
        icon: name === 'Residential' ? icons.bed : icons.floor,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: name === 'Residential' && bedroom.length > 0 ? bedroom[0].count.toString() : floor_number.toString(),
      },
      {
        icon: name === 'Residential' ? icons.bathTub : icons.washroom,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: bathroom.length > 0 ? bathroom[0].count.toString() : '-',
      },
    ];

    if (carpet_area) {
      amenities.push({
        icon: icons.area,
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: carpetArea,
      });
    }

    if (balcony.length > 0) {
      amenities.push({
        icon: icons.homeCalculus, // TODO: Need to change once icon is update in style-guide
        iconSize: 20,
        iconColor: theme.colors.darkTint3,
        label: balcony[0].count.toString(),
      });
    }

    return amenities;
  };
}

const propertyUtils = new PropertyUtils();
export { propertyUtils as PropertyUtils };
