import React, { FC, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { GraphQLRepository } from '@homzhub/common/src/domain/repositories/GraphQLRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import SearchBarButton from '@homzhub/web/src/components/molecules/SearchBarButton';
import OurServicesSection from '@homzhub/web/src/screens/landing/components/OurServicesSection';
import FooterWithSocialMedia from '@homzhub/web/src/screens/landing/components/FooterWithSocialMedia';
import { FAQBanner } from '@homzhub/web/src/screens/faq/components/FaqBanner';
import QuestionCards from '@homzhub/web/src/screens/faq/components/questionCard';
import ContactUs from '@homzhub/web/src/screens/faq/components/contactUs';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { categoriesData, faqsData } from '@homzhub/web/src/screens/faq/mockData';

const FAQ: FC = () => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  // const [categories, setCategories] = useState([]);
  // const [faqs, setFAQs] = useState([]);
  const getCategories = async (): Promise<void> => {
    const response = await GraphQLRepository.getFAQAllCategories();
    // setCategories(response.data.categories); TODO: Lakshit: Remove once API Authorization is fixed.
    // setCategories(response);
    return response;
  };
  const getFAQs = async (): Promise<void> => {
    const response = await GraphQLRepository.getFAQAllQuestions();
    // setFAQs(response.data.faqs); TODO: Lakshit: Remove once API Authorization is fixed.
    // setFAQs(response);
    return response;
  };
  useEffect(() => {
    getCategories().then();
    getFAQs().then();
  }, []);
  const HeaderSection = (): React.ReactElement => {
    return (
      <View style={styles.categoryContainer}>
        {categoriesData.map((el) => (
          <View style={[styles.imageBox, isMobile && styles.imageBoxMobile]} key={el.id}>
            <Image
              source={require('@homzhub/common/src/assets/images/gettingStarted.svg')}
              style={[styles.imageContainer, isMobile && styles.imageContainerMobile]}
            />
            <Typography variant="label" size="large" fontWeight="semiBold" style={[styles.titleText]}>
              {el.title}
            </Typography>
          </View>
        ))}
      </View>
    );
  };
  const onSearchPress = (): void => {};
  return (
    <View style={styles.container}>
      <FAQBanner />
      <View style={styles.upperBackground}>
        <SearchBarButton containerStyle={styles.searchBar} onSearchPress={onSearchPress} />
        <View style={styles.headerContainer}>{HeaderSection()}</View>
        {faqsData && (
          <View style={[styles.faqCards, isTablet && styles.faqCardsMobile, isMobile && styles.faqCardsMobile]}>
            {faqsData.map((item) => (
              <View
                style={[styles.cards, isTablet && styles.cardsTablet, isMobile && styles.cardsMobile]}
                key={item.category.id}
              >
                <QuestionCards item={item} />
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.contactUsSection}>
        <ContactUs />
      </View>
      <OurServicesSection />
      <FooterWithSocialMedia />
    </View>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  upperBackground: {
    backgroundColor: theme.colors.background,
    marginBottom: 24,
  },
  headerContainer: {
    height: 'max-content',
  },
  cards: {
    width: '50%',
    marginBottom: 36,
  },
  faqCards: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  faqCardsMobile: {
    flexDirection: 'column',
  },
  cardsTablet: {
    marginLeft: 18,
    width: '94%',
  },
  cardsMobile: {
    width: '96%',
    margin: 'auto',
  },
  categoryContainer: {
    flex: 0.8,
    flexDirection: 'row',
    margin: 36,
    height: 100,
    flexWrap: 'wrap',
  },
  imageBox: {
    height: 132,
    width: 216,
    backgroundColor: 'white',
    border: `1px solid ${theme.colors.white}`,
    borderRadius: 8,
    shadowColor: theme.colors.boxShadow,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4.65,
    elevation: 8,
    marginHorizontal: 12,
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 18,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imageBoxMobile: {
    height: 102,
    width: '34vw',
  },
  imageContainer: {
    height: 40,
    width: 40,
  },
  imageContainerMobile: {
    height: 24,
    width: 40,
  },
  titleText: {
    marginTop: 18,
  },
  searchBar: {
    width: '50vw',
    alignSelf: 'center',
    marginTop: '54px',
  },
  contactUsSection: {
    height: 'max-content',
  },
});
