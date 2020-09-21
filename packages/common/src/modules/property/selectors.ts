import { IState } from '@homzhub/common/src/modules/interfaces';

const getPropertyDetails = (state: IState): any => {
  const {
    property: {
      propertyDetails: { propertyGroup },
    },
  } = state;
  return propertyGroup;
};

const getCurrentPropertyId = (state: IState): number => {
  const {
    property: { currentPropertyId },
  } = state;
  return currentPropertyId;
};

const getTermId = (state: IState): number => {
  const {
    property: { termId },
  } = state;
  return termId;
};

const getPropertyLoadingState = (state: IState): boolean => {
  const {
    property: {
      loaders: { property },
    },
  } = state;
  return property;
};

export const PropertySelector = {
  getPropertyDetails,
  getCurrentPropertyId,
  getTermId,
  getPropertyLoadingState,
};
