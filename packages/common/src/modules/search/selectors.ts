import { IState } from '@homzhub/common/src/modules/interfaces';
import { IPropertiesObject, IFilterDetails, IProperties } from '@homzhub/common/src/domain/models/Search';

const getFilterDetail = (state: IState): IFilterDetails | null => {
  const {
    search: { filterDetails },
  } = state;
  return filterDetails;
};

const getProperties = (state: IState): IPropertiesObject => {
  const {
    search: { properties },
  } = state;
  return properties;
};

const getPropertiesArray = (state: IState): IProperties[] => {
  const properties = getProperties(state);
  return Object.values(properties);
};

export const SearchSelector = {
  getProperties,
  getFilterDetail,
  getPropertiesArray,
};
