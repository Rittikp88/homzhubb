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
