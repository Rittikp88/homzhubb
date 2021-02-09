import { cloneDeep, findIndex } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ExistingVerificationDocuments } from '@homzhub/common/src/domain/models/VerificationDocuments';
import { IRoutes } from '@homzhub/common/src/constants/Tabs';

export interface IDocsProps {
  document?: ExistingVerificationDocuments;
  existingDocuments?: ExistingVerificationDocuments[];
  localDocuments?: ExistingVerificationDocuments[];
  clonedDocuments?: ExistingVerificationDocuments[];
  key?: string;
  propertyId?: number;
  isLocalDocument?: boolean;
}

export interface IListingUpdate {
  isStepDone?: boolean[];
  isNextStep?: boolean;
  currentIndex?: number;
  isSheetVisible?: boolean;
}

export interface IListingStep {
  currentIndex: number;
  isStepDone: boolean[];
  getAssetById: () => void;
  assetDetails: Asset | null;
  scrollToTop: () => void;
  routes: IRoutes[];
  isNextStep: boolean;
  isSheetVisible: boolean;
  updateState: (state: IListingUpdate) => void;
  onPreview?: (assetDetails: Asset) => void;
  params?: { previousScreen: string; isEditFlow?: boolean };
}

class ListingService {
  public getHeader = (selectedPlan: TypeOfPlan): string => {
    switch (selectedPlan) {
      case TypeOfPlan.RENT:
        return I18nService.t('property:rent');
      case TypeOfPlan.SELL:
        return I18nService.t('property:sell');
      default:
        return I18nService.t('property:manage');
    }
  };

  public getExistingDocuments = async (propertyId: number, updateState: (props: IDocsProps) => void): Promise<void> => {
    try {
      let existingDocuments: ExistingVerificationDocuments[] = [];
      existingDocuments = await AssetRepository.getExistingVerificationDocuments(propertyId);
      if (existingDocuments.length === 0) {
        existingDocuments = await AssetRepository.getAssetIdentityDocuments();
      }
      updateState({ existingDocuments });
    } catch (error) {
      AlertHelper.error({ message: error.message });
    }
  };

  public deleteDocument = async (deleteProps: IDocsProps, updateState: (props: IDocsProps) => void): Promise<void> => {
    const { existingDocuments, localDocuments, document, isLocalDocument, propertyId } = deleteProps;
    const clonedDocuments =
      isLocalDocument && localDocuments ? cloneDeep(localDocuments) : cloneDeep(existingDocuments);
    if (document && !document.id) {
      const documentIndex = findIndex(clonedDocuments, (existingDocument: ExistingVerificationDocuments) => {
        return existingDocument.verificationDocumentType.id === document.verificationDocumentType.id;
      });
      if (clonedDocuments && documentIndex !== -1) {
        clonedDocuments.splice(documentIndex, 1);
        const key = isLocalDocument ? 'localDocuments' : 'existingDocuments';
        updateState({ existingDocuments, localDocuments, clonedDocuments, key });
      }
    } else {
      try {
        if (propertyId && document && document.id) {
          await AssetRepository.deleteVerificationDocument(propertyId, document.id);
          await this.getExistingDocuments(propertyId, updateState);
        }
      } catch (error) {
        AlertHelper.error({ message: error.message });
      }
    }
  };

  public handleListingStep = (props: IListingStep): void => {
    const {
      currentIndex,
      isStepDone,
      getAssetById,
      assetDetails,
      params,
      updateState,
      scrollToTop,
      routes,
      onPreview,
      isNextStep,
      isSheetVisible,
    } = props;

    const newStepDone: boolean[] = isStepDone;
    newStepDone[currentIndex] = true;
    const states: IListingUpdate = {
      currentIndex,
      isStepDone,
      isNextStep,
      isSheetVisible,
    };
    let updatedStates: IListingUpdate;

    updatedStates = {
      ...states,
      isStepDone: newStepDone,
      isNextStep: true,
    };

    if (assetDetails) {
      const {
        isPropertyReady,
        listing: { isPaymentDone },
      } = assetDetails.lastVisitedStep;
      if (currentIndex === 0 && params && params.isEditFlow) {
        updatedStates = {
          ...states,
          currentIndex: currentIndex + 1,
        };
        getAssetById();
        scrollToTop();
      } else if ((currentIndex === 1 || isPropertyReady) && isPaymentDone && onPreview) {
        onPreview(assetDetails);
      } else if (currentIndex < routes.length - 1) {
        updatedStates = {
          ...states,
          currentIndex: currentIndex + 1,
        };
        getAssetById();
        scrollToTop();
      } else {
        updatedStates = {
          ...states,
          isSheetVisible: true,
        };
      }
    }

    updateState(updatedStates);
  };
}

const listingService = new ListingService();
export { listingService as ListingService };