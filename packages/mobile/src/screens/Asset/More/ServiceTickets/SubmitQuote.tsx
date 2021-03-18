import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import QuoteBox from '@homzhub/common/src/components/molecules/QuoteBox';
import { CollapsibleSection } from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { IQuoteData, IQuoteSubmitPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IDocumentSource } from '@homzhub/common/src/services/AttachmentService/interfaces';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';
import { IInitialQuote, initialQuotes } from '@homzhub/common/src/constants/ServiceTickets';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const SubmitQuote = (): ReactElement => {
  const dispatch = useDispatch();
  const [quotes, setQuotes] = useState<IInitialQuote[]>([]);
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState<IDocumentSource[]>([]);
  const [quoteCategoryId, setQuoteCategoryId] = useState(0);
  const [isLoading, setLoader] = useState(false);

  const { goBack, navigate } = useNavigation();
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  useEffect(() => {
    setQuotes(initialQuotes);

    if (selectedTicket) {
      TicketRepository.getQuoteRequestCategory({
        ticketId: selectedTicket.ticketId,
        quoteRequestId: selectedTicket.quoteRequestId,
      })
        .then((res) => {
          // TODO: Add logic for multiple category once request flow ready.
          setQuoteCategoryId(res[0].id);
        })
        .catch((e) => AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) }));
    }
  }, []);

  // HANDLERS

  const onSubmit = async (): Promise<void> => {
    let updatePayload: IQuoteData[] = [];
    let attachmentIds: number[] = [];
    setLoader(true);
    if (attachments.length > 0) {
      /* Make an API call for uploading the document and extract the doc Id */
      const formData = new FormData();
      attachments.forEach((attachment: IDocumentSource) => {
        // @ts-ignore
        formData.append('files[]', attachment);
      });
      const response = await AttachmentService.uploadImage(formData, AttachmentType.TICKET_DOCUMENTS);
      const { data, error } = response;
      if (data && data.length > 0) {
        attachmentIds = data.map((i: { id: number }) => i.id);
      }
      if (error) {
        AlertHelper.error({ message: t('common:fileCorrupt') });
      }
    }

    if (attachmentIds.length > 0 && selectedTicket) {
      attachmentIds.forEach((doc, index) => {
        const quote = quotes[index];
        /* Creating quote payload */
        updatePayload = [
          ...updatePayload,
          {
            quote_number: quote.quoteNumber,
            price: Number(quote.price),
            currency: selectedTicket && selectedTicket.currency ? selectedTicket.currency.currencyCode : 'INR',
            attachment: doc,
          },
        ];
      });

      /* Creating Final payload for submit quote */
      const submitPayload: IQuoteSubmitPayload = {
        param: {
          ticketId: selectedTicket.ticketId,
          quoteRequestId: selectedTicket.quoteRequestId,
        },
        data: {
          quote_group: [
            {
              quote_request_category: quoteCategoryId,
              quotes: updatePayload ?? [],
            },
          ],
          ...(!!comment && { comment }),
        },
      };

      TicketRepository.quoteSubmit(submitPayload)
        .then(() => {
          AlertHelper.success({ message: t('quoteSubmission') });
          navigate(ScreensKeys.ServiceTicketDetail);
          setQuotes(initialQuotes);
          setLoader(false);
          dispatch(TicketActions.getTickets());
        })
        .catch((e) => {
          setLoader(false);
          AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
        });
    }
  };

  const updatePrice = (price: string, index: number): void => {
    const prevQuotes = cloneDeep(quotes);
    prevQuotes[index].price = price;
    setQuotes(prevQuotes);
  };

  const onUploadDoc = (index: number): void => {
    const prevQuotes = cloneDeep(quotes);
    const prevAttachments = cloneDeep(attachments);
    DocumentPicker.pick({
      type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
    })
      .then((doc) => {
        prevQuotes[index].document = doc;
        setAttachments([...prevAttachments, doc]);
        setQuotes(prevQuotes);
      })
      .catch((e) => {
        AlertHelper.error({ message: e.message });
      });
  };

  const onRemovedDoc = (index: number): void => {
    const prevQuotes = cloneDeep(quotes);
    const prevAttachment = cloneDeep(attachments);
    prevQuotes[index].document = null;
    prevAttachment.splice(index, 1);
    setQuotes(prevQuotes);
    setAttachments(prevAttachment);
  };

  const onCommentChange = (value: string): void => {
    setComment(value);
  };

  const onBack = (): void => {
    setQuotes(initialQuotes);
    goBack();
  };

  // HANDLERS

  const filterData = quotes.filter((item) => !item.price || !item.document);
  const isDisabled = filterData.length === quotes.length;

  return (
    <UserScreen
      title={selectedTicket?.propertyName ?? ''}
      pageTitle={t('submitQuote')}
      onBackPress={onBack}
      loading={isLoading}
    >
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
                document={item.document?.name ?? ''}
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
        <Button type="primary" title={t('common:submit')} disabled={isDisabled} onPress={onSubmit} />
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
