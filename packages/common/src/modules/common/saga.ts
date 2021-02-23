/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { takeEvery, call, put } from 'redux-saga/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { MessageRepository } from '@homzhub/common/src/domain/repositories/MessageRepository';
import { CommonActionTypes, CommonActions } from '@homzhub/common/src/modules/common/actions';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { IGetMessageParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { groupChatData } from '@homzhub/common/src/mocks/GroupChatData';

function* getCountries() {
  try {
    const response = yield call(CommonRepository.getCountryCodes);
    yield put(CommonActions.getCountriesSuccess(response));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
  }
}

function* getMessages(action: IFluxStandardAction<IGetMessageParam>) {
  try {
    const response = yield call(MessageRepository.getMessages, action.payload as IGetMessageParam);
    yield put(CommonActions.getMessagesSuccess(response));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
  }
}

// TODO: (Shivam: 23/1/21: add type)
function* getGroupMessages() {
  try {
    // const response = yield call(MessageRepository.getGroupMessages);
    const response = ObjectMapper.deserializeArray(GroupMessage, groupChatData);
    yield put(CommonActions.getGroupMessageSuccess(response));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
  }
}

export function* watchCommonActions() {
  yield takeEvery(CommonActionTypes.GET.COUNTRIES, getCountries);
  yield takeEvery(CommonActionTypes.GET.MESSAGES, getMessages);
  yield takeEvery(CommonActionTypes.GET.GROUP_MESSAGES, getGroupMessages);
}
