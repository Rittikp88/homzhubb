import React, { Component } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { RecordAssetRepository } from '@homzhub/common/src/domain/repositories/RecordAssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button, CheckboxGroup, Text, WithShadowView } from '@homzhub/common/src/components';
import AssetHighlightCard from '@homzhub/mobile/src/components/molecules/AssetHighlightCard';
import { Amenity } from '@homzhub/common/src/domain/models/Amenity';

interface IState {
  amenities: Amenity[];
  sports: Amenity[];
  extraData: number[];
  otherHighlight: string[];
}

interface IHighlightProps {
  handleNextStep: () => void;
}

// TODO: (Shikha) - Need to refactor once API integrate
const data = [
  {
    id: 1,
    label: 'Power backup',
    isSelected: false,
  },
  {
    id: 1,
    label: '24x7 Access ',
    isSelected: false,
  },
  {
    id: 1,
    label: 'Corner Property',
    isSelected: false,
  },
];

type Props = IHighlightProps & WithTranslation;

export class AssetHighlights extends Component<Props, IState> {
  public state = {
    amenities: [],
    sports: [],
    extraData: [0],
    otherHighlight: [],
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAmenities();
  };

  public render(): React.ReactNode {
    const { amenities, sports } = this.state;
    const { t, handleNextStep } = this.props;
    return (
      <>
        <View style={styles.container}>
          <AssetHighlightCard title="Amenities" data={amenities} />
          <AssetHighlightCard title="Sports" data={sports} />
          {this.renderOtherDetails()}
          {this.renderOtherHighlights()}
        </View>
        <WithShadowView>
          <Button type="primary" title={t('continue')} containerStyle={styles.buttonStyle} onPress={handleNextStep} />
        </WithShadowView>
      </>
    );
  }

  private renderOtherDetails = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text type="small" textType="semiBold" style={styles.headerTitle}>
            {t('property:otherDetails')}
          </Text>
        </View>
        <CheckboxGroup data={data} onToggle={FunctionUtils.noop} containerStyle={styles.checkboxGroup} />
      </View>
    );
  };

  private renderOtherHighlights = (): React.ReactElement => {
    const { extraData, otherHighlight } = this.state;
    const { t } = this.props;
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text type="small" textType="semiBold" style={styles.headerTitle}>
            {t('property:otherHighlights')}
          </Text>
        </View>
        <View style={styles.highlightsContainer}>
          {extraData.map((item, index) => {
            return (
              <View style={styles.textInputContainer} key={index}>
                <TextInput
                  placeholder={t('property:highlightPlaceholder')}
                  autoCorrect={false}
                  autoCapitalize="none"
                  numberOfLines={1}
                  value={otherHighlight[index]}
                  onChangeText={(text): void => this.handleTextChange(text, index)}
                  style={styles.textInput}
                />
                {extraData.length > 1 && index > 0 && (
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
          {extraData.length !== 5 && (
            <Button type="secondary" title={t('add')} containerStyle={styles.addButton} onPress={this.handleNext} />
          )}
        </View>
      </View>
    );
  };

  private onPressCross = (index: number): void => {
    const { extraData, otherHighlight } = this.state;
    if (otherHighlight[index]) {
      const newData: string[] = otherHighlight;
      newData[index] = '';
      this.setState({
        otherHighlight: newData,
      });
    } else {
      this.setState({
        extraData: extraData.slice(0, -1),
      });
    }
  };

  private handleNext = (): void => {
    const { extraData } = this.state;
    const lastValue = extraData[extraData.length - 1];
    this.setState({
      extraData: [...extraData, lastValue + 1],
    });
  };

  private handleTextChange = (text: string, index: number): void => {
    const { otherHighlight } = this.state;
    const newData: string[] = otherHighlight;
    newData[index] = text;
    this.setState({
      otherHighlight: newData,
    });
  };

  private getAmenities = async (): Promise<void> => {
    try {
      const response = await RecordAssetRepository.getAmenities();
      response.forEach((item) => {
        if (item.name === 'Sports') {
          this.setState({ sports: item.amenities });
        } else {
          this.setState({ amenities: item.amenities });
        }
      });
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e);
      AlertHelper.error({ message: error });
    }
  };
}

export default withTranslation()(AssetHighlights);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: theme.colors.white,
  },
  header: {
    backgroundColor: theme.colors.moreSeparator,
  },
  headerTitle: {
    padding: 16,
    color: theme.colors.darkTint3,
  },
  iconButton: {
    backgroundColor: theme.colors.secondaryColor,
    flex: 0,
  },
  textInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    borderColor: theme.colors.darkTint10,
  },
  checkboxGroup: {
    padding: 16,
  },
  highlightsContainer: {
    padding: 16,
  },
  textInput: {
    flex: 1,
  },
  addButton: {
    borderStyle: 'dashed',
    marginTop: 8,
  },
});
