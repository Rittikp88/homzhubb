import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PropertyActions } from '@homzhub/common/src/modules/property/actions';
import { PropertySelector } from '@homzhub/common/src/modules/property/selectors';
import {
  IUpdateAssetDetails,
  SpaceAvailableTypes,
  ISpaceAvailable,
  ISpaceAvailablePayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button, IDropdownOption, WithShadowView } from '@homzhub/common/src/components';
import { Header, PropertyDetailsLocation, StateAwareComponent } from '@homzhub/mobile/src/components';
import PropertyDetailsItems from '@homzhub/mobile/src/components/organisms/PropertyDetailItems';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { IPropertyDetailsData, IPropertyTypes } from '@homzhub/common/src/domain/models/Property';

interface IDispatchProps {
  getPropertyDetails: () => void;
}

interface IStateProps {
  propertyId: number;
  property: IPropertyDetailsData[] | null;
  isLoading: boolean;
}

type libraryProps = NavigationScreenProps<PropertyPostStackParamList, ScreensKeys.PropertyDetailsScreen>;
type Props = IDispatchProps & IStateProps & libraryProps & WithTranslation;

interface IPropertyDetailsState {
  projectName: string;
  propertyGroupSelectedIndex: string | number;
  propertyGroupTypeSelectedIndex: string | number;
  areaUnits: IDropdownOption[];
  spaceAvailable: ISpaceAvailable;
  carpetAreaError: boolean;
}

export class PropertyDetails extends React.PureComponent<Props, IPropertyDetailsState> {
  public state = {
    projectName: '',
    propertyGroupSelectedIndex: 0,
    propertyGroupTypeSelectedIndex: 0,
    areaUnits: [],
    spaceAvailable: {
      bedroom: 0,
      bathroom: 0,
      balcony: 0,
      floorNumber: 0,
      totalFloors: 0,
      carpetArea: '',
      areaUnit: 'SQ_FT',
    },
    carpetAreaError: false,
  };

  public componentDidMount = async (): Promise<void> => {
    const { getPropertyDetails } = this.props;
    getPropertyDetails();
    await this.getProjectName();
    await this.getCarpetAreaUnits();
  };

  public render(): React.ReactNode {
    const { isLoading } = this.props;
    return (
      <StateAwareComponent loading={isLoading} renderComponent={this.renderComponentContent()} testID="stateAware" />
    );
  }

  public renderComponentContent = (): React.ReactElement | null => {
    const { property, t } = this.props;
    const {
      propertyGroupSelectedIndex,
      propertyGroupTypeSelectedIndex,
      areaUnits,
      spaceAvailable,
      carpetAreaError,
      projectName,
    } = this.state;
    if (!property) {
      return null;
    }
    const address = GooglePlacesService.getSplitAddress(projectName);
    return (
      <View style={styles.container}>
        <Header
          type="primary"
          icon={icons.leftArrow}
          onIconPress={this.handleIconPress}
          isHeadingVisible
          title={t('property:headerTitle')}
          testID="headerView"
        />
        <ScrollView style={styles.scrollContainer}>
          <PropertyDetailsLocation
            propertyName={address.primaryAddress}
            propertyAddress={address.secondaryAddress}
            onNavigate={this.onNavigateToMaps}
            testID="propertyLocation"
          />
          <PropertyDetailsItems
            data={property}
            areaUnits={areaUnits}
            spaceAvailable={spaceAvailable}
            propertyGroupSelectedIndex={propertyGroupSelectedIndex}
            propertyGroupTypeSelectedIndex={propertyGroupTypeSelectedIndex}
            carpetAreaError={carpetAreaError}
            onPropertyGroupChange={this.onPropertyGroupChange}
            onPropertyGroupTypeChange={this.onPropertyGroupTypeChange}
            onSpaceAvailableValueChange={this.onSpaceAvailableValueChange}
            onCommercialPropertyChange={this.updateSpaceAvailable}
          />
        </ScrollView>
        <WithShadowView outerViewStyle={styles.shadowView}>
          <Button
            type="primary"
            title={t('common:submit')}
            disabled={!spaceAvailable.carpetArea}
            containerStyle={styles.buttonStyle}
            onPress={this.onSubmit}
          />
        </WithShadowView>
      </View>
    );
  };

