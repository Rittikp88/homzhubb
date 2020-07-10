import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider, SVGUri, Text } from '@homzhub/common/src/components';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';

interface IProps {
  data: any[];
  propertyId: number;
  isFavorite: boolean;
  onFavorite: (index: number) => void;
}

interface IPropertyListCardState {
  ref: any;
  activeSlide: number;
}

type Props = IProps;

class PropertyListCard extends React.Component<Props, IPropertyListCardState> {
  public state = {
    ref: null,
    activeSlide: 0,
  };

  public render(): React.ReactElement {
    return (
      <View style={styles.container}>
        {this.renderCarousel()}
        {this.renderPropertyTypeAndBadges()}
        {this.renderPropertyAddress()}
        <Divider containerStyles={styles.divider} />
        <View style={styles.amenities}>
          <Text type="regular" textType="bold" style={styles.propertyNameText}>
            Rs 32000/ mo
          </Text>
          <View style={styles.apartmentContainer}>
            <Icon name={icons.bed} size={40} color={theme.colors.darkTint5} onPress={this.previousSlide} />
            <Icon name={icons.bathTub} size={40} color={theme.colors.darkTint5} onPress={this.previousSlide} />
            <Icon name={icons.star} size={40} color={theme.colors.darkTint5} onPress={this.previousSlide} />
          </View>
        </View>
      </View>
    );
  }

  public renderCarousel = (): React.ReactElement => {
    const { data, isFavorite } = this.props;
    const { activeSlide } = this.state;
    return (
      <View style={styles.carouselContainer}>
        <SnapCarousel
          bubbleRef={this.updateRef}
          carouselData={data}
          carouselItem={this.renderCarouselItem}
          activeSlide={activeSlide}
          currentSlide={this.changeSlide}
        />
        <View style={styles.overlay}>
          <View style={styles.favoriteContainer}>
            <Icon
              name={icons.bed}
              size={50}
              color={isFavorite ? theme.colors.primaryColor : theme.colors.white}
              onPress={this.onFavorite}
            />
          </View>
          <View style={styles.arrowContainer}>
            <Icon
              name={icons.map}
              size={50}
              color={activeSlide === 0 ? theme.colors.darkTint10 : theme.colors.shadow}
              onPress={this.previousSlide}
            />
            <Icon
              name={icons.star}
              size={50}
              color={activeSlide === data.length - 1 ? theme.colors.darkTint10 : theme.colors.shadow}
              onPress={this.nextSlide}
            />
          </View>
        </View>
      </View>
    );
  };

  public renderPropertyTypeAndBadges = (): React.ReactElement => {
    return (
      <View style={styles.apartmentContainer}>
        <Text type="small" textType="regular" style={styles.propertyTypeText}>
          Apartment
        </Text>
        <View style={styles.badges}>
          <Icon name={icons.biometric} size={33} color={theme.colors.warning} onPress={this.previousSlide} />
          <Icon name={icons.biometric} size={33} color={theme.colors.warning} onPress={this.previousSlide} />
          <Icon name={icons.biometric} size={33} color={theme.colors.darkTint5} onPress={this.previousSlide} />
        </View>
      </View>
    );
  };

  public renderPropertyAddress = (): React.ReactElement => {
    return (
      <View style={styles.propertyAddressContainer}>
        <Text type="regular" textType="semiBold" style={styles.propertyNameText}>
          Selway Apartments
        </Text>
        <View style={styles.flexRow}>
          <Icon name={icons.location} size={40} color={theme.colors.darkTint5} onPress={this.previousSlide} />
          <Text type="small" textType="regular" style={styles.subAddress}>
            2972 Westheimer Rd. Santa Ana, NY
          </Text>
        </View>
      </View>
    );
  };

  private renderCarouselItem = (item: any): React.ReactElement => {
    return <SVGUri viewBox="0 10 360 220" uri={item.image_url} />;
  };

  public onFavorite = (): void => {
    const { onFavorite, propertyId } = this.props;
    onFavorite(propertyId);
  };

  public updateRef = (ref: any): void => {
    this.setState({ ref });
  };

  public changeSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  public previousSlide = (): void => {
    const { ref } = this.state;
    // @ts-ignore
    ref.snapToPrev();
  };

  public nextSlide = (): void => {
    const { ref } = this.state;
    // @ts-ignore
    ref.snapToNext();
  };
}

export default PropertyListCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 10,
    justifyContent: 'space-between',
    borderRadius: 4,
    marginVertical: 10,
  },
  carouselContainer: {
    position: 'relative',
    borderRadius: 4,
    height: 250,
    borderColor: theme.colors.darkTint5,
    borderWidth: 1,
  },
  favoriteContainer: {
    flexDirection: 'row-reverse',
    margin: 15,
  },
  arrowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
    marginVertical: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  apartmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  propertyTypeText: {
    color: theme.colors.primaryColor,
  },
  propertyAddressContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  propertyNameText: {
    color: theme.colors.shadow,
  },
  flexRow: {
    flexDirection: 'row',
  },
  subAddress: {
    color: theme.colors.darkTint5,
    marginVertical: 10,
  },
  divider: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.disabled,
  },
  amenities: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
