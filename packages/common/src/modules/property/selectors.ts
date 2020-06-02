import { IState } from '@homzhub/common/src/modules/interfaces';

const getPropertyDetails = (state: IState): any => {
  const {
    property: {
      propertyDetails: { propertyGroup },
    },
  } = state;
  return propertyGroup;
};

const getPropertySpaceAvailable = (state: IState): any => {
  const {
    property: {
      propertyDetails: { propertyGroupSpaceAvailable },
    },
  } = state;
  return propertyGroupSpaceAvailable ?? [];
};

export const PropertySelector = {
  getPropertyDetails,
  getPropertySpaceAvailable,
};
