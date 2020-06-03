import { IState } from '@homzhub/common/src/modules/interfaces';
import { IPropertyDetailsData } from '@homzhub/common/src/domain/models/Property';

const getPropertyDetails = (state: IState): IPropertyDetailsData[] | null => {
  const {
    property: {
      propertyDetails: { propertyGroup },
    },
  } = state;
  return propertyGroup;
};

export const PropertySelector = {
  getPropertyDetails,
};
