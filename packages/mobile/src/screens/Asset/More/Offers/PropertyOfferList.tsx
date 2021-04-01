import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { OfferUtils } from '@homzhub/common/src/utils/OfferUtils';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { AssetMetricsList } from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import TextWithIcon from '@homzhub/common/src/components/atoms/TextWithIcon';
import OfferMade from '@homzhub/common/src/components/molecules/OfferMade';
import PropertyOffers from '@homzhub/common/src/components/molecules/PropertyOffers';
import ScrollableDropdownList, {
  IDropdownData,
  ISelectedValue,
} from '@homzhub/common/src/components/molecules/ScrollableDropdownList';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { OfferManagement } from '@homzhub/common/src/domain/models/OfferManagement';
import { ReceivedOfferFilter } from '@homzhub/common/src/domain/models/ReceivedOfferFilter';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { NegotiationOfferType, OfferFilterType, ListingType } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICurrentOffer } from '@homzhub/common/src/modules/offers/interfaces';
import { MadeSort, offerMadeSortBy } from '@homzhub/common/src/constants/Offers';

export enum OfferType {
  OFFER_RECEIVED = 'Offer Received',
  OFFER_MADE = 'Offer Made',
}

interface IStateProps {
  assetCount: number;
}

interface IDispatchProps {
  setCurrentOfferPayload: (payload: ICurrentOffer) => void;
}

interface IScreenState {
  offerType: OfferType;
  isOfferInfoRead: boolean;
  propertyListingData: Asset[];
  offerCountData: OfferManagement | null;
  receivedDropdownData: IDropdownData[];
  madeDropdownData: IDropdownData[];
  isScreenLoading: boolean;
  isTabLoading: boolean;
  filters: Record<string, string>;
  currencies: string[];
}

type LibProps = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.PropertyOfferList>;
type Props = LibProps & IDispatchProps & IStateProps;

export interface IMetricsData {
  name: string;
  count: string | number;
  label?: string;
  id?: number;
  isCurrency?: boolean;
  colorCode: string;
}

