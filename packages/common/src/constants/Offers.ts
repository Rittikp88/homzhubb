export enum MadeSort {
  NEWEST = 'NEWEST',
  LOW_HIGH = 'LOW_HIGH',
  HIGH_LOW = 'HIGH_LOW',
}

export enum OfferFilter {
  PENDING_ACTION = 'PENDING_ACTION',
  WAITING_PROSPECT = 'WAITING_PROSPECT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  REJECTED_PROSPECT = 'REJECTED_PROSPECT',
  EXPIRING = 'EXPIRING',
}

export enum OfferSort {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  BEST = 'BEST',
}

export const offerSortBy = [
  { label: 'Newest offer', value: 'NEWEST' },
  { label: 'Oldest offers', value: 'OLDEST' },
  { label: 'Best offer', value: 'BEST' },
];

export const offerMadeSortBy = [
  { label: 'Newest offer', value: MadeSort.NEWEST },
  { label: 'Price - low to high', value: MadeSort.LOW_HIGH },
  { label: 'Price - high to low', value: MadeSort.HIGH_LOW },
];

export const offerFilterBy = [
  { label: 'Pending action with me', value: OfferFilter.PENDING_ACTION },
  { label: 'Waiting for prospect', value: OfferFilter.WAITING_PROSPECT },
  { label: 'Accepted Offers', value: OfferFilter.ACCEPTED },
  { label: 'Rejected by me', value: OfferFilter.REJECTED },
  { label: 'Rejected by prospect', value: OfferFilter.REJECTED_PROSPECT },
  { label: 'Expiring soon (in 12 hours)', value: OfferFilter.EXPIRING },
];

export enum OffersVisitsType {
  offers = 'Offers',
  visits = 'Visits',
}
