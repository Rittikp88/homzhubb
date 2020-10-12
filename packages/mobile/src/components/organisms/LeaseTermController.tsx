import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { RecordAssetRepository } from '@homzhub/common/src/domain/repositories/RecordAssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { ICheckboxGroupData, Label } from '@homzhub/common/src/components';
import { SpaceChangeType, SubLeaseUnit } from '@homzhub/mobile/src/components/organisms/SubLeaseUnit';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { FurnishingTypes } from '@homzhub/common/src/constants/Terms';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ILeaseTermParams } from '@homzhub/common/src/domain/models/LeaseTerm';

interface IProps extends WithTranslation {
  currentAssetId: number;
  isSplitAsUnits: boolean;
  currencyData: Currency;
  assetGroupType: AssetGroupTypes;
  furnishing: FurnishingTypes;
  togglePropertyUnits: () => void;
  scrollToTop: () => void;
  onNextStep: (type: TypeOfPlan) => Promise<void>;
}

interface IOwnState {
  currentIndex: number;
  routes: { key: string; title: string; id?: number }[];
  singleLeaseUnitKey: number;
  preferences: ICheckboxGroupData[];
  availableSpaces: SpaceType[];
}

class LeaseTermController extends React.PureComponent<IProps, IOwnState> {
  public constructor(props: IProps) {
    super(props);
    const { t } = props;
    this.state = {
      currentIndex: 0,
      singleLeaseUnitKey: -1,
      routes: [
        { key: '1', title: t('unit', { unitNo: 1 }) },
        { key: '2', title: t('unit', { unitNo: 2 }) },
      ],
      preferences: [],
      availableSpaces: [],
    };
  }