class PropertyOfferList extends React.PureComponent<Props, IScreenState> {
  public focusListener: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      offerType: props.assetCount > 0 ? OfferType.OFFER_RECEIVED : OfferType.OFFER_MADE,
      isOfferInfoRead: false,
      propertyListingData: [],
      offerCountData: null,
      isScreenLoading: false,
      receivedDropdownData: [],
      madeDropdownData: [],
      isTabLoading: false,
      filters: {},
      currencies: [],
    };
  }

  public componentDidMount = (): void => {
    const { navigation } = this.props;
    this.setState({
      isScreenLoading: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.focusListener = navigation.addListener('focus', async () => {
      try {
        const offerCountData = await OffersRepository.getOfferData();

        await this.getFilters();
        const isOfferInfoRead: boolean = (await StorageService.get(StorageKeys.IS_OFFER_INFO_READ)) || false;
        this.setState(
          {
            isOfferInfoRead,
            offerCountData,
            isScreenLoading: false,
          },
          () => {
            this.getPropertyListData();
          }
        );
      } catch (e) {
        AlertHelper.error({ message: e.message });
        this.setState({ isScreenLoading: false });
      }
    });
  };

  public render(): React.ReactElement {
    const { t } = this.props;
    const {
      offerType,
      isOfferInfoRead,
      propertyListingData,
      offerCountData,
      isScreenLoading: screenLoading,
      receivedDropdownData,
      madeDropdownData,
      isTabLoading,
    } = this.state;

    const isReceivedOffer = offerType === OfferType.OFFER_RECEIVED;

    if (screenLoading) {
      return <Loader visible />;
    }
    return (
      <>
        <UserScreen title={t('offers')} scrollEnabled backgroundColor={theme.colors.transparent} loading={isTabLoading}>
          <>
            <AssetMetricsList
              title={offerCountData?.totalOffers?.toString()}
              data={this.getMetricData()}
              onMetricsClicked={this.onMetricsClicked}
              selectedAssetType={offerType}
              numOfElements={2}
              subTitleText={t('assetPortfolio:totalOffers')}
              isSubTextRequired
              headerIcon={icons.offers}
              containerStyle={[styles.metricList, styles.borderRadius]}
            />
            {!isOfferInfoRead && (
              <TextWithIcon
                text={t('offers:offerInfo')}
                containerStyle={[styles.offerInfo, styles.borderRadius]}
                icon={icons.close}
                iconSize={15}
                prefixIcon={icons.circularFilledInfo}
                iconColor={theme.colors.darkTint4}
                prefixIconColor={theme.colors.darkTint3}
                variant="label"
                subContainerStyle={styles.textIconSubContainer}
                onIcon={this.onCloseOfferInfo}
              />
            )}
            <ScrollableDropdownList
              data={isReceivedOffer ? receivedDropdownData : madeDropdownData}
              isScrollable={isReceivedOffer}
              dropDownTitle={!isReceivedOffer ? 'Offers' : ''}
              onDropdown={this.onSelectFromDropdown}
              containerStyle={[styles.scrollableDropdown, !isReceivedOffer && styles.dropDown]}
            />
            {propertyListingData && propertyListingData.length > 0 ? (
              <>
                {propertyListingData.map((property: Asset, index: number) => {
                  return this.renderPropertyOffer(property, index);
                })}
              </>
            ) : (
              this.renderNoOffer()
            )}
          </>
        </UserScreen>
      </>
    );
  }

  public renderPropertyOffer = (item: Asset, index: number): React.ReactElement => {
    const separatorStyle = index !== 0 ? styles.separator : {};
    const isCardExpanded = index === 0;
    const { offerType } = this.state;
    let payload: ICurrentOffer | null = null;
    const { saleTerm, leaseTerm, id } = item;
    if (saleTerm) {
      payload = {
        type: ListingType.SALE_LISTING,
        listingId: saleTerm.id,
      };
    } else if (leaseTerm) {
      payload = {
        type: ListingType.LEASE_LISTING,
        listingId: leaseTerm.id,
      };
    }

    switch (offerType) {
      case OfferType.OFFER_RECEIVED:
        return (
          <PropertyOffers
            isCardExpanded={isCardExpanded}
            propertyOffer={item}
            containerStyles={separatorStyle}
            onViewOffer={(): void => this.navigateToDetail(payload, id)}
          />
        );
      case OfferType.OFFER_MADE:
      default:
        return <OfferMade propertyOffer={item} onViewOffer={(): void => this.navigateToDetail(payload, id)} />;
    }
  };

  private renderNoOffer = (): React.ReactElement => {
    const { t } = this.props;
    const { offerType } = this.state;

    const title = offerType === 'Offer Received' ? t('offers:noOfferReceived') : t('offers:noOfferMade');
    return <EmptyState title={title} />;
  };

  private onSelectFromDropdown = (selectedValues: (ISelectedValue | undefined)[]): void => {
    const filters = {};

    selectedValues.forEach((selectedValue: ISelectedValue | undefined) => {
      if (!selectedValue) {
        return;
      }
      const { key, value } = selectedValue;
      // @ts-ignore
      filters[key] = value;
    });

    this.setState({ filters }, () => {
      this.getPropertyListData().then();
    });
  };

  private onMetricsClicked = (name: string): void => {
    const { receivedDropdownData } = this.state;
    this.setState({ propertyListingData: [] });

    const updatedDropdownData = [...receivedDropdownData];

    updatedDropdownData.forEach((data: IDropdownData) => {
      data.selectedValue = '';
    });

    this.setState({ offerType: name as OfferType, filters: {}, receivedDropdownData: updatedDropdownData }, () => {
      this.getPropertyListData().then();
      this.getFilters().then();
    });
  };

  private onCloseOfferInfo = (): void => {
    this.setState({ isOfferInfoRead: true });
    StorageService.set(StorageKeys.IS_OFFER_INFO_READ, true);
  };

  private getReceivedDropdownData = (receivedOffers: ReceivedOfferFilter | Unit[]): IDropdownData[] => {
    const { t } = this.props;
    const { assetsDropdownData, countryDropdownData, listingDropdownData } = receivedOffers as ReceivedOfferFilter;

    return [
      {
        dropdownData: countryDropdownData,
        key: 'country_id',
        selectedValue: '',
        placeholder: t('assetPortfolio:selectCountry'),
      },
      { dropdownData: listingDropdownData, key: 'type', selectedValue: '', placeholder: t('offers:selectType') },
      { dropdownData: assetsDropdownData, key: 'asset_id', selectedValue: '', placeholder: t('offers:selectProperty') },
    ];
  };

  private getMadeDropdownData = (filters: ReceivedOfferFilter | Unit[]): IDropdownData[] => {
    const { t } = this.props;
    const { currencies } = this.state;
    const data = filters as Unit[];

    const offerFilter = data.map((item) => {
      return {
        label: item.label,
        value: item.name,
      };
    });

    const list = [
      {
        dropdownData: offerMadeSortBy,
        key: 'sort_by',
        selectedValue: MadeSort.NEWEST,
        placeholder: t('offers:sort'),
      },
      { dropdownData: offerFilter, key: 'filter_by', selectedValue: '', placeholder: t('offers:filterBy') },
    ];

    if (currencies.length > 1) {
      list.shift();
    }

    return list;
  };

  private getFilters = async (): Promise<void> => {
    const { offerType } = this.state;

    const offersFilters = await OffersRepository.getOfferFilters(
      offerType === OfferType.OFFER_RECEIVED ? OfferFilterType.RECEIVED : OfferFilterType.CREATED
    );
    switch (offerType) {
      case OfferType.OFFER_RECEIVED:
        this.setState({
          receivedDropdownData: this.getReceivedDropdownData(offersFilters),
        });
        break;
      case OfferType.OFFER_MADE:
        this.setState({
          madeDropdownData: this.getMadeDropdownData(offersFilters),
        });
        break;
      default:
        this.setState({
          receivedDropdownData: [],
          madeDropdownData: [],
        });
    }
  };

  private getPropertyListData = async (): Promise<void> => {
    const { offerType, filters, offerCountData } = this.state;
    const isThereOfferReceived =
      offerCountData && offerCountData.offerReceived ? offerCountData.offerReceived > 0 : false;

    let propertyListingData: Asset[] = [];
    let currencies: string[] = [];

    if (offerType === OfferType.OFFER_RECEIVED && !isThereOfferReceived) return;
    this.setState({ isTabLoading: true });

    const payload = {
      type: offerType === OfferType.OFFER_RECEIVED ? NegotiationOfferType.RECEIVED : NegotiationOfferType.CREATED,
      ...(offerType === OfferType.OFFER_RECEIVED && { params: filters }),
      ...(offerType === OfferType.OFFER_MADE && {
        params: {
          filter_by: filters.filter_by,
        },
      }),
    };

    try {
      propertyListingData = await OffersRepository.getOffers(payload);

      // For hiding sorting during multiple currencies
      propertyListingData.forEach((item) => {
        item.country.currencies.forEach((currency) => {
          if (!currencies.includes(currency.currencyCode)) {
            currencies = [...currencies, currency.currencyCode];
          }
        });
      });

      if (offerType === OfferType.OFFER_MADE) {
        this.setState({
          propertyListingData: OfferUtils.getSortedOfferMade(filters.sort_by, propertyListingData),
        });
      } else {
        this.setState({
          propertyListingData,
        });
      }

      this.setState({ isTabLoading: false, currencies });
    } catch (e) {
      this.setState({ isTabLoading: false });
      AlertHelper.error({ message: e.message });
    }
  };

  private getMetricData = (): IMetricsData[] => {
    const { offerCountData } = this.state;
    const { t } = this.props;

    if (!offerCountData) {
      return [];
    }

    const { offerReceived, offerMade } = offerCountData;

    return [
      { name: t('offers:offerReceived'), count: offerReceived, colorCode: theme.colors.highPriority },
      { name: t('offers:offerMade'), count: offerMade, colorCode: theme.colors.greenTint8 },
    ];
  };

  private navigateToDetail = (payload: ICurrentOffer | null, assetId: number): void => {
    const { t, navigation, setCurrentOfferPayload } = this.props;
    const { offerType } = this.state;
    const isValidListing = payload && payload.listingId > 0;
    if (!isValidListing) {
      AlertHelper.error({ message: t('property:listingNotValid') });
      return;
    }
    if (offerType === OfferType.OFFER_MADE) {
      // @ts-ignore
      navigation.navigate(ScreensKeys.BottomTabs, {
        screen: ScreensKeys.Search,
        params: {
          screen: ScreensKeys.PropertyAssetDescription,
          initial: false,
          params: {
            propertyTermId: payload?.listingId,
            propertyId: assetId,
          },
        },
      });
    } else {
      if (payload) {
        setCurrentOfferPayload(payload);
      }
      navigation.navigate(ScreensKeys.OfferDetail);
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserAssetsCount } = UserSelector;
  return {
    assetCount: getUserAssetsCount(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setCurrentOfferPayload } = OfferActions;
  return bindActionCreators(
    {
      setCurrentOfferPayload,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(PropertyOfferList));

const styles = StyleSheet.create({
  separator: {
    marginTop: 16,
  },
  offerInfo: {
    flex: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  borderRadius: {
    borderRadius: 4,
  },
  metricList: {
    marginBottom: 12,
  },
  textIconSubContainer: {
    flex: 1,
  },
  scrollableDropdown: {
    marginBottom: 20,
  },
  dropDown: {
    width: 140,
  },
});
