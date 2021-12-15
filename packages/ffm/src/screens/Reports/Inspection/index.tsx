import React, { useEffect } from 'react';
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
import SpaceList from '@homzhub/ffm/src/screens/Reports/Inspection/SpaceList';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const Inspection = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.reports);
  const report = useSelector(FFMSelector.getCurrentReport);
  const spaces = useSelector(FFMSelector.getReportSpaces);
  const { reportSpace } = useSelector(FFMSelector.getFFMLoaders);

  useEffect(() => {
    if (report) {
      dispatch(FFMActions.getReportSpace(report.id));
    }
  }, []);

  const getPercentage = (): number => {
    return (spaces?.filter((item) => item.isCompleted).length / spaces.length) * 100;
  };

  const primaryStyle: ITypographyProps = { size: 'small' };
  const subAddressStyle: ITypographyProps = { variant: 'label', size: 'large' };

  return (
    <GradientScreen
      isUserHeader
      isScrollable
      loading={reportSpace}
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
          <Progress progress={getPercentage()} containerStyles={styles.progress} />
        </View>
      )}
      <View style={styles.content}>
        <SpaceList />
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
