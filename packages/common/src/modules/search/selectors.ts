import { PickerItemProps } from 'react-native';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  IFilterDetails,
  IFilter,
  ICurrency,
  ITransactionRange,
  ITransactionType,
} from '@homzhub/common/src/domain/models/Search';

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

const getLoadingState = (state: IState): boolean => {
  const {
    search: {
      loaders: { search },
    },
  } = state;
  return search;
};

const getCurrencyData = (state: IState): PickerItemProps[] => {
  const {
    search: { filterDetails },
  } = state;
  if (!filterDetails) {
    return [];
  }
  return filterDetails.currency.map((item: ICurrency) => {
    return {
      label: item.currency_code,
      value: item.currency_code,
    };
  });
};

const getPriceRange = (state: IState): ITransactionRange => {
  const {
    search: { filterDetails, filter },
  } = state;
  let priceRange = { min: 0, max: 10 };

  if (filterDetails) {
    const {
      filters: { transaction_type },
    } = filterDetails;

    transaction_type.forEach((item: ITransactionType, index: number) => {
      if (index === filter.asset_transaction_type) {
        priceRange = { min: item.min_price, max: item.max_price };
      }
    });
  }

  return priceRange;
};

export const SearchSelector = {
  getProperties,
  getFilterDetail,
  getFilters,
  getLoadingState,
  getCurrencyData,
  getPriceRange,
};
