/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery, takeLatest } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { TicketActions, TicketActionTypes } from '@homzhub/common/src/modules/tickets/actions';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IGetTicketParam } from '@homzhub/common/src/domain/repositories/interfaces';

export function* getUserTickets(action: IFluxStandardAction<IGetTicketParam>) {
  try {
    const response = yield call(TicketRepository.getTickets, action.payload as IGetTicketParam);
    yield put(TicketActions.getTicketsSuccess(response));
  } catch (e) {
    yield put(TicketActions.getTicketsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
  }
}

export function* getTicketDetails(action: IFluxStandardAction<number>) {
  const { payload } = action;
  try {
    const response: Ticket = yield call(TicketRepository.getTicketDetail, payload as number);
    const {
      id,
      quoteRequestId,
      asset: { projectName },
    } = response;
    yield put(TicketActions.getTicketDetailSuccess(response));

    yield put(
      TicketActions.setCurrentTicket({
        ticketId: id,
        quoteRequestId,
        propertyName: projectName,
      })
    );
  } catch (e) {
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    yield put(TicketActions.getTicketDetailFailure());
  }
}

export function* watchTicket() {
  yield takeLatest(TicketActionTypes.GET.TICKETS, getUserTickets);
  yield takeEvery(TicketActionTypes.GET.TICKET_DETAIL, getTicketDetails);
}
