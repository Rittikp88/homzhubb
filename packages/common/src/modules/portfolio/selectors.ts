import { IState } from '@homzhub/common/src/modules/interfaces';
import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { TenantHistory } from '@homzhub/common/src/domain/models/TenantHistory';

const getTenancies = (state: IState): Asset[] | null => {
  const {
    portfolio: { tenancies },
  } = state;

  if (!tenancies) return null;
  return Object.values(tenancies);
};

const getProperties = (state: IState): Asset[] | null => {
  const {
    portfolio: { properties },
  } = state;

  if (!properties) return null;
  return Object.values(properties);
};

const getTenanciesLoadingState = (state: IState): boolean => {
  const {
    portfolio: {
      loaders: { tenancies },
    },
  } = state;
  return tenancies;
};

const getPropertiesLoadingState = (state: IState): boolean => {
  const {
    portfolio: {
      loaders: { properties },
    },
  } = state;
  return properties;
};

const getCurrentAssetId = (state: IState): number => {
  const {
    portfolio: { currentAsset },
  } = state;

  return currentAsset.id;
};

const getAssetById = (state: IState): Asset | null => {
  const {
    portfolio: { currentAsset, tenancies, properties },
  } = state;
  if (!tenancies || !properties) return null;

  if (currentAsset.dataType === DataType.TENANCIES) {
    return tenancies[currentAsset.id];
  }
  return properties[currentAsset.id];
};

const getTenantHistory = (state: IState): TenantHistory[] | null => {
  const {
    portfolio: { tenantHistory },
  } = state;
  if (!tenantHistory) return null;
  return tenantHistory;
};

const getCurrentFilter = (state: IState): Filters => {
  const {
    portfolio: { currentFilter },
  } = state;

  return currentFilter;
};

export const PortfolioSelectors = {
  getTenancies,
  getProperties,
  getTenanciesLoadingState,
  getPropertiesLoadingState,
  getCurrentAssetId,
  getAssetById,
  getTenantHistory,
  getCurrentFilter,
};
