import React from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View } from 'react-native';
import { PlaceTypes } from '@homzhub/common/src/services/GooglePlaces/constants';
import { PointOfInterest } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Divider, Label, Text } from '@homzhub/common/src/components';

interface ISection {
  key: PlaceTypes;
  label: string;
  icon: string;
  mapMarker: string;
}

interface IProps {
  sections: ISection[];
  selectedPlaceType: PlaceTypes;
  selectedPlaceId: string;
  onSectionChange: (newSection: PlaceTypes) => void;
  onPoiPress: (poi: PointOfInterest) => void;
  results: PointOfInterest[];
}

class ExploreSections extends React.PureComponent<IProps> {
  public render = (): React.ReactNode => {
    const { sections, results, selectedPlaceType, selectedPlaceId } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.shadowContainer}>
          <FlatList<ISection>
            horizontal
            showsHorizontalScrollIndicator={false}
            data={sections}
            renderItem={this.renderSectionItem}
            contentContainerStyle={styles.sectionsContainer}
            extraData={selectedPlaceType}
            keyExtractor={this.keyExtractorSections}
          />
        </View>
        <FlatList<PointOfInterest>
          showsVerticalScrollIndicator={false}
          data={results}
          ListHeaderComponent={this.renderListHeader}
          renderItem={this.renderResult}
          contentContainerStyle={styles.resultContainer}
          extraData={selectedPlaceId}
          keyExtractor={this.keyExtractorResult}
        />
      </View>
    );
  };

  private renderSectionItem = ({ item }: { item: ISection }): React.ReactElement => {
    const { selectedPlaceType, onSectionChange } = this.props;
    const { icon, key } = item;
    let backgroundColor = theme.colors.background;
    let iconColor = theme.colors.active;

    if (key === selectedPlaceType) {
      backgroundColor = theme.colors.active;
      iconColor = theme.colors.white;
    }

    const onPress = (): void => onSectionChange(key);

    return (
      <TouchableOpacity onPress={onPress} style={[styles.iconContainer, { backgroundColor }]}>
        <Icon size={24} name={icon} color={iconColor} />
      </TouchableOpacity>
    );
  };

  private renderListHeader = (): React.ReactElement => {
    const { selectedPlaceType, sections } = this.props;
    const x = sections.find((section) => section.key === selectedPlaceType);

    return (
      <>
        <View style={styles.listHeader}>
          <Icon name={x?.icon} size={24} color={theme.colors.darkTint4} />
          <Text type="small" style={styles.title}>
            Some Title
          </Text>
        </View>
        <Divider containerStyles={styles.divider} />
      </>
    );
  };

  private renderResult = ({ item }: { item: PointOfInterest }): React.ReactElement => {
    const { selectedPlaceType, selectedPlaceId, sections, onPoiPress } = this.props;
    const x = sections.find((section) => section.key === selectedPlaceType);
    let color;

    if (selectedPlaceId === item.placeId) {
      color = theme.colors.active;
    }

    const onResultPress = (): void => {
      onPoiPress(item);
    };

    return (
      <TouchableOpacity onPress={onResultPress} style={styles.resultItem}>
        <View style={styles.resultNameContainer}>
          <Icon
            name={x?.mapMarker}
            size={16}
            color={selectedPlaceId === item.placeId ? theme.colors.active : theme.colors.darkTint5}
          />
          <Label type="large" style={[styles.title, { color }]} numberOfLines={1}>
            {item.name}
          </Label>
        </View>
        <Label type="regular" style={[styles.resultDistance, { color }]}>
          2.11 miles
        </Label>
      </TouchableOpacity>
    );
  };

  private keyExtractorResult = (item: PointOfInterest): string => item.placeId;
  private keyExtractorSections = (item: ISection, index: number): string => `${item.key}-${index}`;
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  iconContainer: {
    padding: 12,
    marginEnd: 16,
    borderRadius: 4,
    backgroundColor: theme.colors.background,
  },
  shadowContainer: {
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    paddingBottom: 12,
  },
  sectionsContainer: {
    paddingStart: 16,
  },
  resultContainer: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  listHeader: {
    flexDirection: 'row',
  },
  divider: {
    marginVertical: 12,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultNameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: 232,
    paddingStart: 12,
    color: theme.colors.darkTint4,
  },
  resultDistance: {
    color: theme.colors.darkTint5,
  },
});

const memoizedComponent = React.memo(ExploreSections);
export { memoizedComponent as ExploreSections };