  public componentDidMount = async (): Promise<void> => {
    const { assetGroupType, currentAssetId, togglePropertyUnits } = this.props;
    try {
      const response = await AssetRepository.getLeaseTerms(currentAssetId);
      if (response.length > 1) {
        togglePropertyUnits();
      }
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
    if (assetGroupType === AssetGroupTypes.RES) {
      await this.getTenantPreferences();
    }
    await this.getAvailableSpaces();
  };

  public render = (): React.ReactNode => {
    const { isSplitAsUnits, currencyData, assetGroupType, furnishing } = this.props;
    const { preferences, availableSpaces, routes, singleLeaseUnitKey } = this.state;

    return (
      <>
        {isSplitAsUnits ? (
          <>
            <TouchableOpacity onPress={this.onTabAdd}>
              <Icon name={icons.plus} size={24} />
            </TouchableOpacity>
            {routes.length > 2 && (
              <TouchableOpacity onPress={this.onDelete}>
                <Icon name={icons.circularCrossFilled} size={24} color={theme.colors.active} />
              </TouchableOpacity>
            )}
            {this.renderTab()}
          </>
        ) : (
          <SubLeaseUnit
            singleLeaseUnitKey={singleLeaseUnitKey}
            onSubmit={this.onSubmit}
            furnishing={furnishing}
            preferences={preferences}
            currencyData={currencyData}
            assetGroupType={assetGroupType}
            availableSpaces={availableSpaces}
          />
        )}
      </>
    );
  };

  private renderTab = (): React.ReactNode => {
    const { currentIndex, routes } = this.state;

    return (
      <TabView
        swipeEnabled={false}
        renderTabBar={this.renderTabBar}
        renderScene={this.renderScene}
        onIndexChange={this.onTabChange}
        navigationState={{
          index: currentIndex,
          routes,
        }}
      />
    );
  };

  private renderScene = ({ route }: { route: { key: string; title: string } }): React.ReactNode => {
    const { currencyData, assetGroupType, furnishing } = this.props;
    const { preferences, availableSpaces } = this.state;

    return (
      <SubLeaseUnit
        route={route}
        onSubmit={this.onSubmit}
        onSpacesChange={this.onSpacesChange}
        furnishing={furnishing}
        preferences={preferences}
        currencyData={currencyData}
        assetGroupType={assetGroupType}
        availableSpaces={availableSpaces}
      />
    );
  };

  private renderTabBar = (props: any): React.ReactElement => {
    const { currentIndex, routes } = this.state;
    return (
      <TabBar
        {...props}
        style={styles.tabBar}
        indicatorStyle={styles.indicator}
        renderLabel={({ route }): React.ReactElement => {
          let style = {};
          let type = 'regular';

          if (route.key === routes[currentIndex].key) {
            style = { color: theme.colors.active };
            type = 'semiBold';
          }

          return (
            <Label type="large" textType={type as 'regular' | 'semiBold'} style={[styles.tabTitle, style]}>
              {route.title}
            </Label>
          );
        }}
      />
    );
  };

  private onTabChange = (index: number): void => {
    this.setState({ currentIndex: index });
  };

  private onTabAdd = (): void => {
    const { routes } = this.state;
    const { t } = this.props;
    this.setState({
      routes: [...routes, { key: `${Math.random()}`, title: t('unit', { unitNo: routes.length + 1 }) }],
    });
  };

  private onDelete = async (): Promise<void> => {
    const { currentIndex, routes } = this.state;
    const { t, currentAssetId } = this.props;

    if (routes[currentIndex].id) {
      try {
        // @ts-ignore
        await AssetRepository.deleteLeaseTerm(currentAssetId, routes[currentIndex].id);
      } catch (err) {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
        return;
      }
    }

    let routesToUpdate = [...routes];
    routesToUpdate.splice(currentIndex, 1);

    routesToUpdate = routesToUpdate.map((route, index) => ({ ...route, title: t('unit', { unitNo: index + 1 }) }));

    this.setState({
      routes: routesToUpdate,
      currentIndex: currentIndex === routes.length - 1 ? currentIndex - 1 : currentIndex,
    });
  };

  private onSpacesChange = (id: number, type: SpaceChangeType, count?: number): void => {
    const { availableSpaces } = this.state;
    const nextState = availableSpaces.map((space) => {
      if (space.id === id) {
        switch (type) {
          case SpaceChangeType.INC:
            space.count -= 1;
            break;
          case SpaceChangeType.DEC:
            space.count += 1;
            break;
          case SpaceChangeType.DEL:
            space.count += count ?? 0;
            break;
          default:
            break;
        }
      }
      return space;
    });
    this.setState({ availableSpaces: nextState });
  };

  private onSubmit = async (values: ILeaseTermParams, key?: string): Promise<void> => {
    const { onNextStep, isSplitAsUnits, currentAssetId, scrollToTop } = this.props;
    const { routes, currentIndex } = this.state;

    try {
      const response = await AssetRepository.createLeaseTerms(currentAssetId, [values]);

      if (isSplitAsUnits) {
        const routesToUpdate = routes.map((route) => {
          if (route.key === key) {
            return { ...route, id: response.ids[0] };
          }
          return route;
        });
        const newIndex = currentIndex === routes.length - 1 ? currentIndex : currentIndex + 1;
        this.setState({ routes: routesToUpdate, currentIndex: newIndex }, scrollToTop);
      } else {
        this.setState({ singleLeaseUnitKey: response.ids[0] });
        await onNextStep(TypeOfPlan.RENT);
      }
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  };

  // APIs
  private getTenantPreferences = async (): Promise<void> => {
    const { currentAssetId } = this.props;
    try {
      const response = await RecordAssetRepository.getTenantPreferences(currentAssetId);
      const preferenceList = response.map((item) => {
        return item.menuItem;
      });
      this.setState({ preferences: preferenceList });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private getAvailableSpaces = async (): Promise<void> => {
    const { currentAssetId } = this.props;
    try {
      const response = await AssetRepository.getAssetAvailableSpaces(currentAssetId);
      this.setState({ availableSpaces: response });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
  // APIs END
}

export default withTranslation(LocaleConstants.namespacesKey.property)(LeaseTermController);

const styles = StyleSheet.create({
  tabTitle: {
    color: theme.colors.darkTint3,
  },
  tabBar: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  indicator: { backgroundColor: theme.colors.active, height: 2 },
});
