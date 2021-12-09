import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import ReportCard from '@homzhub/ffm/src/components/molecules/ReportCard';
import { Report, ReportStatus } from '@homzhub/common/src/domain/models/Report';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

interface IProps {
  currentTab: Tabs;
}

const ReportList = ({ currentTab }: IProps): React.ReactElement => {
  const reports = useSelector(FFMSelector.getInspectionReport);

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
          return <ReportCard key={index} data={item} />;
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
