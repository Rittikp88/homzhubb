import { IState } from '@homzhub/common/src/modules/interfaces';
import { IPropertyDetailsData, IRentServiceList } from '@homzhub/common/src/domain/models/Property';

const getPropertyDetails = (state: IState): IPropertyDetailsData[] | null => {
  const {
    property: {
      propertyDetails: { propertyGroup },
    },
  } = state;
  return propertyGroup;
};

const getRentServicesList = (state: IState): IRentServiceList[] | null => {
  const {
    property: {
      propertyDetails: { rentServices },
    },
  } = state;
  return rentServices;
};

export const PropertySelector = {
  getPropertyDetails,
  getRentServicesList,
};
