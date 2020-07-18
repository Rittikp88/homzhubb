import { IState } from '@homzhub/common/src/modules/interfaces';
import { IFilterDetails, IFilter } from '@homzhub/common/src/domain/models/Search';

const getFilterDetail = (state: IState): IFilterDetails | null => {
  const {
    search: { filterDetails },
  } = state;
  return filterDetails;
};

const getFilters = (state: IState): IFilter => {
  const {
    search: { filter },
  } = state;
  return filter;
};

const getProperties = (state: IState): any => {
  const {
    search: { properties },
  } = state;
  return properties;
};

export const SearchSelector = {
  getProperties,
  getFilterDetail,
  getFilters,
};
