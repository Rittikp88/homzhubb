import React from 'react';
import { PickerItemProps, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { AssetService } from '@homzhub/common/src/services/AssetService';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { icons } from '@homzhub/common/src/assets/icon';
import { AnimatedProfileHeader, HeaderCard } from '@homzhub/mobile/src/components';
import { DropdownWithCountry } from '@homzhub/mobile/src/components/molecules/DropdownWithCountry';
import SiteVisitTab from '@homzhub/mobile/src/components/organisms/SiteVisitTab';
import SiteVisitCalendarView from '@homzhub/mobile/src/components/organisms/SiteVisitCalendarView';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IAssetVisitPayload } from '@homzhub/common/src/domain/repositories/interfaces';

interface IDispatchProps {
  getAssetVisit: (payload: IAssetVisitPayload) => void;
}

interface IScreenState {
  isCalendarView: boolean;
  countryData: Country[];
  propertiesByCountry: PickerItemProps[];
  selectedAssetId: number;
  visitPayload: IAssetVisitPayload;
}

const defaultObj = { label: 'All Properties', value: 0 };

type libraryProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.PropertyVisits>;
type Props = WithTranslation & libraryProps & IDispatchProps;

export class PropertyVisits extends React.Component<Props, IScreenState> {
  public state = {
    isCalendarView: false,
    countryData: [],
    propertiesByCountry: [],
    selectedAssetId: 0,
    visitPayload: {} as IAssetVisitPayload,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAllAssetsByCountry();
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { isCalendarView } = this.state;
    return (
      <AnimatedProfileHeader isOuterScrollEnabled={false} title={t('assetMore:more')}>
        <HeaderCard
          title={t('assetMore:propertyVisits')}
          titleFontWeight="semiBold"
          renderItem={(): React.ReactElement => this.renderPropertyVisits()}
          onIconPress={this.handleBack}
          handleIcon={this.handleCalendarPress}
          icon={isCalendarView ? icons.doubleBar : icons.calendar}
          containerStyles={styles.headerContainer}
          headerStyle={styles.headerStyle}
        />
      </AnimatedProfileHeader>
    );
  }

  private renderPropertyVisits = (): React.ReactElement => {
    const { isCalendarView, countryData, propertiesByCountry, selectedAssetId } = this.state;
    const {
      navigation,
      route: { params },
    } = this.props;
    return (
      <>
        <DropdownWithCountry
          countryData={countryData}
          dropdownData={propertiesByCountry}
          onSelectProperty={this.handlePropertySelect}
        />
        {isCalendarView ? (
          <SiteVisitCalendarView onReschedule={this.rescheduleVisit} selectedAssetId={selectedAssetId} />
        ) : (
          <SiteVisitTab
            onReschedule={this.rescheduleVisit}
            selectedAssetId={selectedAssetId}
            navigation={navigation}
            visitId={params && params.visitId ? params.visitId : null}
            setVisitPayload={this.setVisitPayload}
          />
        )}
      </>
    );
  };

  private handleBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handleCalendarPress = (): void => {
    const { isCalendarView } = this.state;
    this.setState({
      isCalendarView: !isCalendarView,
    });
  };

  private handlePropertySelect = (value: number): void => {
    const { getAssetVisit } = this.props;
    const {
      visitPayload: { start_date__gte, status, start_date__lt },
      isCalendarView,
    } = this.state;
    this.setState({
      selectedAssetId: value,
    });

    const payload: IAssetVisitPayload = {
      ...(value > 0 && { asset_id: value }),
      ...(start_date__gte && isCalendarView && { start_datetime: start_date__gte }),
      ...(start_date__gte && !isCalendarView && { start_date__gte }),
      ...(start_date__lt && !isCalendarView && { start_date__lt }),
      ...(status && { status }),
    };

    getAssetVisit(payload);
  };

  private rescheduleVisit = (isNew?: boolean): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.BookVisit, { isReschedule: !isNew });
  };

  private setVisitPayload = (payload: IAssetVisitPayload): void => {
    this.setState({
      visitPayload: payload,
    });
  };

  private getAllAssetsByCountry = async (): Promise<void> => {
    const response = await AssetService.getVisitAssetByCountry();
    const countryData = response.map((item) => {
      const result: VisitAssetDetail = item.results[0] as VisitAssetDetail;
      return result.country;
    });

    const propertiesByCountry: PickerItemProps[] = [defaultObj];

    response.forEach((item) => {
      const results = item.results as VisitAssetDetail[];
      results.forEach((asset: VisitAssetDetail) => {
        propertiesByCountry.push({ label: asset.projectName, value: asset.id });
      });
    });

    this.setState({
      countryData,
      propertiesByCountry,
    });
  };
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetVisit } = AssetActions;
  return bindActionCreators(
    {
      getAssetVisit,
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(withTranslation()(PropertyVisits));

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 0,
  },
  headerStyle: {
    paddingHorizontal: 10,
  },
});
