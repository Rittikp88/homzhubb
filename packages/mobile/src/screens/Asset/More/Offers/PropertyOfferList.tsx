import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
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
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { offerFilterBy, offerMadeSortBy } from '@homzhub/common/src/constants/Offers';
import { NegotiationOfferType } from '@homzhub/common/src/domain/repositories/interfaces';

export enum OfferType {
  OFFER_RECEIVED = 'Offer Received',
  OFFER_MADE = 'Offer Made',
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
}

type Props = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.PropertyOfferList>;

export interface IMetricsData {
  name: string;
  count: string | number;
  label?: string;
  id?: number;
  isCurrency?: boolean;
  colorCode: string;
}

class PropertyOfferList extends React.PureComponent<Props, IScreenState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      offerType: OfferType.OFFER_RECEIVED,
      isOfferInfoRead: false,
      propertyListingData: [],
      offerCountData: null,
      isScreenLoading: false,
      receivedDropdownData: [],
      madeDropdownData: [],
      isTabLoading: false,
      filters: {},
    };
  }

  public async componentDidMount(): Promise<void> {
    this.setState({ isScreenLoading: true });

    try {
      const offerCountData = await OffersRepository.getOfferData();
      const receivedOffersFilters = await OffersRepository.getReceivedOfferFilters();
      const receivedDropdownData = this.getReceivedDropdownData(receivedOffersFilters);
      const madeDropdownData = this.getMadeDropdownData();

      const isOfferInfoRead: boolean = (await StorageService.get(StorageKeys.IS_OFFER_INFO_READ)) || false;
      this.setState(
        { isOfferInfoRead, offerCountData, isScreenLoading: false, receivedDropdownData, madeDropdownData },
        () => {
          this.getPropertyListData();
        }
      );
    } catch (e) {
      AlertHelper.error({ message: e.message });
      this.setState({ isScreenLoading: false });
    }
  }

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

    const totalOffers = offerCountData?.totalOffers;
    const isReceivedOffer = offerType === OfferType.OFFER_RECEIVED;

    if (screenLoading) {
      return <Loader visible />;
    }

    return (
      <>
        <UserScreen
          title={t('assetDashboard:dashboard')}
          scrollEnabled
          backgroundColor={theme.colors.transparent}
          loading={isTabLoading}
        >
          {totalOffers === 0 ? (
            this.renderNoOffer()
          ) : (
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
                containerStyle={styles.scrollableDropdown}
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
          )}
        </UserScreen>
      </>
    );
  }

  public renderPropertyOffer = (item: Asset, index: number): React.ReactElement => {
    const separatorStyle = index !== 0 ? styles.separator : {};
    const isCardExpanded = index === 0;
    const { offerType } = this.state;

    switch (offerType) {
      case OfferType.OFFER_RECEIVED:
        return (
          <PropertyOffers
            isCardExpanded={isCardExpanded}
            propertyOffer={item}
            containerStyles={separatorStyle}
            onViewOffer={this.navigateToDetail}
          />
        );
      case OfferType.OFFER_MADE:
      default:
        return <OfferMade propertyOffer={item} />;
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

    const updatedDropdownData = [...receivedDropdownData];

    updatedDropdownData.forEach((data: IDropdownData) => {
      data.selectedValue = '';
    });

    this.setState({ offerType: name as OfferType, filters: {}, receivedDropdownData: updatedDropdownData }, () => {
      this.getPropertyListData().then();
    });
  };

  private onCloseOfferInfo = (): void => {
    this.setState({ isOfferInfoRead: true });
    StorageService.set(StorageKeys.IS_OFFER_INFO_READ, true);
  };

  private getReceivedDropdownData = (receivedOffers: ReceivedOfferFilter): IDropdownData[] => {
    const { t } = this.props;
    const { assetsDropdownData, countryDropdownData, listingDropdownData } = receivedOffers;

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

  private getMadeDropdownData = (): IDropdownData[] => {
    const { t } = this.props;

    return [
      {
        dropdownData: offerMadeSortBy,
        key: 'sort_by',
        selectedValue: '',
        placeholder: t('offers:sort'),
      },
      { dropdownData: offerFilterBy, key: 'filter_by', selectedValue: '', placeholder: t('offers:filterBy') },
    ];
  };

  private getPropertyListData = async (): Promise<void> => {
    const { offerType, filters, offerCountData } = this.state;
    const isThereOfferReceived =
      offerCountData && offerCountData.offerReceived ? offerCountData.offerReceived > 0 : false;

    let propertyListingData: Asset[] = [];

    if (offerType === OfferType.OFFER_RECEIVED && !isThereOfferReceived) return;
    this.setState({ isTabLoading: true });

    const payload = {
      type: offerType === OfferType.OFFER_RECEIVED ? NegotiationOfferType.RECEIVED : NegotiationOfferType.CREATED,
      ...(offerType === OfferType.OFFER_RECEIVED && { params: filters }),
    };

    try {
      propertyListingData = await OffersRepository.getOffers(payload);
      this.setState({ propertyListingData, isTabLoading: false });
    } catch (e) {
      this.setState({ isTabLoading: false });
      // TODO: Add error utils
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

  private navigateToDetail = (): void => {
    const { navigation } = this.props;
    // TODO: (Shikha) Pass listing Id
    navigation.navigate(ScreensKeys.OfferDetail);
  };
}

export default withTranslation()(PropertyOfferList);

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
});
