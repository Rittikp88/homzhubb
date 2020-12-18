import React, { useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { ImageSquare } from '@homzhub/common/src/components/atoms/Image';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';

const defaultResponsive = {
  desktop: {
    breakpoint: { max: 1440, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};
const CarouselProps = {
  children: undefined,
  arrows: false,
  autoPlay: false,
  autoPlaySpeed: 3000,
  draggable: true,
  focusOnSelect: false,
  infinite: true,
  renderDotsOutside: true,
  responsive: defaultResponsive,
  showDots: false,
};
const LogsCards: React.FC = () => {
  const [setActive, setActiveState] = useState('');
  const [setHeight, setHeightState] = useState('0px');

  const content = useRef(null);

  const toggleAccordion = (): void => {
    setActiveState(setActive === '' ? 'active' : '');
    setHeightState(setActive === 'active' ? '0px' : '1500px');
  };
  return (
    <View style={styles.accordianContainer}>
      <TouchableOpacity onPress={toggleAccordion}>
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
      </TouchableOpacity>
      <View ref={content} style={[styles.accordianContent, { maxHeight: `${setHeight}` }]}>
        <View>
          <Label type="large" textType="regular" style={styles.contentLabel}>
            Ut enim sagittis dui lacus, in felis convallis pulvinar. Posuere integer eu sit mauris vitae in. Diam
            aliquam elit nullam in urna ornare cursus mattis luctus
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
        </View>
        <View style={styles.buttonWrapper}>
          <Button type="secondaryOutline" containerStyle={styles.buttonStyle}>
            <Icon name={icons.circularCheckFilled} color={theme.colors.blue} size={20} />
            <Typography variant="label" size="large" style={styles.buttonLabel}>
              Mark as close
            </Typography>
          </Button>
        </View>
        <TextArea wordCountLimit={200} placeholder="Type here..." value="123" containerStyle={styles.textArea} />
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
    margin: 10,
    marginLeft: 16,
  },
  firstChild: { flexDirection: 'row', justifyContent: 'space-between' },
  secondChild: { flexDirection: 'row', maxWidth: 400, justifyContent: 'space-between', marginTop: 16 },
  titleLabel: { color: theme.colors.darkTint3 },
  titleData: { color: theme.colors.darkTint3 },
  calender: {
    borderWidth: 1,
    borderColor: theme.colors.darkTint10,
    borderRadius: 4,
    alignItems: 'center',
    height: 60,
    width: 52,
    marginRight: 12,
  },
  divider: { borderColor: theme.colors.background },
  contentLeftChild: { flexDirection: 'row', justifyContent: 'space-around' },
  text1: { fontSize: 12, lineHeight: 19, color: theme.colors.darkTint4 },
  text2: { fontSize: 14, lineHeight: 19, color: theme.colors.darkTint3 },
  text3: { fontSize: 14, lineHeight: 19, color: theme.colors.darkTint3 },
  date: { fontSize: 14, color: theme.colors.darkTint2, marginTop: 10 },
  month: { marginTop: -8, fontSize: 12, textAlign: 'center', color: theme.colors.darkTint6 },
  leftChild: { flexDirection: 'row' },
  accordianContent: {
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
    transition: 'max-height 0.6s ease',
    borderRadius: 4,
    margin: 10,
    marginTop: -10,
  },
  title: { marginRight: 40, marginBottom: 20 },
  iconContainer: { flexDirection: 'row' },
  rightChild: { flexDirection: 'row' },
  icon: { marginLeft: 10 },
  amount: { fontSize: 16, lineHeight: 22, color: theme.colors.completed },
  name: { lineHeight: 19, marginTop: 25, color: theme.colors.darkTint2 },
  note: { lineHeight: 19, color: theme.colors.darkTint3, marginTop: 25 },
  attachment: { flexDirection: 'row', marginTop: 25 },
  attachmentText: { color: theme.colors.active, lineHeight: 19 },
  occupation: { color: theme.colors.darkTint3, margin: 20 },
  videoContainer: {
    height: 400,
    backgroundColor: theme.colors.background,
    margin: 16,
    alignItems: 'center',
  },
  textArea: {},
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
