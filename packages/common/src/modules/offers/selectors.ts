import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { ICheckboxGroupData } from '@homzhub/common/src/components/molecules/CheckboxGroup';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  ICurrentOffer,
  IOfferCompare,
  IOwnerProposalsLease,
  IOwnerProposalsSale,
} from '@homzhub/common/src/modules/offers/interfaces';

const getOwnerProposalsRent = (state: IState): IOwnerProposalsLease | null => {
  const asset = AssetSelectors.getAsset(state);
  if (asset && asset?.leaseTerm) {
    const {
      expectedPrice,
      securityDeposit,
      minimumLeasePeriod,
      maximumLeasePeriod,
      annualRentIncrementPercentage,
      availableFromDate,
      maintenancePaidBy,
      utilityPaidBy,
      tenantPreferences,
    } = asset.leaseTerm;
    return {
      expectedPrice: `${expectedPrice}`,
      securityDeposit: `${securityDeposit}`,
      minimumLeasePeriod,
      maximumLeasePeriod,
      annualRentIncrementPercentage: annualRentIncrementPercentage ? `${annualRentIncrementPercentage}` : '',
      availableFromDate,
      maintenancePaidBy,
      utilityPaidBy,
      tenantPreferences: tenantPreferences.map((item) => ({ id: item.id, label: item.name, isSelected: true })),
    };
  }
  return null;
};

const getOwnerProposalsSale = (state: IState): IOwnerProposalsSale | null => {
  const asset = AssetSelectors.getAsset(state);
  if (asset && asset?.saleTerm) {
    const { expectedPrice, expectedBookingAmount } = asset.saleTerm;
    return {
      expectedPrice: `${expectedPrice}`,
      expectedBookingAmount: `${expectedBookingAmount}`,
    };
  }
  return null;
};

const getOfferPayload = (state: IState): ICurrentOffer | null => {
  const {
    offer: { currentOffer },
  } = state;

  return currentOffer;
};

const getOfferCompareData = (state: IState): IOfferCompare => {
  const {
    offer: { compareData },
  } = state;

  return compareData;
};

const getListingDetail = (state: IState): Asset | null => {
  const {
    offer: { listingDetail },
  } = state;
  if (!listingDetail) return null;
  return ObjectMapper.deserialize(Asset, listingDetail);
};

const getNegotiations = (state: IState): Offer[] => {
  const {
    offer: { negotiations },
  } = state;
  if (!negotiations.length) return [];
  return ObjectMapper.deserializeArray(Offer, negotiations);
};

const getFormattedTenantPreferences = (state: IState, value = true): ICheckboxGroupData[] => {
  const asset = AssetSelectors.getAsset(state);
  if (asset && asset.leaseTerm?.tenantPreferences) {
    return asset.leaseTerm?.tenantPreferences.map((item) => ({
      id: item.id,
      label: item.name,
      isSelected: value,
    }));
  }
  return [];
};

export const OfferSelectors = {
  getOwnerProposalsRent,
  getOwnerProposalsSale,
  getListingDetail,
  getOfferPayload,
  getNegotiations,
  getOfferCompareData,
  getFormattedTenantPreferences,
};
