import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { ReportAction } from '@homzhub/ffm/src/services/ReportService';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import ReportCard from '@homzhub/ffm/src/components/molecules/ReportCard';
import { Report, ReportStatus } from '@homzhub/common/src/domain/models/Report';
import { IUpdateReport } from '@homzhub/common/src/domain/repositories/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

interface IProps {
  currentTab: Tabs;
}

const ReportList = ({ currentTab }: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const reports = useSelector(FFMSelector.getInspectionReport);

  const handleReportAction = (payload: IUpdateReport): void => {
    const { ACCEPT, REJECT } = ReportAction;
    const { status, reportId } = payload;
    switch (status) {
      case ACCEPT:
      case REJECT:
        updateReport({ reportId, status: status.toLocaleUpperCase() }).then();
        break;
      default:
    }
  };

  const updateReport = async (payload: IUpdateReport): Promise<void> => {
    try {
      await FFMRepository.updateInspectionReport(payload);
      dispatch(FFMActions.getInspectionReport());
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  // TODO: (Shikha) - Refactor once BE logic done
  const getReportList = (): Report[] => {
    if (reports) {
      const { results } = reports;
      switch (currentTab) {
        case Tabs.NEW:
          return results.filter((item) => item.status === ReportStatus.NEW);
        case Tabs.ONGOING:
          return results.filter((item) => item.status === ReportStatus.ACCEPTED);
        case Tabs.MISSED:
          return results.filter(
            (item) => item.status === ReportStatus.REJECTED || item.status === ReportStatus.CANCELLED
          );
        case Tabs.COMPLETED:
          return results.filter(
            (item) =>
              item.status === ReportStatus.AWAITING_APPROVAL ||
              item.status === ReportStatus.QA_REJECTED ||
              item.status === ReportStatus.QA_APPROVED
          );
        default:
          return results;
      }
    }

    return [];
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {getReportList().length > 0 ? (
        getReportList().map((item, index) => {
          return <ReportCard key={index} data={item} handleAction={handleReportAction} />;
        })
      ) : (
        <EmptyState />
      )}
    </ScrollView>
  );
};

export default ReportList;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
