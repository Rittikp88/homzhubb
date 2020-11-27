import { PickerItemProps } from 'react-native';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Point } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  IFilterDetails,
  IFilter,
  ICurrency,
  ITransactionRange,
  ITransactionType,
} from '@homzhub/common/src/domain/models/Search';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';

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

const getProperties = (state: IState): AssetSearch => {
  const {
    search: { properties },
  } = state;
  return ObjectMapper.deserialize(AssetSearch, properties);
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

const getSearchLocationLatLong = (state: IState): Point => {
  const {
    search: {
      filter: { search_latitude, search_longitude },
    },
  } = state;

  return {
    lat: search_latitude ?? 0,
    lng: search_longitude ?? 0,
  };
};

const getSearchAddress = (state: IState): string => {
  const {
    search: {
      filter: { search_address },
    },
  } = state;

  return search_address ?? '';
};

export const SearchSelector = {
  getProperties,
  getFilterDetail,
  getFilters,
  getLoadingState,
  getCurrencyData,
  getPriceRange,
  getSearchLocationLatLong,
  getSearchAddress,
};
