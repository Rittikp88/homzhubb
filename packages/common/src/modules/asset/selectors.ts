import { groupBy } from 'lodash';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { AssetVisit, IVisitByKey } from '@homzhub/common/src/domain/models/AssetVisit';
import { IState } from '@homzhub/common/src/modules/interfaces';

const getAssetReviews = (state: IState): AssetReview | null => {
  const {
    asset: { reviews },
  } = state;

  if (!reviews) return null;

  return ObjectMapper.deserialize(AssetReview, reviews);
};

const getAsset = (state: IState): Asset | null => {
  const {
    asset: { asset },
  } = state;

  if (!asset) return null;
  return ObjectMapper.deserialize(Asset, asset);
};

const getLoadingState = (state: IState): boolean => {
  const {
    asset: {
      loaders: { asset },
    },
  } = state;
  return asset;
};

const getAssetDocuments = (state: IState): AssetDocument[] => {
  const {
    asset: { documents },
  } = state;
  if (documents.length <= 0) return [];
  return documents;
};

const getAssetVisits = (state: IState): AssetVisit[] => {
  const {
    asset: { visits },
  } = state;
  if (visits.length <= 0) return [];

  return ObjectMapper.deserializeArray(AssetVisit, visits);
};

const getAssetVisitsByDate = (state: IState): IVisitByKey[] => {
  const {
    asset: { visits },
  } = state;
  if (visits.length <= 0) return [];
  const data = ObjectMapper.deserializeArray(AssetVisit, visits);
  const groupData = groupBy(data, (results) => {
    return DateUtils.getUtcFormattedDate(results.startDate, 'DD-MMM-YYYY');
  });

  return Object.keys(groupData).map((date) => {
    const results = groupData[date];
    return {
      key: DateUtils.getUtcFormattedDate(date, 'DD, MMM YYYY'),
      results,
      totalVisits: data.length,
    };
  });
};

const getVisitsByAsset = (state: IState): IVisitByKey[][] => {
  const {
    asset: { visits },
  } = state;
  if (visits.length <= 0) return [];
  const data = ObjectMapper.deserializeArray(AssetVisit, visits);
  const groupData = groupBy(data, (results) => {
    const {
      asset: { projectName },
    } = results;
    return projectName;
  });

  return Object.keys(groupData).map((projectName) => {
    const results = groupBy(groupData[projectName], 'startDate');
    return Object.keys(results).map((key) => {
      const formattedData = results[key];
      return {
        key: projectName,
        results: formattedData,
      };
    });
  });
};

const getVisitIds = (state: IState): number[] => {
  const {
    asset: { visitIds },
  } = state;

  return visitIds;
};

const getVisitById = (state: IState): AssetVisit => {
  const {
    asset: { visitIds },
  } = state;

  const visits = getAssetVisits(state);

  let visitData = new AssetVisit();

  visits.forEach((visit) => {
    visitIds.forEach((id) => {
      if (id === visit.id) {
        visitData = visit;
      }
    });
  });

  return visitData;
};

const getVisitLoadingState = (state: IState): boolean => {
  const {
    asset: {
      loaders: { visits },
    },
  } = state;
  return visits;
};

export const AssetSelectors = {
  getAssetReviews,
  getAsset,
  getLoadingState,
  getAssetDocuments,
  getAssetVisits,
  getAssetVisitsByDate,
  getVisitsByAsset,
  getVisitById,
  getVisitIds,
  getVisitLoadingState,
};
