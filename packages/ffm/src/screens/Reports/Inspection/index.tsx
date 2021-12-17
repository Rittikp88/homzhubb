import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Progress } from '@homzhub/common/src/components/atoms/Progress/Progress';
import { ITypographyProps } from '@homzhub/common/src/components/atoms/Typography';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import SpaceDetail from '@homzhub/ffm/src/screens/Reports/Inspection/SpaceDetail';
import SpaceList from '@homzhub/ffm/src/screens/Reports/Inspection/SpaceList';
import { ReportSpace } from '@homzhub/common/src/domain/models/ReportSpace';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const Inspection = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.reports);
  const report = useSelector(FFMSelector.getCurrentReport);
  const spaces = useSelector(FFMSelector.getReportSpaces);
  const { reportSpace, spaceDetail } = useSelector(FFMSelector.getFFMLoaders);
  const [selectedSpace, setSelectedSpace] = useState<ReportSpace | null>(null);

  useEffect(() => {
    if (report) {
      dispatch(FFMActions.getReportSpace(report.id));
      dispatch(FFMActions.clearSpaceData());
    }
  }, []);

  const onUpdateSpaceSuccess = (): void => {
    if (report) {
      dispatch(FFMActions.getReportSpace(report.id));
      setSelectedSpace(null);
    }
  };

  const onBack = (): void => {
    setSelectedSpace(null);
    dispatch(FFMActions.clearSpaceData());
  };

  const getPercentage = (): number => {
    return (spaces?.filter((item) => item.isCompleted).length / spaces.length) * 100;
  };

  const primaryStyle: ITypographyProps = { size: 'small' };
  const subAddressStyle: ITypographyProps = { variant: 'label', size: 'large' };

  return (
    <GradientScreen
      isUserHeader
      isScrollable
      loading={reportSpace || spaceDetail}
      screenTitle={t('inspection')}
      containerStyle={styles.container}
    >
      {report && (
        <View style={styles.header}>
          <PropertyAddressCountry
            primaryAddress={report.asset.projectName}
            subAddress={report.asset.address}
            countryFlag={report.asset.country.flag}
            subAddressTextStyles={subAddressStyle}
            primaryAddressTextStyles={primaryStyle}
          />
          {spaces.length > 0 && <Progress progress={getPercentage()} containerStyles={styles.progress} />}
        </View>
      )}
      <View style={styles.content}>
        {selectedSpace ? (
          <SpaceDetail spaceDetail={selectedSpace} onBack={onBack} onSuccess={onUpdateSpaceSuccess} />
        ) : (
          <SpaceList onSelectSpace={setSelectedSpace} />
        )}
      </View>
    </GradientScreen>
  );
};

export default Inspection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
    padding: 0,
  },
  header: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  progress: {
    marginVertical: 10,
  },
  content: {
    marginVertical: 16,
    backgroundColor: theme.colors.white,
    padding: 20,
  },
});