  public onNavigateToMaps = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  public onPropertyGroupChange = (index: string | number): void => {
    const { spaceAvailable } = this.state;
    this.setState({
      propertyGroupSelectedIndex: index,
      propertyGroupTypeSelectedIndex: 0,
      spaceAvailable: {
        ...spaceAvailable,
        bathroom: 0,
        carpetArea: '',
      },
    });
  };

  public onPropertyGroupTypeChange = (index: string | number): void => {
    this.setState({
      propertyGroupTypeSelectedIndex: index,
    });
  };

  public onSpaceAvailableValueChange = (item: IPropertyTypes, index: string | number): void => {
    switch (item.name) {
      case SpaceAvailableTypes.BATHROOM:
        this.updateSpaceAvailable('bathroom', index);
        break;
      case SpaceAvailableTypes.BALCONY:
        this.updateSpaceAvailable('balcony', index);
        break;
      case SpaceAvailableTypes.TOTAL_FLOORS:
        this.updateSpaceAvailable('totalFloors', index);
        break;
      case SpaceAvailableTypes.FLOOR_NUMBER:
        this.updateSpaceAvailable('floorNumber', index);
        break;
      case SpaceAvailableTypes.BEDROOM:
        this.updateSpaceAvailable('bedroom', index);
        break;
      default:
        break;
    }
  };

  private onSubmit = async (): Promise<void> => {
    const { navigation, property, propertyId } = this.props;
    const {
      spaceAvailable: { carpetArea, areaUnit, floorNumber, totalFloors },
      propertyGroupSelectedIndex,
      propertyGroupTypeSelectedIndex,
    } = this.state;

    if (!property) {
      return;
    }
    const spaces = this.getSpacesForProperty();
    try {
      let requestPayload: IUpdateAssetDetails = {
        asset_type: Number(property[propertyGroupSelectedIndex].asset_types[propertyGroupTypeSelectedIndex].id),
        spaces,
        carpet_area: carpetArea.toString(),
        carpet_area_unit: areaUnit,
      };
      if (!carpetArea) {
        this.setState({ carpetAreaError: true });
      }
      if (propertyGroupSelectedIndex === 1) {
        requestPayload = {
          ...requestPayload,
          floor_number: floorNumber,
          total_floors: totalFloors,
        };
      }
      await AssetRepository.updateAsset(propertyId, requestPayload);
      navigation.navigate(ScreensKeys.AssetPropertyImages);
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  public getSpacesForProperty(): ISpaceAvailablePayload[] {
    const {
      spaceAvailable: { bathroom, bedroom, balcony },
      propertyGroupSelectedIndex,
    } = this.state;
    const { property } = this.props;
    const spaces: ISpaceAvailablePayload[] = [];
    const countOfSpace = (type: string): number => {
      switch (type) {
        case SpaceAvailableTypes.BATHROOM:
          return bathroom;
        case SpaceAvailableTypes.BEDROOM:
          return bedroom;
        case SpaceAvailableTypes.BALCONY:
          return balcony;
        default:
          return 0;
      }
    };
    property?.[propertyGroupSelectedIndex].space_types.forEach((spaceType) => {
      spaces.push({
        space_type: spaceType.id,
        count: countOfSpace(spaceType.name),
      });
    });
    return spaces;
  }

  public getCarpetAreaUnits = async (): Promise<void> => {
    try {
      const response = await CommonRepository.getCarpetAreaUnits();
      this.setState({
        areaUnits: response,
      });
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  public updateSpaceAvailable = (type: string, value: string | number): void => {
    const { spaceAvailable } = this.state;
    this.setState({
      spaceAvailable: {
        ...spaceAvailable,
        [type]: value,
      },
      carpetAreaError: false,
    });
  };

  private getProjectName = async (): Promise<void> => {
    const { propertyId } = this.props;
    try {
      const response = await AssetRepository.getAssetById(propertyId);
      this.setState({ projectName: response.projectName });
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  const { getCurrentPropertyId, getPropertyDetails, getPropertyLoadingState } = PropertySelector;
  return {
    property: getPropertyDetails(state),
    propertyId: getCurrentPropertyId(state),
    isLoading: getPropertyLoadingState(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getPropertyDetails } = PropertyActions;
  return bindActionCreators(
    {
      getPropertyDetails,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(PropertyDetails));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContainer: {
    flex: 1,
  },
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
