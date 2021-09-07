import React, { ReactElement, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { CollapsibleSection } from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import SubmitQuoteForm, {
  ICollapseSection,
} from '@homzhub/common/src/components/organisms/ServiceTickets/SubmitQuoteForm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

const SubmitQuote = (): ReactElement => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const attachments = useSelector(TicketSelectors.getQuoteAttachment);
  const quotes = useSelector(TicketSelectors.getQuotes);
  const { quotesCategory, submitQuote } = useSelector(TicketSelectors.getTicketLoaders);
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const [isLoading, setLoading] = useState(false);

  // HANDLERS

  const onUploadDoc = (index: number, tabIndex: number): void => {
    const prevQuotes = cloneDeep(quotes);
    const prevAttachments = cloneDeep(attachments);
    DocumentPicker.pick({
      type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
    })
      .then((doc) => {
        prevQuotes[tabIndex].data[index].document = doc;
        dispatch(TicketActions.setQuoteAttachment([...prevAttachments, doc]));
        dispatch(TicketActions.setQuotes(prevQuotes));
      })
      .catch((e) => {
        if (!DocumentPicker.isCancel(e)) {
          AlertHelper.error({ message: e.message });
        }
      });
  };

  const onBack = (): void => {
    dispatch(TicketActions.setQuotes([]));
    goBack();
  };

  // HANDLERS

  const renderSection = (data: ICollapseSection): ReactElement => {
    return (
      <CollapsibleSection title={t(data.title)} containerStyle={styles.cardContainer} titleStyle={styles.cardTitle}>
        {data.children}
      </CollapsibleSection>
    );
  };

  return (
    <UserScreen
      title={selectedTicket?.propertyName ?? ''}
      pageTitle={t('submitQuote')}
      onBackPress={onBack}
      keyboardShouldPersistTaps
      loading={quotesCategory || isLoading || submitQuote}
    >
      <SubmitQuoteForm
        renderCollapsibleSection={renderSection}
        onUploadDoc={onUploadDoc}
        onSuccess={onBack}
        setLoader={setLoading}
      />
    </UserScreen>
  );
};

export default SubmitQuote;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: theme.colors.gray10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardTitle: {
    color: theme.colors.darkTint1,
  },
});
