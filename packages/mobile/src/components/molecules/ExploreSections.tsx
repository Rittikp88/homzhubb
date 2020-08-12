import React from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View } from 'react-native';
import { PlaceTypes } from '@homzhub/common/src/services/GooglePlaces/constants';
import { PointOfInterest } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Divider, Label, Text } from '@homzhub/common/src/components';

interface IPlaceTypeData {
  key: PlaceTypes;
  label: string;
  icon: string;
  mapMarker: string;
}

interface IProps {
  placeTypes: IPlaceTypeData[];
  selectedPlaceType: IPlaceTypeData;
  onPlaceTypePress: (newSection: PlaceTypes) => void;
  pointsOfInterest: PointOfInterest[];
  selectedPoiId: string;
  onPoiPress: (poi: PointOfInterest) => void;
}

class ExploreSections extends React.PureComponent<IProps> {
  public render = (): React.ReactNode => {
    const { placeTypes, pointsOfInterest, selectedPlaceType, selectedPoiId } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.shadowContainer}>
          <FlatList<IPlaceTypeData>
            horizontal
            showsHorizontalScrollIndicator={false}
            data={placeTypes}
            renderItem={this.renderSectionItem}
            contentContainerStyle={styles.sectionsContainer}
            extraData={selectedPlaceType.key}
            keyExtractor={this.keyExtractorSections}
          />
        </View>
        <FlatList<PointOfInterest>
          showsVerticalScrollIndicator={false}
          data={pointsOfInterest}
          ListHeaderComponent={this.renderListHeader}
          renderItem={this.renderPOI}
          contentContainerStyle={styles.resultContainer}
          extraData={selectedPoiId}
          keyExtractor={this.keyExtractorResult}
        />
      </View>
    );
  };

  private renderSectionItem = ({ item }: { item: IPlaceTypeData }): React.ReactElement => {
    const { selectedPlaceType, onPlaceTypePress } = this.props;
    const { icon, key } = item;
    let backgroundColor = theme.colors.background;
    let iconColor = theme.colors.active;

    if (key === selectedPlaceType.key) {
      backgroundColor = theme.colors.active;
      iconColor = theme.colors.white;
    }

    const onPress = (): void => onPlaceTypePress(key);

    return (
      <TouchableOpacity onPress={onPress} style={[styles.iconContainer, { backgroundColor }]}>
        <Icon size={24} name={icon} color={iconColor} />
      </TouchableOpacity>
    );
  };

  private renderListHeader = (): React.ReactElement => {
    const { selectedPlaceType } = this.props;

    return (
      <>
        <View style={styles.listHeader}>
          <Icon name={selectedPlaceType.icon} size={24} color={theme.colors.darkTint4} />
          <Text type="small" style={styles.title}>
            {`${selectedPlaceType.label}`}
          </Text>
        </View>
        <Divider containerStyles={styles.divider} />
      </>
    );
  };

  private renderPOI = ({ item }: { item: PointOfInterest }): React.ReactElement => {
    const { selectedPlaceType, selectedPoiId, onPoiPress } = this.props;

    let color = theme.colors.darkTint5;
    if (selectedPoiId === item.placeId) {
      color = theme.colors.active;
    }

    const onResultPress = (): void => {
      onPoiPress(item);
    };

    return (
      <TouchableOpacity onPress={onResultPress} style={styles.resultItem}>
        <View style={styles.resultNameContainer}>
          <Icon name={selectedPlaceType.mapMarker} size={16} color={color} />
          <Label type="large" style={[styles.title, { color }]} numberOfLines={1}>
            {item.name}
          </Label>
        </View>
        <Label type="regular" style={{ color }}>
          {`${item.distanceFromOrigin.toFixed(2)} Km`}
        </Label>
      </TouchableOpacity>
    );
  };

  private keyExtractorResult = (item: PointOfInterest): string => item.placeId;
  private keyExtractorSections = (item: IPlaceTypeData, index: number): string => `${item.key}-${index}`;
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
});

const memoizedComponent = React.memo(ExploreSections);
export { memoizedComponent as ExploreSections };
