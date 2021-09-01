/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery, takeLatest } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PaymentRepository } from '@homzhub/common/src/domain/repositories/PaymentRepository';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { TicketActions, TicketActionTypes } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import {
  IGetTicketParam,
  IInvoiceSummaryPayload,
  IUpdateTicketWorkStatus,
  TicketAction,
} from '@homzhub/common/src/domain/repositories/interfaces';

export function* getUserTickets(action: IFluxStandardAction<IGetTicketParam>) {
  try {
    const response = yield call(TicketRepository.getTickets, action.payload as IGetTicketParam);
    yield put(TicketActions.getTicketsSuccess(response));
  } catch (e) {
    yield put(TicketActions.getTicketsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getTicketDetails(action: IFluxStandardAction<number>) {
  const { payload } = action;
  try {
    const response: Ticket = yield call(TicketRepository.getTicketDetail, payload as number);
    const {
      id,
      quoteRequestId,
      asset: {
        projectName,
        country: { currencies },
        id: assetId,
      },
    } = response;
    yield put(TicketActions.getTicketDetailSuccess(response));

    yield put(
      TicketActions.setCurrentTicket({
        ticketId: id,
        quoteRequestId,
        propertyName: projectName,
        currency: currencies[0],
        assetId,
      })
    );
  } catch (e) {
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    yield put(TicketActions.getTicketDetailFailure());
  }
}

export function* getInvoiceSummary(action: IFluxStandardAction<IInvoiceSummaryPayload>) {
  try {
    const response = yield call(PaymentRepository.getInvoiceSummary, action.payload as IInvoiceSummaryPayload);
    yield put(TicketActions.getInvoiceSummarySuccess(response));
  } catch (e) {
    yield put(TicketActions.getInvoiceSummaryFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}
export function* closeTicket() {
  try {
    const currentTicket: ICurrentTicket = yield select(TicketSelectors.getCurrentTicket);
    const requestBody: IUpdateTicketWorkStatus = {
      action: TicketAction.CLOSE_TICKET,
      payload: {},
    };
    yield call(TicketRepository.updateWorkStatus, currentTicket.ticketId, requestBody);
    yield put(TicketActions.closeTicketSuccess());
    yield put(TicketActions.getTicketDetail(currentTicket.ticketId));
    AlertHelper.success({ message: I18nService.t('serviceTickets:closeTicketSuccess') });
  } catch (e) {
    yield put(TicketActions.closeTicketFailure());
    AlertHelper.error({ message: e.details.message, statusCode: e.details.statusCode });
  }
}

export function* sendTicketReminder() {
  try {
    const currentTicket: ICurrentTicket = yield select(TicketSelectors.getCurrentTicket);
    // Todo (Praharsh) : Call actual API here
    yield call(FunctionUtils.noopAsync);
    yield put(TicketActions.handleTicketReminderSent());
    yield put(TicketActions.getTicketDetail(currentTicket.ticketId));
    AlertHelper.success({ message: I18nService.t('assetFinancial:reminderSuccessMsg') });
  } catch (e) {
    yield put(TicketActions.handleTicketReminderSent());
    AlertHelper.error({ message: e.details.message, statusCode: e.details.statusCode });
  }
}

export function* watchTicket() {
  yield takeLatest(TicketActionTypes.GET.TICKETS, getUserTickets);
  yield takeEvery(TicketActionTypes.GET.TICKET_DETAIL, getTicketDetails);
  yield takeEvery(TicketActionTypes.POST.INVOICE_SUMMARY, getInvoiceSummary);
  yield takeEvery(TicketActionTypes.CLOSE_TICKET, closeTicket);
  yield takeEvery(TicketActionTypes.SEND_TICKET_REMINDER, sendTicketReminder);
}
