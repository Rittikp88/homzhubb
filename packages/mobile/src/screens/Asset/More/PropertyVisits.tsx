import React from 'react';
import { PickerItemProps, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { icons } from '@homzhub/common/src/assets/icon';
import { AnimatedProfileHeader, HeaderCard } from '@homzhub/mobile/src/components';
import { DropdownWithCountry } from '@homzhub/mobile/src/components/molecules/DropdownWithCountry';
import SiteVisitTab from '@homzhub/mobile/src/components/organisms/SiteVisitTab';
import SiteVisitCalendarView from '@homzhub/mobile/src/components/organisms/SiteVisitCalendarView';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AssetService } from '@homzhub/common/src/services/AssetService';
import { VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
import { bindActionCreators, Dispatch } from 'redux';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { connect } from 'react-redux';
import { IAssetVisitPayload } from '@homzhub/common/src/domain/repositories/interfaces';

interface IDispatchProps {
  getAssetVisit: (payload: IAssetVisitPayload) => void;
}

interface IScreenState {
  isCalendarView: boolean;
  countryData: PickerItemProps[];
  propertiesByCountry: PickerItemProps[];
  selectedAssetId: number;
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
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAllAssetsByCountry();
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    return (
      <AnimatedProfileHeader isOuterScrollEnabled={false} title={t('assetMore:more')}>
        <HeaderCard
          title={t('assetMore:propertyVisits')}
          titleFontWeight="semiBold"
          renderItem={(): React.ReactElement => this.renderPropertyVisits()}
          onIconPress={this.handleBack}
          handleIcon={this.handleCalendarPress}
          icon={icons.calendar}
          containerStyles={styles.headerContainer}
          headerStyle={styles.headerStyle}
        />
      </AnimatedProfileHeader>
    );
  }

  private renderPropertyVisits = (): React.ReactElement => {
    const { isCalendarView, countryData, propertiesByCountry, selectedAssetId } = this.state;
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
          <SiteVisitTab onReschedule={this.rescheduleVisit} selectedAssetId={selectedAssetId} />
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
    this.setState({
      selectedAssetId: value,
    });

    const payload: IAssetVisitPayload = {
      ...(value > 0 && { asset_id: value }),
    };

    getAssetVisit(payload);
  };

  private rescheduleVisit = (isNew?: boolean): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.SearchStack, {
      screen: ScreensKeys.BookVisit,
      params: { isReschedule: !isNew },
    });
  };

  private getAllAssetsByCountry = async (): Promise<void> => {
    const response = await AssetService.getVisitAssetByCountry();
    const countryData = response.map((item) => {
      const result: VisitAssetDetail = item.results[0] as VisitAssetDetail;
      return {
        label: result.country.name,
        value: result.country.id,
      };
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