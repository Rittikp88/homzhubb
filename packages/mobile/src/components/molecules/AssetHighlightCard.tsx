import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, SVGUri, Text } from '@homzhub/common/src/components';
import { PaginationComponent, SnapCarousel } from '@homzhub/mobile/src/components';
import { Amenity } from '@homzhub/common/src/domain/models/Amenity';

interface IProps {
  title: string;
  data: Amenity[];
  selectedAmenity: number[];
  onAmenityPress: (id: number) => void;
}

interface IState {
  activeSlide: number;
}

class AssetHighlightCard extends Component<IProps, IState> {
  public state = {
    activeSlide: 0,
  };

  public render(): React.ReactNode {
    const { title } = this.props;
    const { activeSlide } = this.state;
    const formattedData = this.getFormattedData();

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text type="small" textType="semiBold" style={styles.headerTitle}>
            {title}
          </Text>
        </View>
        <SnapCarousel
          carouselData={formattedData}
          carouselItem={this.carouselItem}
          activeIndex={activeSlide}
          onSnapToItem={this.onSnapToItem}
          containerStyle={styles.carouselContainer}
        />
        <PaginationComponent
          dotsLength={formattedData.length}
          activeSlide={activeSlide}
          activeDotStyle={styles.activeDot}
          inactiveDotStyle={styles.inactiveDot}
        />
      </View>
    );
  }

  private renderListItem = ({ item }: { item: Amenity }): React.ReactElement => {
    const { selectedAmenity, onAmenityPress } = this.props;
    const isSelected = selectedAmenity.includes(item.id);
    return (
      <TouchableOpacity style={styles.amenityItem} onPress={(): void => onAmenityPress(item.id)}>
        <SVGUri uri={item.attachment.link} height={30} width={30} />
        <Label type="regular" textType="regular" style={isSelected && { color: theme.colors.blue }}>
          {item.name}
        </Label>
      </TouchableOpacity>
    );
  };

  private onSnapToItem = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  private getFormattedData = (): Amenity[][] => {
    const { data } = this.props;
    let index;
    const arrayLength = data.length;
    const tempArray = [];
    let chunk = [];
    for (index = 0; index < arrayLength; index += 9) {
      chunk = data.slice(index, index + 9);
      tempArray.push(chunk);
    }
    return tempArray;
  };

  private carouselItem = (item: Amenity[]): React.ReactElement => {
    return (
      <FlatList
        data={item}
        numColumns={3}
        renderItem={this.renderListItem}
        contentContainerStyle={styles.listContainer}
      />
    );
  };
}

export default AssetHighlightCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: theme.colors.white,
  },
  header: {
    backgroundColor: theme.colors.moreSeparator,
  },
  headerTitle: {
    padding: 16,
    color: theme.colors.darkTint3,
  },
  carouselContainer: {
    alignSelf: 'center',
  },
  listContainer: {
    paddingTop: 16,
  },
  amenityItem: {
    width: (theme.viewport.width - 32) / 3,
    alignItems: 'center',
    marginBottom: 16,
  },
  activeDot: {
    borderWidth: 1,
  },
  inactiveDot: {
    backgroundColor: theme.colors.darkTint10,
    borderWidth: 0,
  },
});
