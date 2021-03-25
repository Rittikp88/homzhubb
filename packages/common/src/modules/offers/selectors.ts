import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { IOwnerProposalsLease, IOwnerProposalsSale } from '@homzhub/common/src/modules/offers/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';

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
      tenantPreferences,
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

export const OfferSelectors = {
  getOwnerProposalsRent,
  getOwnerProposalsSale,
};
