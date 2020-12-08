import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Counter } from '@homzhub/common/src/components/atoms/Counter';
import { RNSwitch } from '@homzhub/common/src/components/atoms/Switch';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { UncontrolledCheckboxGroup } from '@homzhub/common/src/components/molecules/UncontrolledCheckboxGroup';
import { ICheckboxGroupData } from '@homzhub/common/src/components/molecules/CheckboxGroup';
import { InputWithCheckbox } from '@homzhub/common/src/components/molecules/InputWithCheckbox';
import { SpaceFieldTypes, SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';

interface IGroupedSpaceType {
  [SpaceFieldTypes.Counter]?: SpaceType[];
  [SpaceFieldTypes.CheckBox]?: SpaceType[];
  [SpaceFieldTypes.TextBox]?: SpaceType[];
}

export enum FlowTypes {
  PostAssetFlow = 'AddPropertyFlow',
  LeaseFlow = 'LeaseFlow',
}

interface IOwnProps extends WithTranslation {
  spacesTypes: SpaceType[];
  onChange: (id: number, count: number, description?: string) => void;
  flowType?: FlowTypes;
  isEditPropertyFlow?: boolean;
}

interface IOwnState {
  showMore: boolean;
  groupedSpaceTypes: IGroupedSpaceType;
}

class PropertySpaces extends React.PureComponent<IOwnProps, IOwnState> {
  constructor(props: IOwnProps) {
    super(props);

    this.state = {
      showMore: false,
      groupedSpaceTypes: this.groupSpaceTypes(),
    };
  }

  public static getDerivedStateFromProps(props: IOwnProps, state: IOwnState): IOwnState {
    return {
      showMore: state.showMore,
      groupedSpaceTypes: props.spacesTypes.reduce((accumulator: any, currentSpace) => {
        const key: string = currentSpace.fieldType;
        if (!accumulator[key]) {
          accumulator[key] = [];
        }

        accumulator[key].push(currentSpace);
        return accumulator;
      }, {}),
    };
  }

  public render(): React.ReactNode {
    const { showMore, groupedSpaceTypes } = this.state;
    const { flowType, spacesTypes, t } = this.props;

    const moreItems = spacesTypes.findIndex((space) => !space.isPrimary);
    if (!groupedSpaceTypes) {
      return null;
    }

    return (
      <View style={styles.containerStyle}>
        {this.renderSpaces(true)}

        {(flowType !== FlowTypes.LeaseFlow || moreItems > -1) && (
          <View style={[styles.rowStyle, styles.marginBottom]}>
            <Icon name={icons.threeDots} size={24} />
            <Text type="small" style={styles.moreText}>
              {t('assetMore:more')}
            </Text>
            <RNSwitch selected={showMore} onToggle={this.toggleMoreSwitch} />
          </View>
        )}

        <View style={!showMore ? styles.displayNone : undefined}>{this.renderSpaces(false)}</View>
      </View>
    );
  }

  private renderSpaces = (renderPrimary: boolean): React.ReactNode => {
    const { t, flowType, isEditPropertyFlow } = this.props;
    const { groupedSpaceTypes } = this.state;
    const handleCounterChange = (count: number, id?: number): void => {
      this.handleSpacesChange(id || -1, count);
    };

    const handleCheckboxGroupToggle = (id: number | string, isSelected: boolean): void => {
      this.handleSpacesChange(id as number, isSelected ? 1 : 0);
    };

    /* This part of the method renders Counters */
    const counterLength = groupedSpaceTypes[SpaceFieldTypes.Counter]?.length ?? 0;
    const spaceFields = groupedSpaceTypes[SpaceFieldTypes.Counter]?.map((space, index) => {
      if (space.isPrimary !== renderPrimary) {
        return null;
      }

      return (
        <Counter
          key={index}
          containerStyles={index !== counterLength - 1 && styles.marginBottom}
          defaultValue={space.unitCount ? space.unitCount : space.isMandatory ? 1 : 0}
          name={{ title: space.name, id: space.id }}
          svgImage={space.attachment && space.attachment.link}
          onValueChange={handleCounterChange}
          maxCount={flowType === FlowTypes.PostAssetFlow ? undefined : space.count}
          minCount={space.isMandatory ? 1 : 0}
          disabled={isEditPropertyFlow && space.isPrimary}
        />
      );
    });

    /* This part of the method renders Checkbox */
    spaceFields?.push(
      <UncontrolledCheckboxGroup
        key="UncontrolledCheckboxGroup"
        containerStyle={styles.marginTop}
        data={this.loadCheckboxData(renderPrimary)}
        onToggle={handleCheckboxGroupToggle}
      />
    );

    /* This part of the method renders text input field with checkbox */
    groupedSpaceTypes[SpaceFieldTypes.TextBox]?.forEach((space, index) => {
      if (space.isPrimary !== renderPrimary) {
        return;
      }

      const handleInputWithCheckChange = (isSelected: boolean, text: string): void => {
        const count = isSelected ? 1 : 0;
        this.handleSpacesChange(space.id, count, text);
      };

      spaceFields?.push(
        <InputWithCheckbox
          textValue={space.description}
          selected={!!space.unitCount}
          key={index}
          onChange={handleInputWithCheckChange}
          placeholder={t('property:specifyOthersText')}
        />
      );
    });

    return spaceFields;
  };

  private handleSpacesChange = (id: number, count: number, description?: string): void => {
    const { onChange } = this.props;
    this.setState({ groupedSpaceTypes: this.groupSpaceTypes() });

    onChange(id, count, description);
  };

  private loadCheckboxData = (renderPrimary: boolean): ICheckboxGroupData[] => {
    const { groupedSpaceTypes } = this.state;
    const checkboxData: any = [];

    groupedSpaceTypes[SpaceFieldTypes.CheckBox]?.forEach((space) => {
      if (space.isPrimary === renderPrimary) {
        checkboxData.push({
          id: space.id,
          label: space.name,
          isSelected: !!space.unitCount,
          isDisabled: space.isDisabled,
        });
      }
    });
    return checkboxData;
  };

  private groupSpaceTypes = (): IGroupedSpaceType => {
    const { spacesTypes } = this.props;

    return spacesTypes.reduce((accumulator: any, currentSpace) => {
      const key: string = currentSpace.fieldType;
      if (!accumulator[key]) {
        accumulator[key] = [];
      }

      accumulator[key].push(currentSpace);
      return accumulator;
    }, {});
  };

  private toggleMoreSwitch = (): void => {
    this.setState((prev) => ({
      showMore: !prev.showMore,
    }));
  };
}

const propertySpaces = withTranslation()(PropertySpaces);
export { propertySpaces as PropertySpaces };

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.layout.screenPadding,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marginBottom: {
    marginBottom: 24,
  },
  marginTop: {
    marginTop: 16,
  },
  displayNone: {
    display: 'none',
  },
  moreText: {
    marginStart: 12,
    flex: 1,
  },
});
