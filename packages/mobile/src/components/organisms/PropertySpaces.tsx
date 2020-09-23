import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { CheckboxGroup, Counter, ICheckboxGroupData, RNSwitch, Text } from '@homzhub/common/src/components';
import { SpaceFieldTypes, SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';

interface IGroupedSpaceType {
  [SpaceFieldTypes.Counter]?: SpaceType[];
  [SpaceFieldTypes.CheckBox]?: SpaceType[];
  [SpaceFieldTypes.TextBox]?: SpaceType[];
}

interface IOwnProps extends WithTranslation {
  spacesTypes: SpaceType[];
}

interface IOwnState {
  showMore: boolean;
  groupedSpaceTypes: IGroupedSpaceType;
}

class PropertySpaces extends React.PureComponent<IOwnProps, IOwnState> {
  constructor(props: IOwnProps) {
    super(props);

    this.state = {
      showMore: true,
      groupedSpaceTypes: this.groupSpaceTypes(),
    };
  }

  public render(): React.ReactNode {
    const { showMore, groupedSpaceTypes } = this.state;

    if (!groupedSpaceTypes) {
      return null;
    }

    return (
      <View style={styles.containerStyle}>
        {this.renderSpaces(true)}

        <View style={[styles.rowStyle, styles.marginBottom]}>
          <Text type="small">More</Text>
          <RNSwitch selected={showMore} onToggle={this.toggleMoreSwitch} />
        </View>

        {showMore && this.renderSpaces(false)}
      </View>
    );
  }

  private renderSpaces = (renderPrimary: boolean): React.ReactNode => {
    const { groupedSpaceTypes } = this.state;

    const counterFields = groupedSpaceTypes[SpaceFieldTypes.Counter]?.map((space, index) => {
      if (space.isPrimary !== renderPrimary) {
        return null;
      }

      return (
        <Counter
          key={index}
          containerStyles={styles.marginBottom}
          defaultValue={0}
          name={{ title: space.name, id: space.id }}
          svgImage={space.attachment && space.attachment.link}
          onValueChange={(): void => {}}
        />
      );
    });

    const checkboxFields = (
      <CheckboxGroup
        containerStyle={styles.marginBottom}
        data={this.loadCheckboxData(renderPrimary)}
        onToggle={(): void => {}}
      />
    );

    return counterFields?.concat(checkboxFields);
  };

  private loadCheckboxData = (renderPrimary: boolean): ICheckboxGroupData[] => {
    const { groupedSpaceTypes } = this.state;
    const checkboxData: any = [];

    groupedSpaceTypes[SpaceFieldTypes.CheckBox]?.forEach((space) => {
      if (space.isPrimary === renderPrimary) {
        checkboxData.push({ id: space.id, label: space.name, isSelected: false });
      }
    });
    return checkboxData;
  };

  private groupSpaceTypes = (): any => {
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
    paddingTop: theme.layout.screenPadding,
    paddingBottom: 24,
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginBottom: {
    marginBottom: 24,
  },
});
