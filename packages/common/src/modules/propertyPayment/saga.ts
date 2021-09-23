/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeLatest } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PropertyRepository } from '@homzhub/common/src/domain/repositories/PropertyRepository';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import {
  PropertyPaymentActions,
  PropertyPaymentActionTypes,
} from '@homzhub/common/src/modules/propertyPayment/actions';
import { Society } from '@homzhub/common/src/domain/models/Society';
import { ISocietyParam, ISocietyPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IFluxStandardAction, VoidGenerator } from '@homzhub/common/src/modules/interfaces';

export function* getSocieties(action: IFluxStandardAction<ISocietyParam>): VoidGenerator {
  try {
    const response = yield call(PropertyRepository.getSocieties, action.payload as ISocietyParam);
    yield put(PropertyPaymentActions.getSocietiesSuccess(response as Society[]));
  } catch (e) {
    yield put(PropertyPaymentActions.getSocietiesFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* createSociety(action: IFluxStandardAction<ISocietyPayload>): VoidGenerator {
  try {
    yield call(PropertyRepository.createSociety, action.payload as ISocietyPayload);
    yield put(AssetActions.getActiveAssets());
    yield put(PropertyPaymentActions.createSocietySuccess());
  } catch (e) {
    yield put(PropertyPaymentActions.createSocietyFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* watchPropertyPayment() {
  yield takeLatest(PropertyPaymentActionTypes.GET.SOCIETIES, getSocieties);
  yield takeLatest(PropertyPaymentActionTypes.POST.SOCIETY, createSociety);
}
