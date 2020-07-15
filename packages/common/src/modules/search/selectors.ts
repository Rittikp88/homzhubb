import { IState } from '@homzhub/common/src/modules/interfaces';
import { IPropertiesObject } from '@homzhub/common/src/domain/models/Search';

const getProperties = (state: IState): IPropertiesObject => {
  const {
    search: { properties },
  } = state;
  return properties;
};

export const SearchSelector = {
  getProperties,
};
