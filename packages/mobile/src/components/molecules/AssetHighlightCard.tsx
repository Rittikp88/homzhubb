import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, SVGUri, Text } from '@homzhub/common/src/components';
import { PaginationComponent, SnapCarousel } from '@homzhub/mobile/src/components';
import { Amenity } from '@homzhub/common/src/domain/models/Amenity';

interface IProps {
  title: string;
  data: Amenity[];
}

const AssetHighlightCard = (props: IProps): React.ReactElement => {
  const { title, data } = props;
  const [activeSlide, setActiveSlide] = useState(0);

  const onSnapToItem = (slideNumber: number): void => {
    setActiveSlide(slideNumber);
  };

  const getFormattedData = (): Amenity[][] => {
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

  const renderListItem = ({ item }: { item: Amenity }): React.ReactElement => {
    return (
      <View style={styles.amenityItem}>
        <SVGUri uri={item.attachment.link} height={30} width={30} />
        <Label type="regular" textType="regular">
          {item.name}
        </Label>
      </View>
    );
  };

  const carouselItem = (item: Amenity[]): React.ReactElement => {
    return (
      <FlatList data={item} numColumns={3} renderItem={renderListItem} contentContainerStyle={styles.listContainer} />
    );
  };

  const formattedData = getFormattedData();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text type="small" textType="semiBold" style={styles.headerTitle}>
          {title}
        </Text>
      </View>
      <SnapCarousel
        carouselData={formattedData}
        carouselItem={carouselItem}
        activeIndex={activeSlide}
        onSnapToItem={onSnapToItem}
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
};

export default AssetHighlightCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
