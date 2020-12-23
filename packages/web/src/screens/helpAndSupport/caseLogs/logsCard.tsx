import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { ImageSquare } from '@homzhub/common/src/components/atoms/Image';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import Accordian from '@homzhub/web/src/components/molecules/Accordian';

const defaultResponsive = {
  desktop: {
    breakpoint: { max: 3840, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const AccordianHeader: React.FC = () => {
  return (
    <View style={styles.accordianHeader}>
      <View style={styles.firstChild}>
        <View style={styles.leftChild}>
          <Text type="small" textType="regular" style={styles.titleContent}>
            My property images are not reflecting on the frontend.
          </Text>
        </View>
        <View style={styles.rightChild}>
          <Icon style={styles.icon} name={icons.downArrow} size={20} color={theme.colors.darkTint3} />
        </View>
      </View>
      <View style={styles.secondChild}>
        <View>
          <Label type="small" textType="regular" style={styles.titleLabel}>
            Case ID
          </Label>
          <Label type="regular" textType="semiBold" style={styles.titleData}>
            HOMZ1234
          </Label>
        </View>
        <View>
          <Label type="small" textType="regular" style={styles.titleLabel}>
            Date
          </Label>
          <Label type="regular" textType="semiBold" style={styles.titleData}>
            23/sept/2020
          </Label>
        </View>
        <View>
          <Label type="small" textType="regular" style={styles.titleData}>
            Status
          </Label>
          <Label type="regular" textType="semiBold" style={styles.titleData}>
            Approval PEnding
          </Label>
        </View>
      </View>
    </View>
  );
};

const CarouselProps = {
  children: undefined,
  arrows: false,
  autoPlay: false,
  draggable: true,
  focusOnSelect: false,
  infinite: true,
  renderDotsOutside: true,
  responsive: defaultResponsive,
  showDots: false,
};
const AccordianContent: React.FC = () => {
  return (
    <View style={styles.content}>
      <Label type="large" textType="regular" style={styles.contentLabel}>
        Ut enim sagittis dui lacus, in felis convallis pulvinar. Posuere integer eu sit mauris vitae in. Diam aliquam
        elit nullam in urna ornare cursus mattis luctus
      </Label>
      <MultiCarousel passedProps={CarouselProps}>
        <ImageSquare
          style={styles.image}
          size={50}
          source={{
            uri:
              'https://cdn57.androidauthority.net/wp-content/uploads/2020/04/oneplus-8-pro-ultra-wide-sample-twitter-1.jpg',
          }}
        />
        <ImageSquare
          style={styles.image}
          size={50}
          source={{
            uri:
              'https://cdn57.androidauthority.net/wp-content/uploads/2020/04/oneplus-8-pro-ultra-wide-sample-twitter-1.jpg',
          }}
        />
        <ImageSquare
          style={styles.image}
          size={50}
          source={{
            uri:
              'https://cdn57.androidauthority.net/wp-content/uploads/2020/04/oneplus-8-pro-ultra-wide-sample-twitter-1.jpg',
          }}
        />
      </MultiCarousel>

      <View style={styles.buttonWrapper}>
        <Button type="secondaryOutline" containerStyle={styles.buttonStyle}>
          <Icon name={icons.circularCheckFilled} color={theme.colors.blue} size={20} />
          <Typography variant="label" size="large" style={styles.buttonLabel}>
            Mark as close
          </Typography>
        </Button>
      </View>
      <TextArea wordCountLimit={200} placeholder="Type here..." value="123" />
      <View style={styles.buttonGroup}>
        <Button type="secondaryOutline" containerStyle={styles.buttonStyle1}>
          <Text type="small" textType="semiBold" style={styles.buttonLabel}>
            Cancle
          </Text>
        </Button>

        <Button type="primary" containerStyle={styles.buttonStyle1}>
          <Text type="small" textType="semiBold" style={styles.buttonLabel1}>
            Submit
          </Text>
        </Button>
      </View>
    </View>
  );
};

const LogsCards: React.FC = () => {
  return (
    <View style={styles.accordianContainer}>
      <Accordian headerComponent={<AccordianHeader />} accordianContent={<AccordianContent />} />
    </View>
  );
};

const styles = StyleSheet.create({
  titleContent: { color: theme.colors.darkTint2 },
  contentLabel: { color: theme.colors.darkTint4, margin: 16 },
  accordianContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    margin: 10,
    marginLeft: 20,
    borderColor: theme.colors.darkTint10,
    borderWidth: 1,
  },
  image: {
    flex: 1,
    minWidth: '100%',
    minHeight: 300,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    margin: 12,
  },
  accordianHeader: {
    margin: 8,
    marginLeft: 16,
  },
  firstChild: { flexDirection: 'row', justifyContent: 'space-between' },
  secondChild: { flexDirection: 'row', maxWidth: 400, justifyContent: 'space-between', marginTop: 16 },
  titleLabel: { color: theme.colors.darkTint3 },
  titleData: { color: theme.colors.darkTint3 },

  leftChild: { flexDirection: 'row' },
  content: { margin: 10, marginTop: -10 },
  rightChild: { flexDirection: 'row' },
  icon: { marginLeft: 10 },

  buttonWrapper: { alignItems: 'flex-end' },
  buttonStyle: {
    flexDirection: 'row',
    borderColor: theme.colors.disabled,
    maxWidth: 'max-content',
    height: 'max-content',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 4,
    margin: 10,
  },
  buttonGroup: { flexDirection: 'row', alignSelf: 'flex-end' },
  buttonLabel: { color: theme.colors.blue, margin: 4 },
  buttonLabel1: { color: theme.colors.white, margin: 4 },
  buttonStyle1: {
    flexDirection: 'row',
    borderColor: theme.colors.disabled,
    maxWidth: 'max-content',
    height: 'max-content',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 4,
    margin: 10,
  },
});
export default LogsCards;
