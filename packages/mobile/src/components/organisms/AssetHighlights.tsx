import React, { Component } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { cloneDeep, remove } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { RecordAssetRepository } from '@homzhub/common/src/domain/repositories/RecordAssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { CheckboxGroup, ICheckboxGroupData } from '@homzhub/common/src/components/molecules/CheckboxGroup';
import AssetHighlightCard from '@homzhub/mobile/src/components/molecules/AssetHighlightCard';
import { AssetListingSection } from '@homzhub/mobile/src/components/HOC/AssetListingSection';
import { AssetAmenity } from '@homzhub/common/src/domain/models/Amenity';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { IUpdateAssetParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { OtherDetails } from '@homzhub/common/src/constants/AssetHighlights';

enum Details {
  powerBackup = 'Power backup',
  isGated = 'Gated Society',
  cornerProperty = 'Corner Property',
  allDayAccess = '24x7 Access',
}

export interface IOtherDetail {
  id: number;
  name: string;
  details: ICheckboxGroupData[];
}

interface IState {
  assetAmenity: AssetAmenity[];
  propertyHighlight: string[];
  selectedAmenity: number[];
  otherDetails: ICheckboxGroupData[];
  selectedDetails: string[];
  isSelected: boolean;
}

interface IHighlightProps {
  handleNextStep: () => void;
  propertyId: number;
  propertyDetail: Asset | null;
  lastVisitedStep: ILastVisitedStep;
}

type Props = IHighlightProps & WithTranslation;

export class AssetHighlights extends Component<Props, IState> {
  public state = {
    assetAmenity: [],
    propertyHighlight: [''],
    selectedAmenity: [],
    otherDetails: [],
    selectedDetails: [],
    isSelected: false,
  };

  public componentDidMount = async (): Promise<void> => {
    const { propertyDetail } = this.props;
    await this.getAmenities();
    const propertyType = propertyDetail ? propertyDetail.assetGroup.name : '';
    const data = OtherDetails.find((item: IOtherDetail) => item.name === propertyType);
    if (data) {
      this.setState({
        otherDetails: [...data.details],
      });
    }
    if (propertyDetail) {
      this.getSelectedData(propertyDetail);
    }
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { selectedAmenity, selectedDetails, propertyHighlight } = this.state;
    const highlights = propertyHighlight.filter((item) => item);
    const isButtonDisabled = selectedAmenity.length <= 0 && selectedDetails.length <= 0 && highlights.length <= 0;
    return (
      <View style={styles.container}>
        {this.renderAmenities()}
        {this.renderOtherDetails()}
        {this.renderOtherHighlights()}
        <Button
          type="primary"
          title={t('continue')}
          disabled={isButtonDisabled}
          containerStyle={styles.buttonStyle}
          onPress={this.handleContinue}
        />
      </View>
    );
  }

  private renderAmenities = (): React.ReactElement[] => {
    const { assetAmenity, selectedAmenity } = this.state;
    return assetAmenity.map((item: AssetAmenity) => {
      const title = this.getAmenitiesTitle(item.name);
      return (
        <AssetHighlightCard
          title={title}
          data={item.amenities}
          key={item.id}
          selectedAmenity={selectedAmenity}
          onAmenityPress={this.onSelectAmenity}
        />
      );
    });
  };

  private renderOtherDetails = (): React.ReactElement | null => {
    const { t } = this.props;
    const { otherDetails, isSelected } = this.state;

    return (
      <AssetListingSection title={t('property:otherDetails')} containerStyles={styles.card}>
        <CheckboxGroup key={`${isSelected}-checkbox`} data={otherDetails} onToggle={this.onPressCheckbox} />
      </AssetListingSection>
    );
  };

  private renderOtherHighlights = (): React.ReactElement => {
    const { propertyHighlight } = this.state;
    const { t } = this.props;
    return (
      <AssetListingSection title={t('property:propertyHighlights')} containerStyles={styles.card}>
        <View style={styles.highlightsContainer}>
          {propertyHighlight.map((item, index) => {
            return (
              <View style={styles.textInputContainer} key={index}>
                <TextInput
                  placeholder={t('property:highlightPlaceholder')}
                  autoCorrect={false}
                  autoCapitalize="none"
                  numberOfLines={1}
                  value={propertyHighlight[index]}
                  onChangeText={(text): void => this.handleTextChange(text, index)}
                  style={styles.textInput}
                />
                {propertyHighlight.length > 1 && index > 0 && (
                  <Button
                    type="primary"
                    icon={icons.circularCrossFilled}
                    iconSize={20}
                    iconColor={theme.colors.darkTint9}
                    containerStyle={styles.iconButton}
                    onPress={(): void => this.onPressCross(index)}
                    testID="btnCross"
                  />
                )}
              </View>
            );
          })}
          {propertyHighlight.length !== 5 && (
            <Button type="secondary" title={t('add')} containerStyle={styles.addButton} onPress={this.handleNext} />
          )}
        </View>
      </AssetListingSection>
    );
  };

  private onPressCross = (index: number): void => {
    const { propertyHighlight } = this.state;
    if (propertyHighlight[index]) {
      const newData: string[] = propertyHighlight;
      newData[index] = '';
      this.setState({
        propertyHighlight: newData,
      });
    } else {
      this.setState({
        propertyHighlight: propertyHighlight.slice(0, -1),
      });
    }
  };

  private onPressCheckbox = (id: number | string, isChecked: boolean): void => {
    const { otherDetails, isSelected } = this.state;
    const selectedValues: string[] = [];

    otherDetails.forEach((detail: ICheckboxGroupData) => {
      if (detail.id === id) {
        detail.isSelected = isChecked;
      }
      if (detail.isSelected) {
        selectedValues.push(detail.label);
      }
    });

    this.setState({ otherDetails, selectedDetails: selectedValues, isSelected: !isSelected });
  };

  private onSelectAmenity = (id: number): void => {
    const { selectedAmenity } = this.state;
    const newAmenity: number[] = cloneDeep(selectedAmenity);
    let value: number[];
    if (newAmenity.includes(id)) {
      remove(newAmenity, (item: number) => item === id);
      value = newAmenity;
    } else {
      value = newAmenity.concat(id);
    }
    this.setState({ selectedAmenity: value });
  };

  private getSelectedData = (propertyDetail: Asset): void => {
    const { selectedAmenity, otherDetails } = this.state;
    const toUpdate = [...otherDetails];
    const newSelectedValues: number[] = selectedAmenity;
    const { amenityGroup, isGated, powerBackup, allDayAccess, cornerProperty, assetHighlights } = propertyDetail;
    if (amenityGroup) {
      amenityGroup.amenities.forEach((item) => {
        newSelectedValues.push(item.id);
      });

      this.setState({
        selectedAmenity: newSelectedValues,
      });
    }
    toUpdate.forEach((item: ICheckboxGroupData) => {
      switch (item.label) {
        case Details.isGated:
          item.isSelected = isGated;
          break;
        case Details.powerBackup:
          item.isSelected = powerBackup;
          break;
        case Details.cornerProperty:
          item.isSelected = cornerProperty;
          break;
        case Details.allDayAccess:
          item.isSelected = allDayAccess;
          break;
        default:
          item.isSelected = false;
      }
    });
    this.setState({ otherDetails: toUpdate });

    if (assetHighlights.length > 0) {
      this.setState({
        propertyHighlight: assetHighlights,
      });
    }
  };

  private getAmenitiesTitle = (name: string): string => {
    const { t } = this.props;
    if (name === 'General') {
      return t('property:amenities');
    }
    return name;
  };

  private handleContinue = async (): Promise<void> => {
    const { handleNextStep, propertyId, lastVisitedStep } = this.props;
    const { isGated, allDayAccess, cornerProperty, powerBackup } = Details;
    const { selectedAmenity, propertyHighlight, selectedDetails } = this.state;

    const otherDetails: string[] = selectedDetails;
    const highlights = propertyHighlight.filter((item) => item);

    const payload: IUpdateAssetParams = {
      amenities: selectedAmenity,
      asset_highlights: highlights,
      last_visited_step: {
        ...lastVisitedStep,
        asset_creation: {
          ...lastVisitedStep.asset_creation,
          is_highlights_done: true,
          total_step: 4,
        },
      },
      is_gated: otherDetails.includes(isGated),
      power_backup: otherDetails.includes(powerBackup),
      all_day_access: otherDetails.includes(allDayAccess),
      corner_property: otherDetails.includes(cornerProperty),
    };
    try {
      await AssetRepository.updateAsset(propertyId, payload);
      handleNextStep();
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private handleNext = (): void => {
    const { propertyHighlight } = this.state;
    this.setState({
      propertyHighlight: [...propertyHighlight, ''],
    });
  };

  private handleTextChange = (text: string, index: number): void => {
    const { propertyHighlight } = this.state;
    const newData: string[] = propertyHighlight;
    newData[index] = text;
    this.setState({
      propertyHighlight: newData,
    });
  };

  private getAmenities = async (): Promise<void> => {
    try {
      const response = await RecordAssetRepository.getAmenities();
      this.setState({ assetAmenity: response });
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e);
      AlertHelper.error({ message: error });
    }
  };
}

export default withTranslation()(AssetHighlights);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  buttonStyle: {
    flex: 0,
    marginBottom: 28,
  },
  card: {
    marginBottom: 16,
  },
  iconButton: {
    flex: 0,
    backgroundColor: theme.colors.secondaryColor,
  },
  textInputContainer: {
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    borderColor: theme.colors.darkTint10,
  },
  highlightsContainer: {
    padding: 14,
  },
  textInput: {
    flex: 1,
  },
  addButton: {
    flex: 0,
    marginTop: 8,
    borderStyle: 'dashed',
  },
});
