import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import QuotePreview from '@homzhub/common/src/components/molecules/QuotePreview';
import { CollapsibleSection } from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { QuoteCategory } from '@homzhub/common/src/domain/models/QuoteCategory';
import { quotesPreview } from '@homzhub/common/src/constants/ServiceTickets';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const ApproveQuote = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  const [comment, setComment] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<number[]>([]);

  // TODO: Use data from API
  const quotes = ObjectMapper.deserializeArray(QuoteCategory, quotesPreview);

  // HANDLERS
  const onSelectQuote = (id: number, index: number): void => {
    const updateQuote = [...selectedQuote];
    updateQuote[index] = id;
    setSelectedQuote(updateQuote);
  };

  const onCommentChange = (value: string): void => {
    setComment(value);
  };
  // HANDLERS

  return (
    <UserScreen title={t('tickets')} pageTitle={t('approveQuote')} onBackPress={goBack}>
      <View style={styles.container}>
        <Text type="small" textType="semiBold">
          {t('submittedQuotes')}
        </Text>
        <Label type="large" style={styles.description}>
          {t('approveQuoteDescription')}
        </Label>
        {quotes.map((item, index) => {
          return (
            <CollapsibleSection
              key={index}
              title={item.name}
              collapseIcon={icons.upArrow}
              expandIcon={icons.downArrow}
              containerStyle={styles.cardContainer}
              titleStyle={styles.cardTitle}
              iconStyle={styles.iconStyle}
            >
              <QuotePreview
                detail={item.quoteSubmitGroup}
                selectedQuote={selectedQuote[index]}
                onSelectQuote={(id): void => onSelectQuote(id, index)}
              />
            </CollapsibleSection>
          );
        })}
        <TextArea
          value={comment}
          label={t('common:comment')}
          helpText={t('common:optional')}
          placeholder={t('common:typeComment')}
          wordCountLimit={450}
          onMessageChange={onCommentChange}
          containerStyle={styles.commentBox}
        />
        <Button type="primary" title={t('common:accept')} disabled={!selectedQuote.length} />
      </View>
    </UserScreen>
  );
};

export default ApproveQuote;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    color: theme.colors.darkTint3,
    marginVertical: 12,
  },
  cardContainer: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: theme.colors.disabled,
    paddingVertical: 12,
  },
  cardTitle: {
    color: theme.colors.darkTint2,
    paddingHorizontal: 16,
  },
  iconStyle: {
    paddingHorizontal: 16,
  },
  commentBox: {
    marginVertical: 20,
  },
});
