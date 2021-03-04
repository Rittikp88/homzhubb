import React, { ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import QuoteBox from '@homzhub/common/src/components/molecules/QuoteBox';
import { CollapsibleSection } from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { initialQuotes } from '@homzhub/common/src/constants/ServiceTickets';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const SubmitQuote = (): ReactNode => {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [comment, setComment] = useState('');

  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  // HANDLERS
  const updatePrice = (price: string, index: number): void => {
    const prevQuotes = [...quotes];
    prevQuotes[index].price = price;
    setQuotes(prevQuotes);
  };

  const onUploadDoc = (index: number): void => {
    const prevQuotes = [...quotes];
    DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    })
      .then((doc) => {
        prevQuotes[index].document = doc.name;
        setQuotes(prevQuotes);
      })
      .catch((e) => {
        AlertHelper.error({ message: e.message });
      });
  };

  const onRemovedDoc = (index: number): void => {
    const prevQuotes = [...quotes];
    prevQuotes[index].document = '';
    setQuotes(prevQuotes);
  };

  const onCommentChange = (value: string): void => {
    setComment(value);
  };
  // HANDLERS

  const filterData = quotes.filter((item) => !item.price || !item.document);
  const isDisabled = filterData.length === quotes.length;

  return (
    <UserScreen title={t('assetMore:more')} pageTitle={t('submitQuote')} onBackPress={goBack}>
      <View style={styles.container}>
        <Text type="small" textType="semiBold">
          {t('submitYourQuotes')}
        </Text>
        <Label type="large" style={styles.description}>
          {t('submitQuoteDescription')}
        </Label>
        <Divider />
        {quotes.map((item, index) => {
          return (
            <CollapsibleSection
              key={index}
              title={t(item.title)}
              containerStyle={styles.cardContainer}
              titleStyle={styles.cardTitle}
            >
              <QuoteBox
                document={item.document}
                onSetPrice={(price): void => updatePrice(price, index)}
                onUploadAttachment={(): void => onUploadDoc(index)}
                onRemoveAttachment={(): void => onRemovedDoc(index)}
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
        <Button type="primary" title={t('common:submit')} disabled={isDisabled} />
      </View>
    </UserScreen>
  );
};

export default SubmitQuote;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    color: theme.colors.darkTint3,
    marginVertical: 12,
  },
  cardContainer: {
    backgroundColor: theme.colors.gray10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardTitle: {
    color: theme.colors.darkTint1,
  },
  commentBox: {
    marginVertical: 20,
  },
});
