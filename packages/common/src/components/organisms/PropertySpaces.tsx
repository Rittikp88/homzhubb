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
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';

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

type IProps = IOwnProps & IWithMediaQuery;

class PropertySpaces extends React.PureComponent<IProps, IOwnState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      showMore: false,
      groupedSpaceTypes: this.groupSpaceTypes(),
    };
  }

  public static getDerivedStateFromProps(props: IProps, state: IOwnState): IOwnState {
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
    const { flowType, spacesTypes, isMobile, t } = this.props;

    const moreItems = spacesTypes.findIndex((space) => !space.isPrimary);
    if (!groupedSpaceTypes) {
      return null;
    }

    const shouldRenderSwitch = isMobile && (flowType !== FlowTypes.LeaseFlow || moreItems > -1);

    return (
      <View style={styles.containerStyle}>
        {this.renderSpaces(true)}

        {shouldRenderSwitch && (
          <View style={[styles.rowStyle, styles.marginBottom]}>
            <Icon name={icons.threeDots} size={24} />
            <Text type="small" style={styles.moreText}>
              {t('assetMore:more')}
            </Text>
            <RNSwitch selected={showMore} onToggle={this.toggleMoreSwitch} />
          </View>
        )}

        {!isMobile ? this.renderSpaces(false) : !showMore ? null : this.renderSpaces(false)}
      </View>
    );
  }

  private renderSpaces = (renderPrimary: boolean): React.ReactNode => {
    const { t, flowType, isEditPropertyFlow, isMobile } = this.props;
    const { groupedSpaceTypes } = this.state;
    const handleCounterChange = (count: number, id?: number): void => {
      this.handleSpacesChange(id || -1, count);
    };

    const handleCheckboxGroupToggle = (id: number | string, isSelected: boolean): void => {
      this.handleSpacesChange(id as number, isSelected ? 1 : 0);
    };

    /* This part of the method renders Counters */
    const counterLength = groupedSpaceTypes[SpaceFieldTypes.Counter]?.length ?? 0;
    const spaceFields = [];
    spaceFields?.push(
      <View style={!isMobile && styles.counterContainer}>
        {groupedSpaceTypes[SpaceFieldTypes.Counter]?.map((space, index) => {
          if (space.isPrimary !== renderPrimary) {
            return null;
          }

          return (
            <Counter
              key={index}
              containerStyles={[
                styles.counter,
                index % 3 === 0 && styles.noMarginLeft,
                isMobile && styles.counterMobile,
                isMobile && index !== counterLength - 1 && styles.counterLast,
              ]}
              defaultValue={space.unitCount ? space.unitCount : space.isMandatory ? 1 : 0}
              name={{ title: space.name, id: space.id }}
              svgImage={space.attachment && space.attachment.link}
              onValueChange={handleCounterChange}
              maxCount={flowType === FlowTypes.PostAssetFlow ? undefined : space.count}
              minCount={space.isMandatory ? 1 : 0}
              disabled={isEditPropertyFlow && space.isPrimary}
            />
          );
        })}
      </View>
    );

    /* This part of the method renders Checkbox */
    spaceFields?.push(
      <View style={{}}>
        <UncontrolledCheckboxGroup
          key="UncontrolledCheckboxGroup"
          containerStyle={[!isMobile && styles.uncontrolledCheckbox]}
          data={this.loadCheckboxData(renderPrimary)}
          onToggle={handleCheckboxGroupToggle}
        />
      </View>
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
          containerStyle={[styles.checkboxInput, isMobile && styles.checkboxInputMobile]}
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

const translatedPropertySpaces = withTranslation()(PropertySpaces);
const propertySpaces = withMediaQuery<any>(translatedPropertySpaces);
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
  checkboxInput: {
    width: '30%',
  },
  checkboxInputMobile: {
    width: undefined,
  },
  counterContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  counter: {
    width: '25%',
    marginLeft: 60,
    marginBottom: 24,
  },
  counterMobile: {
    width: undefined,
    marginLeft: undefined,
  },
  counterLast: {
    marginBottom: 24,
  },
  noMarginLeft: {
    marginLeft: undefined,
  },
  marginBottom: {
    marginBottom: 24,
  },
  uncontrolledCheckbox: {
    flex: 0.16,
    marginTop: 16,
  },
  moreText: {
    marginStart: 12,
    flex: 1,
  },
});